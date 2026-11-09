import { useTranslation } from 'react-i18next'
import { useCurrentUser } from '../features/auth/session'
import { countryName } from '../i18n/countries'

/** Placeholder panel for every role until each gets its own workspace. */
export function DashboardPage() {
  const { t, i18n } = useTranslation()
  const user = useCurrentUser()
  if (!user) return null
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-3 px-4 py-12">
      <h1 className="text-3xl font-bold">{t('dashboard.welcome', { name: user.full_name })}</h1>
      <p className="text-lg">
        {t('dashboard.signedInAs', {
          role: t(`roles.${user.role}`),
          country: countryName(user.country_code, i18n.language),
        })}
      </p>
      <p className="text-base-content/80">{t('dashboard.comingSoon')}</p>
    </div>
  )
}
