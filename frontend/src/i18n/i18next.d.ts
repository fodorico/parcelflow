import 'i18next'
import type { Translation } from './locales/en'

// Typed translation keys: `t('home.titel')` fails the type check.
declare module 'i18next' {
  interface CustomTypeOptions {
    resources: { translation: Translation }
  }
}
