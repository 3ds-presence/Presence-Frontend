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
  <div class="card">
    <h2 class="card-title">{{ $t('consent.title') }}</h2>
    <p class="consent-description">{{ $t('consent.description') }}</p>

    <ul class="consent-data-list">
      <li v-for="(item, index) in dataItems" :key="index">{{ item }}</li>
    </ul>

    <p class="consent-privacy-link">
      <a href="/privacy" @click.prevent="showPrivacy = true">{{ $t('consent.readPrivacy') }}</a>
    </p>

    <div class="consent-checkbox">
      <input id="consent-check" type="checkbox" v-model="accepted" />
      <label for="consent-check">{{ $t('consent.checkbox') }}</label>
    </div>

    <button class="btn btn-primary" :disabled="!accepted || submitting" @click="confirmConsent">
      {{ submitting ? $t('consent.submitting') : $t('consent.button') }}
    </button>

    <p v-if="error" class="error-msg">{{ error }}</p>

    <PrivacyPolicyModal v-if="showPrivacy" @close="showPrivacy = false" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import PrivacyPolicyModal from './PrivacyPolicyModal.vue'

const { t } = useI18n()

const props = defineProps<{
  tempToken: string
}>()

const emit = defineEmits<{
  (e: 'consent-success', uuid: string, aesKeyHex: string): void
  (e: 'consent-error', message: string): void
}>()

const accepted = ref(false)
const submitting = ref(false)
const error = ref<string | null>(null)
const showPrivacy = ref(false)

const dataItems = [
  t('consent.data.discordId'),
  t('consent.data.game'),
  t('consent.data.mii'),
  t('consent.data.ip'),
]

async function confirmConsent() {
  submitting.value = true
  error.value = null

  try {
    const formData = new URLSearchParams()
    formData.append('temp_token', props.tempToken)

    const response = await fetch('/api/confirm-consent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: formData.toString(),
    })

    const text = await response.text()
    const result = new URLSearchParams(text)

    if (response.ok) {
      const uuid = result.get('uuid')
      const aesKeyHex = result.get('aes_key_hex')
      if (uuid && aesKeyHex) {
        emit('consent-success', uuid, aesKeyHex)
      } else {
        error.value = t('consent.error.invalidResponse')
      }
    } else {
      const errCode = result.get('error')
      if (errCode === 'consent_expired') {
        emit('consent-error', t('consent.error.expired'))
      } else {
        error.value = result.get('message') || `Error ${response.status}`
      }
    }
  } catch (e: any) {
    error.value = t('app.error.connectionError', { message: e.message || e })
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
.consent-description {
  margin-bottom: 16px;
  line-height: 1.6;
  color: #444;
}

.consent-data-list {
  margin-bottom: 16px;
  padding-left: 20px;
  color: #555;
  line-height: 1.8;
}

.consent-privacy-link {
  margin-bottom: 16px;
}

.consent-privacy-link a {
  color: #5865f2;
  text-decoration: underline;
}

.consent-checkbox {
  margin-bottom: 20px;
  display: flex;
  align-items: flex-start;
  gap: 8px;
}

.consent-checkbox input {
  margin-top: 3px;
}

.consent-checkbox label {
  font-size: 14px;
  line-height: 1.5;
  color: #333;
}

.btn-primary {
  background: #5865f2;
  color: #fff;
  width: 100%;
  padding: 12px;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-primary:hover:not(:disabled) {
  background: #4752c4;
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>