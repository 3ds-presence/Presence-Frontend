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
  <div class="terms-text">
    <section v-for="(section, idx) in sections" :key="idx">
      <h3 v-if="section.title">{{ section.title }}</h3>
      <p v-for="(line, i) in section.lines" :key="i">{{ line }}</p>
      <ul v-if="section.list">
        <li v-for="(item, i) in section.list" :key="i">{{ item }}</li>
      </ul>
      <blockquote v-if="section.warning" class="terms-warning">{{ section.warning }}</blockquote>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

interface TermsSection {
  title?: string
  lines?: string[]
  list?: string[]
  warning?: string
}

const { tm } = useI18n()

const sections = computed<TermsSection[]>(() => {
  return (tm('terms.sections') as unknown as TermsSection[]) ?? []
})
</script>

<style scoped>
.terms-text {
  text-align: left;
  line-height: 1.6;
  color: #333;
}

.terms-text h3 {
  margin-top: 20px;
  margin-bottom: 8px;
  font-size: 15px;
  color: #222;
}

.terms-text p {
  margin-bottom: 8px;
}

.terms-text ul {
  margin-bottom: 8px;
  padding-left: 20px;
}

.terms-text li {
  margin-bottom: 4px;
}

.terms-warning {
  margin: 12px 0;
  padding: 12px 16px;
  background: #fff8e6;
  border-left: 4px solid #f0a500;
  border-radius: 4px;
  font-size: 14px;
  color: #5c4a00;
}
</style>