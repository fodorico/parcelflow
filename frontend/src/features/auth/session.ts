import { useQueryClient } from '@tanstack/react-query'
import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router'
import { getMeQueryKey, useLogout, useMe } from '../../api/generated/api'
import type { Role, UserRead } from '../../api/generated/model'

const HOME_BY_ROLE: Record<Role, string> = {
  customer: '/app',
  courier: '/courier',
  admin: '/admin',
}

/** Only same-site paths, so a crafted link can't send the user to another site after login.
 * Browsers read a backslash as a slash, so a path starting with "/\" also leaves the site. */
export function safeNext(next: string | null): string | null {
  if (!next?.startsWith('/') || next.startsWith('//') || next.includes('\\')) return null
  return next
}

export function homePathFor(role: Role): string {
  return HOME_BY_ROLE[role]
}

/** The logged-in user, `null` when logged out, `undefined` while it's being checked. */
export function useCurrentUser(): UserRead | null | undefined {
  const { data, isPending, isError } = useMe({
    // A 401 just means "logged out": don't retry it.
    query: { retry: false, staleTime: 5 * 60_000 },
  })
  if (isPending) return undefined
  if (isError) return null
  return data
}

/** What to do once the API has started a session: remember the user, use their language and
 * open their panel (or the page they were trying to reach). */
export function useOnLoggedIn() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const { i18n } = useTranslation()

  return useCallback(
    (user: UserRead, next?: string | null) => {
      queryClient.setQueryData(getMeQueryKey(), user)
      void i18n.changeLanguage(user.language)
      void navigate(next ?? homePathFor(user.role), { replace: true })
    },
    [queryClient, navigate, i18n],
  )
}

export function useLogOut() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const { mutate, isPending } = useLogout({
    mutation: {
      onSettled: () => {
        // Drop every cached answer: they belonged to the previous user.
        queryClient.clear()
        void navigate('/', { replace: true })
      },
    },
  })
  return {
    logOut: () => {
      mutate()
    },
    isPending,
  }
}
