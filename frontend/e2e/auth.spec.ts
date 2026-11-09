import { expect, test } from '@playwright/test'
import { mockApi, PASSWORD, user } from './mock-api'

test('a visitor signs up and lands on the customer panel', async ({ page }) => {
  await mockApi(page)
  await page.goto('/')

  await page.getByRole('main').getByRole('link', { name: 'Sign up' }).click()
  await page.getByLabel('Full name').fill('Ana Ruiz')
  await page.getByLabel('Email').fill('ana@example.com')
  await page.getByLabel('Password').fill('long enough password')
  await page.getByLabel('Country').selectOption('ES')
  await page.getByRole('button', { name: 'Create account' }).click()

  await expect(page).toHaveURL('/app')
  await expect(page.getByRole('heading', { name: 'Hi, Ana Ruiz!' })).toBeVisible()
  await expect(page.getByText('You are signed in as Customer in Spain.')).toBeVisible()
})

test('a courier logs in, and logs out', async ({ page }) => {
  await mockApi(page, { users: [user({ email: 'leo@example.com', role: 'courier' })] })
  await page.goto('/login')

  await page.getByLabel('Email').fill('leo@example.com')
  await page.getByLabel('Password').fill('wrong password')
  await page.getByRole('button', { name: 'Log in', exact: true }).click()
  await expect(page.getByRole('alert')).toHaveText('Incorrect email or password.')

  await page.getByLabel('Password').fill(PASSWORD)
  await page.getByRole('button', { name: 'Log in', exact: true }).click()
  await expect(page).toHaveURL('/courier')

  await page.getByRole('button', { name: 'Log out' }).click()
  await expect(page).toHaveURL('/')
  await expect(page.getByRole('banner').getByRole('link', { name: 'Log in' })).toBeVisible()
})

test('a protected panel asks for a login and comes back afterwards', async ({ page }) => {
  await mockApi(page, { users: [user({ email: 'admin@example.com', role: 'admin' })] })
  await page.goto('/admin')

  await expect(page).toHaveURL('/login?next=%2Fadmin')
  await page.getByLabel('Email').fill('admin@example.com')
  await page.getByLabel('Password').fill(PASSWORD)
  await page.getByRole('button', { name: 'Log in', exact: true }).click()

  await expect(page).toHaveURL('/admin')
})

test('the demo logs in with one click, in the account language', async ({ page }) => {
  await mockApi(page)
  await page.goto('/login')

  await page.getByLabel('Demo country').selectOption('AR')
  await page.getByRole('button', { name: 'Log in as Administrator' }).click()

  await expect(page).toHaveURL('/admin')
  await expect(page.getByText('Ingresaste como Administrador en Argentina.')).toBeVisible()
})

test('a customer cannot open the admin panel', async ({ page }) => {
  await mockApi(page, { loggedInAs: user() })
  await page.goto('/admin')

  await expect(
    page.getByRole('heading', { name: "You don't have access to this page" }),
  ).toBeVisible()
  await page.getByRole('link', { name: 'Go to my panel' }).click()
  await expect(page).toHaveURL('/app')
})
