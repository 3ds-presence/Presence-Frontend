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
  <div class="download-tabs">
    <VersionBadge />

    <div class="tabs" role="tablist" :aria-label="$t('downloadTabs.ariaLabel')">
      <button
        id="tab-helper"
        type="button"
        class="tab"
        :class="{ 'tab-active': activeTab === 'helper' }"
        role="tab"
        :aria-selected="activeTab === 'helper'"
        aria-controls="panel-helper"
        :tabindex="activeTab === 'helper' ? 0 : -1"
        @click="selectTab('helper')"
        @keydown="onKeydown"
      >
        {{ $t('downloadTabs.helper') }}
      </button>
      <button
        id="tab-manual"
        type="button"
        class="tab"
        :class="{ 'tab-active': activeTab === 'manual' }"
        role="tab"
        :aria-selected="activeTab === 'manual'"
        aria-controls="panel-manual"
        :tabindex="activeTab === 'manual' ? 0 : -1"
        @click="selectTab('manual')"
        @keydown="onKeydown"
      >
        {{ $t('downloadTabs.manual') }}
      </button>
    </div>

    <section
      id="panel-helper"
      class="tab-panel"
      role="tabpanel"
      aria-labelledby="tab-helper"
      :hidden="activeTab !== 'helper'"
    >
      <h3>{{ $t('installation.helperTitle') }}</h3>
      <p>{{ $t('installation.helperDescription') }}</p>

      <HelperDownload />

      <template v-if="!compact">
        <h4>{{ $t('installation.helperStepsTitle') }}</h4>
        <ol>
          <li v-for="(step, i) in helperSteps" :key="i">{{ step }}</li>
        </ol>
      </template>
    </section>

    <section
      id="panel-manual"
      class="tab-panel"
      role="tabpanel"
      aria-labelledby="tab-manual"
      :hidden="activeTab !== 'manual'"
    >
      <h3>{{ $t('installation.manualTitle') }}</h3>
      <p>{{ $t('installation.manualDescription') }}</p>

      <DownloadButton />

      <template v-if="!compact">
        <h4>{{ $t('installation.steps') }}</h4>
        <ol>
          <li v-for="(step, i) in manualSteps" :key="i">{{ step }}</li>
        </ol>
      </template>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import HelperDownload from './HelperDownload.vue'
import DownloadButton from './DownloadButton.vue'
import VersionBadge from './VersionBadge.vue'

withDefaults(
  defineProps<{
    compact?: boolean
  }>(),
  {
    compact: false,
  }
)

type Tab = 'helper' | 'manual'

const { tm } = useI18n()

const activeTab = ref<Tab>('helper')

const helperSteps = computed(
  () => (tm('installation.helperStepsList') as unknown as string[]) ?? []
)
const manualSteps = computed(
  () => (tm('installation.stepsList') as unknown as string[]) ?? []
)

function selectTab(tab: Tab) {
  activeTab.value = tab
  document.getElementById(`tab-${tab}`)?.focus()
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'ArrowLeft') {
    selectTab('helper')
  } else if (event.key === 'ArrowRight') {
    selectTab('manual')
  }
}
</script>

<style scoped>
.download-tabs {
  width: 100%;
  margin-top: 0;
  text-align: center;
}

.tabs {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 8px;
  margin-bottom: 16px;
  border-bottom: 1px solid #ddd;
}

.tab {
  padding: 10px 14px;
  border: none;
  border-bottom: 3px solid transparent;
  background: none;
  color: #666;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: color 0.2s, border-color 0.2s;
}

.tab:hover {
  color: #333;
}

.tab-active {
  color: #5865f2;
  border-bottom-color: #5865f2;
}

.tab-panel h3 {
  font-size: 16px;
  margin-bottom: 8px;
}

.tab-panel h4 {
  margin-top: 16px;
}

.tab-panel ol {
  text-align: left;
  list-style-position: outside;
  padding-left: 20px;
  margin: 8px 0;
}

.tab-panel li {
  margin-bottom: 4px;
}
</style>
