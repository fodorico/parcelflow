import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { mockFetch, notAuthenticated, renderApp, user } from '../test/api'

const healthy = { 'GET /api/health': Response.json({ status: 'ok' }) }

describe('HomePage', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('shows the three roles and that the service is online', async () => {
    mockFetch({ ...healthy, 'GET /api/auth/me': notAuthenticated() })
    renderApp()

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Local deliveries')
    for (const role of ['Customers', 'Couriers', 'Administrators']) {
      expect(screen.getByRole('heading', { name: role })).toBeInTheDocument()
    }
    expect(await screen.findByText('Service online')).toBeInTheDocument()
  })

  it('says when the service is unavailable', async () => {
    mockFetch({
      'GET /api/health': new Response(null, { status: 503 }),
      'GET /api/auth/me': notAuthenticated(),
    })
    renderApp()

    expect(await screen.findByText('Service unavailable')).toBeInTheDocument()
  })

  it('invites a visitor to sign up or log in', async () => {
    mockFetch({ ...healthy, 'GET /api/auth/me': notAuthenticated() })
    renderApp()

    expect(await screen.findAllByRole('link', { name: 'Sign up' })).not.toHaveLength(0)
    expect(screen.getAllByRole('link', { name: 'Log in' })).not.toHaveLength(0)
  })

  it('sends a logged-in user to their panel', async () => {
    mockFetch({ ...healthy, 'GET /api/auth/me': Response.json(user({ role: 'courier' })) })
    renderApp()

    expect(await screen.findByRole('link', { name: 'My panel' })).toHaveAttribute(
      'href',
      '/courier',
    )
  })

  it('switches to Latin American Spanish', async () => {
    mockFetch({ ...healthy, 'GET /api/auth/me': notAuthenticated() })
    renderApp()

    await userEvent.selectOptions(screen.getByLabelText('Language'), 'es-419')

    expect(screen.getByRole('heading', { name: 'Repartidores' })).toBeInTheDocument()
    expect(screen.getByLabelText('Idioma')).toHaveValue('es-419')
    expect(document.documentElement.lang).toBe('es-419')
  })
})
