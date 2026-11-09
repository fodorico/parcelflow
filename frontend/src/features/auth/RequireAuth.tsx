import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, Navigate, useLocation } from 'react-router'
import type { Role } from '../../api/generated/model'
import { homePathFor, useCurrentUser } from './session'

/** Renders `children` only for a logged-in user with one of `roles`; sends anyone else to the
 * login page (and back here afterwards). */
export function RequireAuth({ roles, children }: { roles: Role[]; children: ReactNode }) {
  const { t } = useTranslation()
  const user = useCurrentUser()
  const location = useLocation()

  if (user === undefined) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <span className="loading loading-spinner" aria-hidden />
      </div>
    )
  }
  if (user === null) {
    const next = location.pathname + location.search
    return <Navigate to={`/login?next=${encodeURIComponent(next)}`} replace />
  }
  if (!roles.includes(user.role)) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 px-4 py-12">
        <h1 className="text-2xl font-semibold">{t('forbidden.title')}</h1>
        <Link to={homePathFor(user.role)} className="btn btn-primary">
          {t('forbidden.back')}
        </Link>
      </div>
    )
  }
  return children
}
