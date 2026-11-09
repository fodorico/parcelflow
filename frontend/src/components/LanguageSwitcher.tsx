import { Languages } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { LANGUAGES, toSupportedLanguage } from '../i18n'

export function LanguageSwitcher() {
  const { t, i18n } = useTranslation()
  const current = toSupportedLanguage(i18n.resolvedLanguage ?? 'en')

  return (
    <label className="select select-sm select-ghost w-auto">
      <Languages aria-hidden className="size-4 opacity-70" />
      <span className="sr-only">{t('language.label')}</span>
      <select
        value={current}
        onChange={(event) => {
          void i18n.changeLanguage(event.target.value)
        }}
      >
        {LANGUAGES.map((language) => (
          <option key={language} value={language}>
            {t(`language.${language}`)}
          </option>
        ))}
      </select>
    </label>
  )
}
