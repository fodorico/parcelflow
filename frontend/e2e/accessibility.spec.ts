import AxeBuilder from '@axe-core/playwright'
import { expect, test, type Page } from '@playwright/test'
import { mockApi, user } from './mock-api'

async function expectNoViolations(page: Page) {
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

    test('login with errors has no accessibility violations', async ({ page }) => {
      await mockApi(page)
      await page.goto('/login')
      await page.getByLabel('Email').fill('ana@example.com')
      await page.getByLabel('Password').fill('wrong password')
      await page.getByRole('button', { name: 'Log in', exact: true }).click()
      await expect(page.getByRole('alert')).toBeVisible()
      await expect(page.getByRole('heading', { name: 'Try the demo' })).toBeVisible()
      await expectNoViolations(page)
    })

    test('sign-up with errors has no accessibility violations', async ({ page }) => {
      await mockApi(page)
      await page.goto('/signup')
      await page.getByRole('button', { name: 'Create account' }).click()
      await expect(page.getByText('Use at least 10 characters.')).toBeVisible()
      await expectNoViolations(page)
    })

    test('a panel has no accessibility violations', async ({ page }) => {
      await mockApi(page, { loggedInAs: user({ role: 'admin' }) })
      await page.goto('/admin')
      await expect(page.getByRole('heading', { name: 'Hi, Ana Ruiz!' })).toBeVisible()
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
