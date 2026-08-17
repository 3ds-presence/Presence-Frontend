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
  <main class="privacy-page">
    <LanguageSwitcher />

    <a href="/" class="privacy-back">{{ $t('common.backToHome') }}</a>

    <article class="privacy-article">
      <h1 class="privacy-title">{{ $t('privacy.title') }}</h1>
      <p class="privacy-updated">{{ $t('privacy.lastUpdated') }}</p>
      <PrivacyPolicyContent />
    </article>
  </main>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import LanguageSwitcher from './LanguageSwitcher.vue'
import PrivacyPolicyContent from './PrivacyPolicyContent.vue'
import { updateSeo } from '../utils/seo'

const { t, locale } = useI18n()

function updateTitle() {
  updateSeo(
    `${t('privacy.title')} — 3DS Presence`,
    '3DS Presence Privacy Policy: what data is collected, how it is used and your GDPR rights.'
  )
}

onMounted(() => {
  updateTitle()

  // The global #app container constrains the layout to max-width: 700px.
  // Lift that constraint so this standalone page can use its own width.
  const app = document.getElementById('app')
  if (app) {
    app.style.maxWidth = 'none'
    app.style.margin = '0'
    app.style.padding = '0'
  }
})

onUnmounted(() => {
  const app = document.getElementById('app')
  if (app) {
    app.style.maxWidth = ''
    app.style.margin = ''
    app.style.padding = ''
  }
})

watch(locale, () => {
  updateTitle()
})
</script>

<style scoped>
.privacy-page {
  max-width: 1200px;
  margin: 40px auto;
  padding: 0 20px;
}

.privacy-back {
  display: inline-block;
  margin-bottom: 20px;
  color: #5865f2;
  text-decoration: none;
  font-size: 14px;
}

.privacy-back:hover {
  color: #4752c4;
  text-decoration: underline;
}

.privacy-article {
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 12px;
  padding: 32px;
}

.privacy-title {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 4px;
  padding-bottom: 16px;
  border-bottom: 1px solid #eee;
}

.privacy-updated {
  font-size: 13px;
  color: #888;
  margin-bottom: 16px;
  margin-top: -8px;
}
</style>