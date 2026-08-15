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
  <div class="download-button">
    <a href="/dyn/boot.firm" class="btn btn-download" download>
      {{ $t('installation.downloadBinary') }}
    </a>
    <p class="version-text">
      {{ $t('downloadButton.version', { version: version }) }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const version = ref('unknown')

const VERSION_PATTERN = /^v?\d+(\.\d+){0,3}([-+][0-9A-Za-z.-]+)?$/

onMounted(async () => {
  try {
    const response = await fetch('/dyn/version')
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`)
    }
    const text = (await response.text()).trim()
    if (VERSION_PATTERN.test(text)) {
      version.value = text
    }
  } catch (e) {
    // Keep "unknown"
  }
})
</script>

<style scoped>
.download-button {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}

.version-text {
  font-size: 12px;
  color: #888;
  margin: 0;
}
</style>