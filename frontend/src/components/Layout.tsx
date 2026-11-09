import { Package } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link, Outlet } from 'react-router'
import { LanguageSwitcher } from './LanguageSwitcher'
import { ThemeToggle } from './ThemeToggle'

export function Layout() {
  const { t } = useTranslation()
  return (
    <div className="flex min-h-full flex-col bg-base-200">
      <header className="navbar min-h-14 gap-2 border-b border-base-300 bg-base-100 px-4">
        <Link to="/" className="flex flex-1 items-center gap-2 text-lg font-semibold">
          <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-primary text-primary-content">
            <Package aria-hidden className="size-4" />
          </span>
          {t('app.name')}
        </Link>
        <LanguageSwitcher />
        <ThemeToggle />
      </header>
      <main className="flex flex-1 flex-col">
        <Outlet />
      </main>
      <footer className="px-4 py-3 text-center text-sm text-base-content/80">
        {t('app.demoNotice')}
      </footer>
    </div>
  )
}
