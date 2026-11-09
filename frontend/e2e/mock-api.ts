import type { Page } from '@playwright/test'
import type { HealthRead } from '../src/api/generated/model'

/** Fakes the backend for one page, so e2e tests need no API or database. */
export async function mockApi(page: Page, { healthy = true }: { healthy?: boolean } = {}) {
  await page.route('**/api/health', (route) =>
    healthy
      ? route.fulfill({ json: { status: 'ok' } satisfies HealthRead })
      : route.fulfill({ status: 503, json: { detail: 'Database unavailable' } }),
  )
}
