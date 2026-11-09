import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createMemoryRouter, RouterProvider } from 'react-router'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { routes } from '../routes'

function renderHome() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  render(
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={createMemoryRouter(routes)} />
    </QueryClientProvider>,
  )
}

function mockHealth(response: Response) {
  vi.stubGlobal(
    'fetch',
    vi.fn(() => Promise.resolve(response)),
  )
}

describe('HomePage', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('shows the three roles and that the service is online', async () => {
    mockHealth(Response.json({ status: 'ok' }))
    renderHome()

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Local deliveries')
    for (const role of ['Customers', 'Couriers', 'Administrators']) {
      expect(screen.getByRole('heading', { name: role })).toBeInTheDocument()
    }
    expect(await screen.findByText('Service online')).toBeInTheDocument()
  })

  it('says when the service is unavailable', async () => {
    mockHealth(new Response(null, { status: 503 }))
    renderHome()

    expect(await screen.findByText('Service unavailable')).toBeInTheDocument()
  })

  it('switches to Latin American Spanish', async () => {
    mockHealth(Response.json({ status: 'ok' }))
    renderHome()

    await userEvent.selectOptions(screen.getByLabelText('Language'), 'es-419')

    expect(screen.getByRole('heading', { name: 'Repartidores' })).toBeInTheDocument()
    expect(screen.getByLabelText('Idioma')).toHaveValue('es-419')
    expect(document.documentElement.lang).toBe('es-419')
  })
})
