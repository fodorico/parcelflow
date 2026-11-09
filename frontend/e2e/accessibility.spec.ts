import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'
import { mockApi } from './mock-api'

async function expectNoViolations(page: import('@playwright/test').Page) {
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
    .analyze()
  expect(results.violations).toEqual([])
}

for (const theme of ['light', 'dark'] as const) {
  test.describe(`${theme} theme`, () => {
    test.use({ colorScheme: theme })

    test('home has no accessibility violations', async ({ page }) => {
      await mockApi(page)
      await page.goto('/')
      await expect(page.getByText('Service online')).toBeVisible()
      await expectNoViolations(page)
    })

    test('not found page has no accessibility violations', async ({ page }) => {
      await mockApi(page)
      await page.goto('/nowhere')
      await expect(page.getByRole('heading', { name: 'Page not found' })).toBeVisible()
      await expectNoViolations(page)
    })
  })
}
