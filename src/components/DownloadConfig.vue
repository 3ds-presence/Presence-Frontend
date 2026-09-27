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
    <h2 class="card-title">{{ $t('downloadConfig.title') }}</h2>
    <p style="margin-bottom: 16px; color: #666;">
      {{ $t('downloadConfig.description') }}
    </p>
    <div class="config-actions">
      <button class="btn btn-download" @click="downloadConfig">
        {{ $t('downloadConfig.button') }}
      </button>
      <button
        class="btn btn-secondary"
        aria-controls="config-qr"
        :aria-expanded="showQr"
        @click="showQr = !showQr"
      >
        {{ showQr ? $t('downloadConfig.hideQr') : $t('downloadConfig.showQr') }}
      </button>
    </div>

    <div v-if="showQr" id="config-qr" class="config-qr">
      <p class="qr-warning">{{ $t('downloadConfig.qrWarning') }}</p>
      <QrCode :value="qrContent" :alt="$t('downloadConfig.qrAlt')" />
      <p class="qr-help">{{ $t('downloadConfig.qrHelp') }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import QrCode from './QrCode.vue'

const props = defineProps<{
  uuid: string
  aesKeyHex: string
}>()

// Hardcoded port because if the user uses an https connection, the port will be
// 443 and we want to use the http connection on the 3DS.
const SERVER_PORT = 80

const showQr = ref(false)

function serverHost(): string {
  return window.location.hostname
}

function generateConfigContent(uuid: string, aesKey: string): string {
  return `UUID=${uuid}\nAES_KEY=${aesKey}\nSERVER_HOST=${serverHost()}\nSERVER_PORT=${SERVER_PORT}`
}

// Presence3DS Helper expects the QR payload to be the 4 raw values on separate
// lines (uuid, aes key, host, port), without the KEY= prefixes of the config file.
function generateQrContent(uuid: string, aesKey: string): string {
  return `${uuid}\n${aesKey}\n${serverHost()}\n${SERVER_PORT}`
}

function downloadConfig() {
  const content = generateConfigContent(props.uuid, props.aesKeyHex)
  const blob = new Blob([content], { type: 'application/octet-stream' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'discord_rpc.conf'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

const qrContent = computed(() => generateQrContent(props.uuid, props.aesKeyHex))
</script>

<style scoped>
.config-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.config-qr {
  margin-top: 20px;
  text-align: center;
}

.qr-help {
  font-size: 14px;
  color: #666;
  margin: 8px 0 0 0;
}

.qr-warning {
  margin: 0 0 12px 0;
  font-size: 14px;
  font-weight: 700;
}
</style>