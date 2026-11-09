import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { mockFetch, notAuthenticated, renderApp, user } from '../../test/api'
import { safeNext } from './session'

const loggedOut = {
  'GET /api/auth/me': notAuthenticated(),
  'GET /api/auth/demo-accounts': Response.json([]),
}

function body(init: RequestInit | undefined): unknown {
  return JSON.parse(init?.body as string)
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('safeNext', () => {
  it.each(['/admin', '/app?tab=1'])('keeps the same-site path %s', (path) => {
    expect(safeNext(path)).toBe(path)
  })

  it.each([null, 'https://evil.com', '//evil.com', '/\\evil.com', 'admin'])('drops %s', (path) => {
    expect(safeNext(path)).toBeNull()
  })
})

describe('login', () => {
  it('validates the form before calling the API', async () => {
    const fetchMock = mockFetch(loggedOut)
    renderApp('/login')

    await userEvent.type(await screen.findByLabelText('Email'), 'not-an-email')
    await userEvent.click(screen.getByRole('button', { name: 'Log in' }))

    expect(await screen.findByText('Enter a valid email address.')).toBeInTheDocument()
    expect(screen.getByText('Required.')).toBeInTheDocument()
    expect(fetchMock).not.toHaveBeenCalledWith('/api/auth/login', expect.anything())
  })

  it('shows a translated message for wrong credentials', async () => {
    mockFetch({
      ...loggedOut,
      'POST /api/auth/login': Response.json({ detail: 'invalid_credentials' }, { status: 401 }),
    })
    renderApp('/login')

    await userEvent.type(await screen.findByLabelText('Email'), 'ana@example.com')
    await userEvent.type(screen.getByLabelText('Password'), 'wrong password')
    await userEvent.click(screen.getByRole('button', { name: 'Log in' }))

    expect(await screen.findByRole('alert')).toHaveTextContent('Incorrect email or password.')
  })

  it('opens the panel of the role and switches to the user language', async () => {
    let sent: unknown
    mockFetch({
      ...loggedOut,
      'POST /api/auth/login': (init) => {
        sent = body(init)
        return Response.json(user({ role: 'admin', language: 'es-419' }))
      },
    })
    const router = renderApp('/login')

    await userEvent.type(await screen.findByLabelText('Email'), ' Ana@Example.com ')
    await userEvent.type(screen.getByLabelText('Password'), 'correct horse battery')
    await userEvent.click(screen.getByRole('button', { name: 'Log in' }))

    await waitFor(() => {
      expect(router.state.location.pathname).toBe('/admin')
    })
    expect(sent).toEqual({ email: 'Ana@Example.com', password: 'correct horse battery' })
    expect(await screen.findByRole('heading', { name: '¡Hola, Ana Ruiz!' })).toBeInTheDocument()
  })

  it('goes back to the page that asked for the login', async () => {
    mockFetch({ ...loggedOut, 'POST /api/auth/login': Response.json(user()) })
    const router = renderApp('/app')

    await waitFor(() => {
      expect(router.state.location.pathname).toBe('/login')
    })
    expect(router.state.location.search).toBe('?next=%2Fapp')
    await userEvent.type(await screen.findByLabelText('Email'), 'ana@example.com')
    await userEvent.type(screen.getByLabelText('Password'), 'correct horse battery')
    await userEvent.click(screen.getByRole('button', { name: 'Log in' }))

    await waitFor(() => {
      expect(router.state.location.pathname).toBe('/app')
    })
  })
})

describe('demo login', () => {
  const accounts = ['AR', 'ES'].flatMap((country_code) =>
    (['customer', 'courier', 'admin'] as const).map((role) => ({
      role,
      country_code,
      full_name: `${role} ${country_code}`,
    })),
  )

  it('is hidden when the API has no demo accounts', async () => {
    mockFetch(loggedOut)
    renderApp('/login')

    await screen.findByRole('heading', { name: 'Log in' })
    expect(screen.queryByRole('heading', { name: 'Try the demo' })).not.toBeInTheDocument()
  })

  it('logs in as the chosen role and country', async () => {
    let sent: unknown
    mockFetch({
      ...loggedOut,
      'GET /api/auth/demo-accounts': Response.json(accounts),
      'POST /api/auth/demo-login': (init) => {
        sent = body(init)
        return Response.json(user({ role: 'courier', country_code: 'ES', is_demo: true }))
      },
    })
    const router = renderApp('/login')

    await userEvent.selectOptions(await screen.findByLabelText('Demo country'), 'ES')
    await userEvent.click(screen.getByRole('button', { name: 'Log in as Courier' }))

    await waitFor(() => {
      expect(router.state.location.pathname).toBe('/courier')
    })
    expect(sent).toEqual({ role: 'courier', country_code: 'ES' })
  })
})

describe('signup', () => {
  it('creates a customer in the current language', async () => {
    let sent: unknown
    mockFetch({
      ...loggedOut,
      'POST /api/auth/signup': (init) => {
        sent = body(init)
        return Response.json(user(), { status: 201 })
      },
    })
    const router = renderApp('/signup')

    await userEvent.type(await screen.findByLabelText('Full name'), 'Ana Ruiz')
    await userEvent.type(screen.getByLabelText('Email'), 'ana@example.com')
    await userEvent.type(screen.getByLabelText('Password'), 'long enough password')
    await userEvent.selectOptions(screen.getByLabelText('Country'), 'US')
    await userEvent.click(screen.getByRole('button', { name: 'Create account' }))

    await waitFor(() => {
      expect(router.state.location.pathname).toBe('/app')
    })
    expect(sent).toEqual({
      full_name: 'Ana Ruiz',
      email: 'ana@example.com',
      password: 'long enough password',
      country_code: 'US',
      language: 'en',
    })
  })

  it('asks for a longer password', async () => {
    mockFetch(loggedOut)
    renderApp('/signup')

    await userEvent.type(await screen.findByLabelText('Password'), 'short')
    await userEvent.click(screen.getByRole('button', { name: 'Create account' }))

    expect(await screen.findByText('Use at least 10 characters.')).toBeInTheDocument()
  })

  it('says when the email is taken', async () => {
    mockFetch({
      ...loggedOut,
      'POST /api/auth/signup': Response.json({ detail: 'email_taken' }, { status: 409 }),
    })
    renderApp('/signup')

    await userEvent.type(await screen.findByLabelText('Full name'), 'Ana Ruiz')
    await userEvent.type(screen.getByLabelText('Email'), 'ana@example.com')
    await userEvent.type(screen.getByLabelText('Password'), 'long enough password')
    await userEvent.click(screen.getByRole('button', { name: 'Create account' }))

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'There is already an account with this email.',
    )
  })
})

describe('protected panels', () => {
  it('tells a user without the role they have no access', async () => {
    mockFetch({ 'GET /api/auth/me': Response.json(user({ role: 'customer' })) })
    renderApp('/admin')

    expect(
      await screen.findByRole('heading', { name: "You don't have access to this page" }),
    ).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Go to my panel' })).toHaveAttribute('href', '/app')
  })

  it('logs out and goes home', async () => {
    mockFetch({
      'GET /api/auth/me': Response.json(user()),
      'POST /api/auth/logout': new Response(null, { status: 204 }),
      'GET /api/health': Response.json({ status: 'ok' }),
    })
    const router = renderApp('/app')

    await userEvent.click(await screen.findByRole('button', { name: 'Log out' }))

    await waitFor(() => {
      expect(router.state.location.pathname).toBe('/')
    })
  })
})
