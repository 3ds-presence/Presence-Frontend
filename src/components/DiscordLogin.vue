<!--
3DS Presence — Discord Rich Presence for Nintendo 3DS
Copyright (C) 2026 3DS Presence - LeonLeBreton

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as published
by the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.
-->

<template>
  <div class="card" style="text-align: center;">
    <h2 class="card-title">{{ $t('discordLogin.title') }}</h2>
    <p style="margin-bottom: 20px; color: #666;">
      {{ $t('discordLogin.description') }}
    </p>
    <button class="btn btn-discord" :disabled="loading" @click="login">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 127.14 96.36" width="24" height="18" fill="white">
        <path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,46,96.12,53,91.08,65.69,84.69,65.69Z"/>
      </svg>
      {{ loading ? $t('discordLogin.loading') : $t('discordLogin.button') }}
    </button>
    <p v-if="error" class="error-msg" style="margin-top: 12px;">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { TURNSTILE_SITEKEY } from '../config'

const { t } = useI18n()

const loading = ref(false)
const error = ref<string | null>(null)

// Reference to the Turnstile widget state (explicit execution).
let turnstileWidgetId: string | null = null
// Resolver for the pending invisible-challenge execution.
let pendingResolve: ((token: string | undefined) => void) | null = null

interface TurnstileApi {
  render: (container: HTMLElement, options: any) => string
  execute: (widgetId?: string) => void
  reset: (widgetId?: string) => void
  getResponse: (widgetId?: string) => string | undefined
}

declare global {
  interface Window {
    turnstile?: TurnstileApi
  }
}

function loadTurnstileScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (window.turnstile) {
      resolve()
      return
    }

    const existing = document.querySelector<HTMLScriptElement>(
      'script[src^="https://challenges.cloudflare.com/turnstile/v0/api.js"]'
    )
    if (existing) {
      existing.addEventListener('load', () => resolve())
      existing.addEventListener('error', () => reject(new Error('Turnstile script failed to load')))
      return
    }

    const script = document.createElement('script')
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'
    script.async = true
    script.defer = true
    script.addEventListener('load', () => resolve())
    script.addEventListener('error', () => reject(new Error('Turnstile script failed to load')))
    document.head.appendChild(script)
  })
}

function renderTurnstile(): void {
  if (!window.turnstile || !TURNSTILE_SITEKEY) return

  const container = document.createElement('div')
  container.style.display = 'none'
  document.body.appendChild(container)

  turnstileWidgetId = window.turnstile.render(container, {
    sitekey: TURNSTILE_SITEKEY,
    size: 'invisible',
    callback: () => {
      if (pendingResolve) {
        const token = window.turnstile!.getResponse(turnstileWidgetId!)
        pendingResolve(token)
        pendingResolve = null
      }
    },
    'expired-callback': () => {
      error.value = t('discordLogin.captchaError')
      if (pendingResolve) {
        pendingResolve(undefined)
        pendingResolve = null
      }
    },
  })
}

/**
 * Run the Turnstile challenge, then ask the backend for a fresh Discord
 * authorization URL (which is only issued after the captcha passes).
 */
async function login() {
  if (loading.value) return
  loading.value = true
  error.value = null

  try {
    await loadTurnstileScript()

    if (turnstileWidgetId == null) {
      renderTurnstile()
    }

    let token: string | undefined
    if (TURNSTILE_SITEKEY && window.turnstile) {
      const widgetId = turnstileWidgetId!
      // Execute the invisible challenge and wait for the token (the callbacks
      // registered at render time resolve this promise).
      token = await new Promise<string | undefined>((resolve) => {
        pendingResolve = resolve
        try {
          window.turnstile!.execute(widgetId)
        } catch {
          window.turnstile!.reset(widgetId)
          window.turnstile!.execute(widgetId)
        }
      })
    }

    // Request the Discord authorization URL (backend verifies the captcha token).
    const formData = new URLSearchParams()
    if (token) {
      formData.append('turnstile_token', token)
    }

    const response = await fetch('/api/oauth/start', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: formData.toString(),
    })
    const text = await response.text()
    const result = new URLSearchParams(text)

    if (!response.ok) {
      const errCode = result.get('error')
      if (errCode === 'turnstile_failed') {
        error.value = t('discordLogin.captchaError')
      } else {
        error.value = result.get('message') || `Error ${response.status}`
      }
      // Reset Turnstile so a retry runs a fresh challenge.
      if (turnstileWidgetId != null && window.turnstile) {
        window.turnstile.reset(turnstileWidgetId)
      }
      return
    }

    const url = result.get('url')
    if (!url) {
      error.value = t('app.error.invalidResponse', { message: '' })
      return
    }

    window.location.href = url
  } catch (e: any) {
    error.value = t('app.error.connectionError', { message: e.message || e })
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  // Pre-load the Turnstile script so the first click is fast.
  if (TURNSTILE_SITEKEY) {
    loadTurnstileScript().then(renderTurnstile).catch(() => { /* shown on click */ })
  }
})
</script>