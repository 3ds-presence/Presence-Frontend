// 3DS Presence — Discord Rich Presence for Nintendo 3DS
// Copyright (C) 2026 3DS Presence - LeonLeBreton
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published
// by the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.
//
// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.


import { createI18n } from 'vue-i18n'
import en from './en.json'
import fr from './fr.json'

type Locale = 'fr' | 'en'

function getDefaultLocale(): Locale {
  const stored = localStorage.getItem('locale') as Locale | null
  if (stored === 'fr' || stored === 'en') return stored

  const navLang = navigator.language?.split('-')[0]
  if (navLang === 'fr') return 'fr'

  return 'en'
}

const i18n = createI18n({
  legacy: false,
  locale: getDefaultLocale(),
  fallbackLocale: 'en',
  messages: { en, fr },
})

export function setLocale(locale: Locale) {
  i18n.global.locale.value = locale
  localStorage.setItem('locale', locale)
}

export { i18n }