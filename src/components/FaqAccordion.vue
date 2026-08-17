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
  <div class="faq-accordion">
    <section v-for="(category, catIdx) in categories" :key="catIdx" class="faq-category">
      <h3 class="faq-category-title">{{ category.category }}</h3>

      <div v-for="(item, itemIdx) in category.items" :key="itemIdx" class="faq-item">
        <button
          type="button"
          class="faq-question"
          :aria-expanded="isOpen(catIdx, itemIdx)"
          :aria-controls="`faq-answer-${catIdx}-${itemIdx}`"
          @click="toggle(catIdx, itemIdx)"
        >
          <span class="faq-question-text">{{ item.question }}</span>
          <span class="faq-chevron" :class="{ 'faq-chevron-open': isOpen(catIdx, itemIdx) }" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </span>
        </button>

        <div
          :id="`faq-answer-${catIdx}-${itemIdx}`"
          class="faq-answer"
          :class="{ 'faq-answer-open': isOpen(catIdx, itemIdx) }"
        >
          <p class="faq-answer-text">{{ item.answer }}</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'

interface FaqItem {
  question: string
  answer: string
}

interface FaqCategory {
  category: string
  items: FaqItem[]
}

const { tm } = useI18n()

const categories = computed<FaqCategory[]>(() => {
  return (tm('faq.categories') as unknown as FaqCategory[]) ?? []
})

// Track open items as a set of "catIdx-itemIdx" strings
const openItems = ref<Set<string>>(new Set())

function isOpen(catIdx: number, itemIdx: number): boolean {
  return openItems.value.has(`${catIdx}-${itemIdx}`)
}

function toggle(catIdx: number, itemIdx: number) {
  const key = `${catIdx}-${itemIdx}`
  const next = new Set(openItems.value)
  if (next.has(key)) {
    next.delete(key)
  } else {
    next.add(key)
  }
  openItems.value = next
}
</script>

<style scoped>
.faq-accordion {
  text-align: left;
  line-height: 1.6;
  color: #333;
}

.faq-category {
  margin-bottom: 24px;
}

.faq-category-title {
  font-size: 17px;
  font-weight: 600;
  color: #222;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 2px solid #5865f2;
  display: inline-block;
}

.faq-item {
  margin-bottom: 8px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
  background: #fff;
}

.faq-question {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 14px 16px;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 15px;
  font-weight: 500;
  color: #222;
  text-align: left;
  transition: background 0.2s;
}

.faq-question:hover {
  background: #f5f5f5;
}

.faq-question-text {
  flex: 1;
}

.faq-chevron {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #888;
  transition: transform 0.3s ease;
  flex-shrink: 0;
}

.faq-chevron-open {
  transform: rotate(180deg);
}

.faq-answer {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s ease;
}

.faq-answer-open {
  max-height: 1000px;
}

.faq-answer-text {
  padding: 0 16px 14px 16px;
  font-size: 14px;
  color: #555;
  margin: 0;
}
</style>