<template>
  <div class="card">
    <h2 class="card-title">Configuration</h2>
    <p style="margin-bottom: 16px; color: #666;">
      Téléchargez un fichier contenant vos identifiants pour configurer le client 3DS.
    </p>
    <button class="btn btn-download" @click="downloadConfig">
      Télécharger la configuration
    </button>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  uuid: string
  aesKeyHex: string
}>()

function generateConfigContent(uuid: string, aesKey: string): string {
  return `uuid=${uuid}\naes_key_hex=${aesKey}`
}

function downloadConfig() {
  const content = generateConfigContent(props.uuid, props.aesKeyHex)
  const blob = new Blob([content], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = '3ds-presence-config.txt'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
</script>