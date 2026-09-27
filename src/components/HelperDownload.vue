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
      <a
        :href="ciaUrl ?? undefined"
        :aria-disabled="ciaUrl === null"
        :class="{ 'is-disabled': ciaUrl === null }"
        class="btn btn-download"
        target="_blank"
        rel="noopener noreferrer"
      >
        {{ $t('installation.helperDownloadCia') }}
      </a>
      <a
        :href="dsxUrl ?? undefined"
        :aria-disabled="dsxUrl === null"
        :class="{ 'is-disabled': dsxUrl === null }"
        class="btn btn-secondary"
        target="_blank"
        rel="noopener noreferrer"
      >
        {{ $t('installation.helperDownload3dsx') }}
      </a>
    </div>

    <p v-if="version" class="version-text">
      {{ $t('installation.helperVersion', { version }) }}
    </p>

    <div v-if="ciaUrl" class="helper-qr">
      <h4>{{ $t('installation.helperQrTitle') }}</h4>
      <QrCode :value="ciaUrl" :alt="$t('installation.helperQrTitle')" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import QrCode from './QrCode.vue'

// The Helper binaries are hosted on GitHub Releases, next to boot.firm.
// The version string is self-hosted in the /dyn/ folder (e.g. "v0.1.0").
const VERSION_PATH = '/dyn/helper.version'
const HELPER_RELEASE_BASE_URL =
  'https://github.com/3ds-presence/Presence3DS-Helper/releases/download'

const VERSION_PATTERN = /^v?\d+(\.\d+){0,3}([-+][0-9A-Za-z.-]+)?$/

const version = ref<string | null>(null)

// Absolute GitHub Release URLs derived from the detected version, so FBI
// downloads the .cia directly and the QR code points to the same file.
const ciaUrl = computed<string | null>(() =>
  version.value
    ? `${HELPER_RELEASE_BASE_URL}/${version.value}/presence3ds-helper.cia`
    : null,
)
const dsxUrl = computed<string | null>(() =>
  version.value
    ? `${HELPER_RELEASE_BASE_URL}/${version.value}/presence3ds-helper.3dsx`
    : null,
)

onMounted(async () => {
  try {
    const response = await fetch(VERSION_PATH)
    if (!response.ok) {
      return
    }
    const text = (await response.text()).trim()
    if (VERSION_PATTERN.test(text)) {
      version.value = text.startsWith('v') ? text : `v${text}`
    }
  } catch {
    // Keep the download buttons disabled and the QR code hidden when the
    // version file is missing or unreachable.
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

.helper-buttons .is-disabled {
  opacity: 0.5;
  pointer-events: none;
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
