<template>
  <div class="card">
    <h2 class="card-title">{{ $t('downloadConfig.title') }}</h2>
    <p style="margin-bottom: 16px; color: #666;">
      {{ $t('downloadConfig.description') }}
    </p>
    <button class="btn btn-download" @click="downloadConfig">
      {{ $t('downloadConfig.button') }}
    </button>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  uuid: string
  aesKeyHex: string
}>()

function generateConfigContent(uuid: string, aesKey: string): string {
  const host = window.location.hostname;
  const port = 80; // Hardcoded port because if the user use a https connection, the port will be 443 and we want to use the http connection on the 3ds
  
  return `UUID=${uuid}\nAES_KEY=${aesKey}\nSERVER_HOST=${host}\nSERVER_PORT=${port}`
}

function downloadConfig() {
  const content = generateConfigContent(props.uuid, props.aesKeyHex)
  const blob = new Blob([content], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'discord_rpc.conf'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
</script>