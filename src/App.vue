<template>
  <div>
    <LanguageSwitcher />
    <h1 style="text-align: center; margin-bottom: 24px;">{{ $t('app.title') }}</h1>

    <div v-if="error" class="error-msg">
      {{ error }}
    </div>

    <DiscordLogin v-if="!hasInfo && !processing" />
    <p v-else-if="processing" style="text-align: center; color: #666;">{{ $t('app.processing') }}</p>

    <template v-if="accountInfo">
      <AccountInfo :uuid="accountInfo.uuid" :aesKeyHex="accountInfo.aesKeyHex" @aes-key-updated="onAesKeyUpdated" />
      <DownloadConfig :uuid="accountInfo.uuid" :aesKeyHex="accountInfo.aesKeyHex" />
      <InstallationSection />
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import LanguageSwitcher from './components/LanguageSwitcher.vue'
import DiscordLogin from './components/DiscordLogin.vue'
import AccountInfo from './components/AccountInfo.vue'
import DownloadConfig from './components/DownloadConfig.vue'
import InstallationSection from './components/InstallationSection.vue'

const { t } = useI18n()

const uuid = ref<string | null>(null)
const aesKeyHex = ref<string | null>(null)
const error = ref<string | null>(null)
const processing = ref(false)

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

onMounted(async () => {
  const params = new URLSearchParams(window.location.search)
  const code = params.get('code')

  if (code) {
    window.history.replaceState({}, '', window.location.pathname)

    processing.value = true
    error.value = null

    try {
      const formData = new URLSearchParams()
      formData.append('code', code)

      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData.toString(),
      })

      const text = await response.text()
      const result = new URLSearchParams(text)

      if (response.ok) {
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