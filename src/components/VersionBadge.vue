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
  <p class="version-badge">
    {{ $t('downloadButton.version', { version: displayedVersion }) }}
  </p>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'

const VERSION_PATH = '/dyn/version'

const VERSION_PATTERN = /^v?\d+(\.\d+){0,3}([-+][0-9A-Za-z.-]+)?$/

const { t } = useI18n()

const version = ref<string | null>(null)

// Always show a version line; fall back to a localized "unknown" when the
// version file is not served (e.g. local development without /dyn/).
const displayedVersion = computed(
  () => version.value ?? t('downloadButton.versionUnknown')
)

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
    // Keep the fallback version when the file is missing or unreachable.
  }
})
</script>

<style scoped>
.version-badge {
  font-size: 12px;
  color: #888;
  margin: 0 0 12px 0;
}
</style>
