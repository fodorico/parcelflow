import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render } from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router'
import { vi } from 'vitest'
import type { UserRead } from '../api/generated/model'
import { routes } from '../routes'

type Handler = (init: RequestInit | undefined) => Response
/** Answers keyed by "METHOD /path" (the query string is ignored). */
export type Routes = Record<string, Handler | Response>

export const notAuthenticated = () =>
  Response.json({ detail: 'not_authenticated' }, { status: 401 })

/** Replaces fetch with fixed answers; unknown requests fail the test with a clear message. */
export function mockFetch(routes: Routes) {
  const fetchMock = vi.fn((input: RequestInfo | URL, init?: RequestInit) => {
    const url = new URL(input instanceof Request ? input.url : String(input), 'http://localhost')
    const key = `${init?.method ?? 'GET'} ${url.pathname}`
    const answer = routes[key]
    if (!answer) throw new Error(`Unexpected request: ${key}`)
    return Promise.resolve(typeof answer === 'function' ? answer(init) : answer.clone())
  })
  vi.stubGlobal('fetch', fetchMock)
  return fetchMock
}

export function renderApp(path = '/') {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  const router = createMemoryRouter(routes, { initialEntries: [path] })
  render(
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>,
  )
  return router
}

export function user(overrides: Partial<UserRead> = {}): UserRead {
  return {
    id: 1,
    email: 'ana@example.com',
    full_name: 'Ana Ruiz',
    role: 'customer',
    country_code: 'AR',
    language: 'en',
    is_active: true,
    is_demo: false,
    created_at: '2026-11-09T00:00:00Z',
    ...overrides,
  }
}
