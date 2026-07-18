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