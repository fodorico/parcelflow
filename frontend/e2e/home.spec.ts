import { expect, test } from '@playwright/test'
import { mockApi } from './mock-api'

test('the language follows the browser and the choice is remembered', async ({ browser }) => {
  const context = await browser.newContext({ locale: 'es-AR' })
  const page = await context.newPage()
  await mockApi(page)

  await page.goto('/')
  await expect(page.getByRole('heading', { name: 'Repartidores' })).toBeVisible()
  await expect(page.locator('html')).toHaveAttribute('lang', 'es-419')

  await page.getByLabel('Idioma').selectOption('en')
  await expect(page.getByRole('heading', { name: 'Couriers' })).toBeVisible()

  await page.reload()
  await expect(page.getByRole('heading', { name: 'Couriers' })).toBeVisible()
  await context.close()
})

test('shows when the service is unavailable', async ({ page }) => {
  await mockApi(page, { healthy: false })
  await page.goto('/')
  await expect(page.getByText('Service unavailable')).toBeVisible()
})
