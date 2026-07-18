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