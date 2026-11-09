import { Bike, LayoutDashboard, Package, type LucideIcon } from 'lucide-react'
import { useId, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { errorMessage } from '../../api/errors'
import { useDemoAccounts, useDemoLogin } from '../../api/generated/api'
import type { CountryCode, Role } from '../../api/generated/model'
import { countryName } from '../../i18n/countries'
import { useOnLoggedIn } from './session'

const ROLE_ICONS: Record<Role, LucideIcon> = {
  customer: Package,
  courier: Bike,
  admin: LayoutDashboard,
}

/** One-click login as a demo account. Shown only when the API runs in demo mode. */
export function DemoLogin({ next }: { next: string | null }) {
  const { t, i18n } = useTranslation()
  const countryId = useId()
  const { data: accounts = [] } = useDemoAccounts()
  const onLoggedIn = useOnLoggedIn()
  const demoLogin = useDemoLogin({
    mutation: {
      onSuccess: (user) => {
        onLoggedIn(user, next)
      },
    },
  })
  const countries = [...new Set(accounts.map((account) => account.country_code))]
  const [chosen, setChosen] = useState<CountryCode | null>(null)
  const country = chosen ?? countries[0]

  if (!country) return null
  const roles = accounts.filter((account) => account.country_code === country)

  return (
    <section
      aria-labelledby={`${countryId}-title`}
      className="card border border-base-300 bg-base-100"
    >
      <div className="card-body gap-4">
        <div>
          <h2 id={`${countryId}-title`} className="card-title">
            {t('auth.demo.title')}
          </h2>
          <p className="text-base-content/80">{t('auth.demo.description')}</p>
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor={countryId} className="text-sm font-medium">
            {t('auth.demo.country')}
          </label>
          <select
            id={countryId}
            className="select w-full"
            value={country}
            onChange={(event) => {
              setChosen(event.target.value as CountryCode)
            }}
          >
            {countries.map((code) => (
              <option key={code} value={code}>
                {countryName(code, i18n.language)}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-2">
          {roles.map(({ role }) => {
            const Icon = ROLE_ICONS[role]
            return (
              <button
                key={role}
                type="button"
                className="btn btn-outline justify-start"
                disabled={demoLogin.isPending}
                onClick={() => {
                  demoLogin.mutate({ data: { role, country_code: country } })
                }}
              >
                <Icon aria-hidden className="size-4" />
                {t('auth.demo.logInAs', { role: t(`roles.${role}`) })}
              </button>
            )
          })}
        </div>
        {demoLogin.isError && (
          <p role="alert" className="text-sm text-error-readable">
            {errorMessage(demoLogin.error)}
          </p>
        )}
      </div>
    </section>
  )
}
