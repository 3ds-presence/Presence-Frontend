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
  <div class="helper-download">
    <div class="helper-buttons">
      <a :href="CIA_PATH" class="btn btn-download" download="presence3ds-helper.cia">
        {{ $t('installation.helperDownloadCia') }}
      </a>
      <a :href="DSX_PATH" class="btn btn-secondary" download="presence3ds-helper.3dsx">
        {{ $t('installation.helperDownload3dsx') }}
      </a>
    </div>

    <p v-if="version" class="version-text">
      {{ $t('installation.helperVersion', { version }) }}
    </p>

    <div class="helper-qr">
      <h4>{{ $t('installation.helperQrTitle') }}</h4>
      <QrCode :value="ciaUrl" :alt="$t('installation.helperQrTitle')" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import QrCode from './QrCode.vue'

// The helper is self-hosted next to boot.firm in the /dyn/ folder.
const CIA_PATH = '/dyn/presence3ds-helper.cia'
const DSX_PATH = '/dyn/presence3ds-helper.3dsx'
const VERSION_PATH = '/dyn/helper.version'

const VERSION_PATTERN = /^v?\d+(\.\d+){0,3}([-+][0-9A-Za-z.-]+)?$/

// Absolute URL encoded in the QR code so FBI can download the .cia directly.
const ciaUrl = computed(() => new URL(CIA_PATH, window.location.origin).href)

const version = ref<string | null>(null)

onMounted(async () => {
  try {
    const response = await fetch(VERSION_PATH)
    if (!response.ok) {
      return
    }
    const text = (await response.text()).trim()
    if (VERSION_PATTERN.test(text)) {
      version.value = text
    }
  } catch {
    // Keep the version hidden if the file is missing or unreachable.
  }
})
</script>

<style scoped>
.helper-download {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}

.helper-buttons {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 12px;
}

.version-text {
  font-size: 12px;
  color: #888;
  margin: 0;
}

.helper-qr {
  margin-top: 20px;
  text-align: center;
}

.helper-qr h4 {
  margin-bottom: 4px;
}
</style>
