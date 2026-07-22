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
  <div class="lang-switcher">
    <button class="lang-btn" @click="open = !open" :title="currentLangName">
      <img :src="`/imgs/flags/${locale}.svg`" :alt="locale" class="flag-icon" />
    </button>
    <div v-if="open" class="lang-dropdown" @click="open = false">
      <button
        v-for="lang in languages"
        :key="lang.code"
        class="lang-option"
        :class="{ active: lang.code === locale }"
        @click="changeLang(lang.code)"
      >
        <img :src="`/imgs/flags/${lang.code}.svg`" :alt="lang.code" class="flag-icon" />
        {{ lang.name }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { locale, t } = useI18n()
const open = ref(false)

const languages = computed(() => [
  { code: 'en', name: t('languageSwitcher.en') },
  { code: 'fr', name: t('languageSwitcher.fr') },
])

const currentLangName = computed(() => {
  const lang = languages.value.find(l => l.code === locale.value)
  return lang ? lang.name : locale.value
})

function changeLang(code: string) {
  locale.value = code
  localStorage.setItem('locale', code)
  open.value = false
}
</script>

<style scoped>
.lang-switcher {
  position: fixed;
  top: 16px;
  right: 16px;
  z-index: 1000;
}

.lang-btn {
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 6px;
  padding: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  transition: box-shadow 0.2s;
}

.lang-btn:hover {
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
}

.lang-dropdown {
  position: absolute;
  top: calc(100% + 4px);
  right: 0;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  overflow: hidden;
  min-width: 140px;
}

.lang-option {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 10px 16px;
  border: none;
  background: none;
  cursor: pointer;
  font-size: 14px;
  color: #333;
  text-align: left;
  transition: background 0.15s;
}

.lang-option:hover {
  background: #f0f0f0;
}

.lang-option.active {
  background: #e8f0fe;
  font-weight: 600;
}

.flag-icon {
  width: 24px;
  height: 18px;
  border-radius: 2px;
  object-fit: cover;
  flex-shrink: 0;
}
</style>