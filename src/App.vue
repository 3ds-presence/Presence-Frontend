<template>
  <div>
    <h1 style="text-align: center; margin-bottom: 24px;">3DS Presence</h1>

    <div v-if="error" class="error-msg">
      {{ error }}
    </div>

    <DiscordLogin v-if="!hasInfo && !processing" />
    <p v-else-if="processing" style="text-align: center; color: #666;">Connexion en cours...</p>

    <template v-if="accountInfo">
      <AccountInfo :uuid="accountInfo.uuid" :aesKeyHex="accountInfo.aesKeyHex" />
      <DownloadConfig :uuid="accountInfo.uuid" :aesKeyHex="accountInfo.aesKeyHex" />
      <InstallationSection />
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import DiscordLogin from './components/DiscordLogin.vue'
import AccountInfo from './components/AccountInfo.vue'
import DownloadConfig from './components/DownloadConfig.vue'
import InstallationSection from './components/InstallationSection.vue'

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
          error.value = 'Réponse du serveur invalide : champs manquants'
        }
      } else {
        const errMsg = result.get('message') || `Erreur ${response.status}`
        error.value = errMsg
      }
    } catch (e: any) {
      error.value = `Erreur de connexion au serveur : ${e.message || e}`
    } finally {
      processing.value = false
    }
  }
})
</script>