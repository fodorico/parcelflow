import { Bike, LayoutDashboard, Package, type LucideIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { ApiStatus } from '../components/ApiStatus'

const ROLES: { key: 'customer' | 'courier' | 'admin'; icon: LucideIcon }[] = [
  { key: 'customer', icon: Package },
  { key: 'courier', icon: Bike },
  { key: 'admin', icon: LayoutDashboard },
]

export function HomePage() {
  const { t } = useTranslation()
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-4 py-12">
      <section className="flex flex-col items-start gap-4">
        <h1 className="text-3xl font-bold text-balance sm:text-4xl">{t('home.title')}</h1>
        <p className="max-w-2xl text-lg text-base-content/80">{t('home.subtitle')}</p>
        <ApiStatus />
      </section>
      <ul className="grid gap-4 sm:grid-cols-3">
        {ROLES.map(({ key, icon: Icon }) => (
          <li key={key} className="card border border-base-300 bg-base-100">
            <div className="card-body">
              <Icon aria-hidden className="size-6 text-primary" />
              <h2 className="card-title">{t(`home.roles.${key}.title`)}</h2>
              <p>{t(`home.roles.${key}.description`)}</p>
              <span className="badge badge-outline">{t('home.comingSoon')}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
