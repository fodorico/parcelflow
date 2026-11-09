import type { Page } from '@playwright/test'
import type {
  DemoAccountRead,
  DemoLoginCreate,
  HealthRead,
  LoginCreate,
  SignupCreate,
  UserRead,
} from '../src/api/generated/model'

export const PASSWORD = 'correct horse battery'

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

const DEMO_ACCOUNTS: DemoAccountRead[] = (['AR', 'US', 'ES'] as const).flatMap((country_code) =>
  (['customer', 'courier', 'admin'] as const).map((role) => ({
    role,
    country_code,
    full_name: `Demo ${role} ${country_code}`,
  })),
)

interface Options {
  healthy?: boolean
  /** Accounts that can log in with PASSWORD. */
  users?: UserRead[]
  /** Logged in from the start. */
  loggedInAs?: UserRead
  demo?: boolean
}

/** Fakes the backend for one page, with an in-memory session, so e2e tests need no API or
 * database. */
export async function mockApi(
  page: Page,
  { healthy = true, users = [], loggedInAs, demo = true }: Options = {},
) {
  let current: UserRead | null = loggedInAs ?? null
  const accounts = [...users]

  await page.route('**/api/health', (route) =>
    healthy
      ? route.fulfill({ json: { status: 'ok' } satisfies HealthRead })
      : route.fulfill({ status: 503, json: { detail: 'Database unavailable' } }),
  )
  await page.route('**/api/auth/me', (route) =>
    current
      ? route.fulfill({ json: current })
      : route.fulfill({ status: 401, json: { detail: 'not_authenticated' } }),
  )
  await page.route('**/api/auth/login', (route) => {
    const body = route.request().postDataJSON() as LoginCreate
    const found = accounts.find((account) => account.email === body.email.toLowerCase())
    if (!found || body.password !== PASSWORD) {
      return route.fulfill({ status: 401, json: { detail: 'invalid_credentials' } })
    }
    current = found
    return route.fulfill({ json: found })
  })
  await page.route('**/api/auth/signup', (route) => {
    const body = route.request().postDataJSON() as SignupCreate
    const email = body.email.toLowerCase()
    if (accounts.some((account) => account.email === email)) {
      return route.fulfill({ status: 409, json: { detail: 'email_taken' } })
    }
    current = user({
      id: accounts.length + 100,
      email,
      full_name: body.full_name,
      country_code: body.country_code,
      language: body.language,
    })
    accounts.push(current)
    return route.fulfill({ status: 201, json: current })
  })
  await page.route('**/api/auth/logout', (route) => {
    current = null
    return route.fulfill({ status: 204 })
  })
  await page.route('**/api/auth/demo-accounts', (route) =>
    route.fulfill({ json: demo ? DEMO_ACCOUNTS : [] }),
  )
  await page.route('**/api/auth/demo-login', (route) => {
    const body = route.request().postDataJSON() as DemoLoginCreate
    current = user({
      id: 900,
      email: `${body.role}.${body.country_code.toLowerCase()}@demo.parcelflow.test`,
      full_name: `Demo ${body.role} ${body.country_code}`,
      role: body.role,
      country_code: body.country_code,
      language: body.country_code === 'US' ? 'en' : 'es-419',
      is_demo: true,
    })
    return route.fulfill({ json: current })
  })
}
