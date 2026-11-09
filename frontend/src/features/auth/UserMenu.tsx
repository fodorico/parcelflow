import { LogOut } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'
import { homePathFor, useCurrentUser, useLogOut } from './session'

export function UserMenu() {
  const { t } = useTranslation()
  const user = useCurrentUser()
  const { logOut, isPending } = useLogOut()

  if (user === undefined) return null
  if (user === null) {
    return (
      <div className="flex gap-1">
        <Link to="/login" className="btn btn-ghost btn-sm">
          {t('nav.logIn')}
        </Link>
        <Link to="/signup" className="btn btn-primary btn-sm hidden sm:inline-flex">
          {t('nav.signUp')}
        </Link>
      </div>
    )
  }
  return (
    <div className="flex items-center gap-1">
      <Link to={homePathFor(user.role)} className="btn btn-ghost btn-sm">
        <span className="max-w-32 truncate">{user.full_name}</span>
        <span className="badge badge-sm hidden sm:inline-flex">{t(`roles.${user.role}`)}</span>
      </Link>
      <button
        type="button"
        className="btn btn-ghost btn-circle btn-sm"
        aria-label={t('nav.logOut')}
        disabled={isPending}
        onClick={logOut}
      >
        <LogOut aria-hidden className="size-5" />
      </button>
    </div>
  )
}
