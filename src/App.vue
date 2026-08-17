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
  <FaqPage v-if="isFaqPage" />
  <TermsOfServicePage v-else-if="isTermsPage" />
  <PrivacyPolicyPage v-else-if="isPrivacyPage" />

  <div v-else>
    <LanguageSwitcher />

    <div v-if="error" class="error-msg">
      {{ error }}
    </div>

    <HeroSection v-if="!hasInfo && !processing && !showConsent" />
    <p v-else-if="processing" style="text-align: center; color: #666;">{{ $t('app.processing') }}</p>

    <div v-if="showConsent && tempToken">
      <ConsentForm
        :tempToken="tempToken"
        @consent-success="onConsentSuccess"
        @consent-error="onConsentError"
      />
    </div>

    <template v-if="accountInfo">
      <AccountInfo :uuid="accountInfo.uuid" :aesKeyHex="accountInfo.aesKeyHex" @aes-key-updated="onAesKeyUpdated" />
      <DownloadConfig :uuid="accountInfo.uuid" :aesKeyHex="accountInfo.aesKeyHex" />
      <InstallationSection />
    </template>

    <SiteFooter />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import LanguageSwitcher from './components/LanguageSwitcher.vue'
import HeroSection from './components/HeroSection.vue'
import ConsentForm from './components/ConsentForm.vue'
import SiteFooter from './components/SiteFooter.vue'
import AccountInfo from './components/AccountInfo.vue'
import DownloadConfig from './components/DownloadConfig.vue'
import InstallationSection from './components/InstallationSection.vue'
import PrivacyPolicyPage from './components/PrivacyPolicyPage.vue'
import TermsOfServicePage from './components/TermsOfServicePage.vue'
import FaqPage from './components/FaqPage.vue'
import { updateSeo } from './utils/seo'

const { t, locale } = useI18n()

const uuid = ref<string | null>(null)
const aesKeyHex = ref<string | null>(null)
const tempToken = ref<string | null>(null)
const error = ref<string | null>(null)
const processing = ref(false)
const showConsent = ref(false)
const isPrivacyPage = ref(window.location.pathname === '/privacy')
const isTermsPage = ref(window.location.pathname === '/terms')
const isFaqPage = ref(window.location.pathname === '/faq')

const hasInfo = computed(() => Boolean(uuid.value && aesKeyHex.value))
const accountInfo = computed(() => {
  if (!uuid.value || !aesKeyHex.value) {
    return null
  }

  return {
    uuid: uuid.value,
    aesKeyHex: aesKeyHex.value,
  }
})

function onAesKeyUpdated(newKey: string) {
  aesKeyHex.value = newKey
}

function onConsentSuccess(newUuid: string, newAesKeyHex: string) {
  uuid.value = newUuid
  aesKeyHex.value = newAesKeyHex
  showConsent.value = false
  tempToken.value = null
}

function onConsentError(message: string) {
  error.value = message
  showConsent.value = false
  tempToken.value = null
}

function updateHomeSeo() {
  updateSeo(
    `${t('app.title')}: Discord RPC for Nintendo 3DS`,
    'Discord Rich Presence for Nintendo 3DS: Show the game you are playing on your Nintendo 3DS directly in your Discord status. Free and open source.'
  )
}

watch(locale, () => {
  // Only update home SEO on non-standalone pages.
  // Standalone pages (privacy/terms/faq) manage their own SEO.
  if (!isPrivacyPage.value && !isTermsPage.value && !isFaqPage.value) {
    updateHomeSeo()
  }
})

onMounted(async () => {
  if (isPrivacyPage.value || isTermsPage.value || isFaqPage.value) {
    return
  }
  updateHomeSeo()

  const params = new URLSearchParams(window.location.search)
  const code = params.get('code')
  const state = params.get('state')

  if (code) {
    window.history.replaceState({}, '', window.location.pathname)

    processing.value = true
    error.value = null

    try {
      const formData = new URLSearchParams()
      formData.append('code', code)
      if (state) {
        formData.append('state', state)
      }

      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData.toString(),
      })

      const text = await response.text()
      const result = new URLSearchParams(text)

      if (response.ok) {
        const needsConsent = result.get('needs_consent')
        const gotToken = result.get('temp_token')

        if (needsConsent === 'true' && gotToken) {
          tempToken.value = gotToken
          showConsent.value = true
          processing.value = false
          return
        }

        const gotUuid = result.get('uuid')
        const gotKey = result.get('aes_key_hex')

        if (gotUuid && gotKey) {
          uuid.value = gotUuid
          aesKeyHex.value = gotKey
        } else {
          error.value = t('app.error.invalidResponse')
        }
      } else {
        const errMsg = result.get('message') || `Error ${response.status}`
        error.value = errMsg
      }
    } catch (e: any) {
      error.value = t('app.error.connectionError', { message: e.message || e })
    } finally {
      processing.value = false
    }
  }
})
</script>