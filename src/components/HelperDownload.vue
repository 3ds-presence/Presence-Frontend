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
        :href="ciaUrl"
        class="btn btn-download"
        target="_blank"
        rel="noopener noreferrer"
      >
        {{ $t('installation.helperDownloadCia') }}
      </a>
      <a
        :href="dsxUrl"
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

    <div class="helper-qr">
      <h4>{{ $t('installation.helperQrTitle') }}</h4>
      <QrCode :value="ciaUrl" :alt="$t('installation.helperQrTitle')" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import QrCode from './QrCode.vue'

const LATEST_RELEASE_API =
  'https://api.github.com/repos/3ds-presence/Presence3DS-Helper/releases/latest'
const ciaUrl =
  'https://github.com/3ds-presence/Presence3DS-Helper/releases/latest/download/presence3ds-helper.cia'
const dsxUrl =
  'https://github.com/3ds-presence/Presence3DS-Helper/releases/latest/download/presence3ds-helper.3dsx'

const VERSION_PATTERN = /^v?\d+(\.\d+){0,3}([-+][0-9A-Za-z.-]+)?$/

const version = ref<string | null>(null)

onMounted(async () => {
  try {
    const response = await fetch(LATEST_RELEASE_API)
    if (!response.ok) {
      return
    }
    const release: unknown = await response.json()
    if (
      typeof release === 'object' &&
      release !== null &&
      'tag_name' in release &&
      typeof release.tag_name === 'string'
    ) {
      const tag = release.tag_name.trim()
      if (VERSION_PATTERN.test(tag)) {
        version.value = tag.startsWith('v') ? tag : `v${tag}`
      }
    }
  } catch {
    // Keep the version text hidden when the release API is unreachable.
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
