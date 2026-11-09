import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { initReactI18next } from 'react-i18next'
import { en } from './locales/en'
import { es419 } from './locales/es-419'

export const LANGUAGES = ['en', 'es-419'] as const
export type Language = (typeof LANGUAGES)[number]

export const resources = {
  en: { translation: en },
  'es-419': { translation: es419 },
} as const

/** Any Spanish variant (es, es-AR, es-MX…) uses Latin American Spanish; anything else, English. */
export function toSupportedLanguage(language: string): Language {
  return language.toLowerCase().startsWith('es') ? 'es-419' : 'en'
}

void i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    supportedLngs: LANGUAGES,
    fallbackLng: 'en',
    interpolation: { escapeValue: false }, // React already escapes.
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'language',
      convertDetectedLanguage: toSupportedLanguage,
    },
  })

// Screen readers and the browser's own formatting follow the page language.
function syncDocumentLanguage(language: string) {
  document.documentElement.lang = language
}
syncDocumentLanguage(i18n.resolvedLanguage ?? 'en')
i18n.on('languageChanged', syncDocumentLanguage)

export default i18n
