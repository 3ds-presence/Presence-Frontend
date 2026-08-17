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
  <main class="faq-page">
    <LanguageSwitcher />

    <a href="/" class="faq-back">{{ $t('common.backToHome') }}</a>

    <article class="faq-article">
      <h1 class="faq-title">{{ $t('faq.title') }}</h1>
      <p class="faq-updated">{{ $t('faq.lastUpdated') }}</p>
      <FaqAccordion />
    </article>
  </main>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, watch, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import LanguageSwitcher from './LanguageSwitcher.vue'
import FaqAccordion from './FaqAccordion.vue'
import { updateSeo, injectJsonLd } from '../utils/seo'

const { t, tm, locale } = useI18n()

let cleanupJsonLd: (() => void) | null = null

const faqCategories = computed(() => {
  return (tm('faq.categories') as unknown as Array<{
    category: string
    items: Array<{ question: string; answer: string }>
  }>) ?? []
})

function updateTitleAndMeta() {
  updateSeo(
    `${t('faq.title')} — 3DS Presence`,
    '3DS Presence FAQ: installation, configuration, troubleshooting, account and privacy. Find answers to your questions.'
  )
}

function buildFaqJsonLd() {
  const mainEntity = faqCategories.value.flatMap((cat) =>
    cat.items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    }))
  )

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity,
  }
}

onMounted(() => {
  updateTitleAndMeta()
  cleanupJsonLd = injectJsonLd(buildFaqJsonLd())

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
  if (cleanupJsonLd) {
    cleanupJsonLd()
    cleanupJsonLd = null
  }

  const app = document.getElementById('app')
  if (app) {
    app.style.maxWidth = ''
    app.style.margin = ''
    app.style.padding = ''
  }
})

watch(locale, () => {
  updateTitleAndMeta()
  if (cleanupJsonLd) {
    cleanupJsonLd()
  }
  cleanupJsonLd = injectJsonLd(buildFaqJsonLd())
})
</script>

<style scoped>
.faq-page {
  max-width: 1200px;
  margin: 40px auto;
  padding: 0 20px;
}

.faq-back {
  display: inline-block;
  margin-bottom: 20px;
  color: #5865f2;
  text-decoration: none;
  font-size: 14px;
}

.faq-back:hover {
  color: #4752c4;
  text-decoration: underline;
}

.faq-article {
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 12px;
  padding: 32px;
}

.faq-title {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 4px;
  padding-bottom: 16px;
  border-bottom: 1px solid #eee;
}

.faq-updated {
  font-size: 13px;
  color: #888;
  margin-bottom: 16px;
  margin-top: -8px;
}
</style>