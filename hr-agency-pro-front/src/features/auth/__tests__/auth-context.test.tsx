import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, waitFor, act } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import MockAdapter from 'axios-mock-adapter'
import { api } from '../../../lib/api'
import { AuthProvider, useAuthContext } from '../auth-context'
import { tokenStorage } from '../../../lib/token-storage'

const mockNavigate = vi.fn()
vi.mock('@tanstack/react-router', () => ({
  useNavigate: () => mockNavigate,
}))

function createWrapper() {
  const qc = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  })
  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <QueryClientProvider client={qc}>
        <AuthProvider>{children}</AuthProvider>
      </QueryClientProvider>
    )
  }
  return Wrapper
}

function TestAuthConsumer() {
  const { user, isAuthenticated, login, logout } = useAuthContext()
  return (
    <div>
      <span data-testid="authenticated">{String(isAuthenticated)}</span>
      <span data-testid="email">{user?.email ?? 'none'}</span>
      <button onClick={() => login({ email: 'a@b.com', password: 'pass' })}>login</button>
      <button onClick={() => logout()}>logout</button>
    </div>
  )
}

describe('AuthContext', () => {
  let mock: MockAdapter

  beforeEach(() => {
    mock = new MockAdapter(api)
    localStorage.clear()
  })

  it('shows unauthenticated initially when no user', async () => {
    mock.onGet('/auth/me').reply(401)
    const Wrapper = createWrapper()
    render(
      <Wrapper>
        <TestAuthConsumer />
      </Wrapper>,
    )
    await waitFor(() => {
      expect(screen.getByTestId('authenticated')).toHaveTextContent('false')
    })
  })

  it('login makes isAuthenticated true', async () => {
    mock.onGet('/auth/me').reply(401)
    mock.onPost('/auth/login').reply(200, {
      access_token: 'acc',
      refresh_token: 'ref',
    })

    const Wrapper = createWrapper()
    render(
      <Wrapper>
        <TestAuthConsumer />
      </Wrapper>,
    )

    // After login, me query will be re-fetched
    mock.onGet('/auth/me').reply(200, {
      id: '1',
      email: 'a@b.com',
      permissions: ['dashboard'],
    })

    await act(async () => {
      screen.getByRole('button', { name: 'login' }).click()
    })

    await waitFor(() => {
      expect(screen.getByTestId('authenticated')).toHaveTextContent('true')
      expect(screen.getByTestId('email')).toHaveTextContent('a@b.com')
    })
  })

  it('logout makes user null and navigates to /login', async () => {
    mockNavigate.mockClear()
    tokenStorage.set('acc', 'ref')
    mock.onGet('/auth/me').reply(200, {
      id: '1',
      email: 'a@b.com',
      permissions: ['*'],
    })
    mock.onPost('/auth/logout').reply(204)

    const Wrapper = createWrapper()
    render(
      <Wrapper>
        <TestAuthConsumer />
      </Wrapper>,
    )

    await waitFor(() => {
      expect(screen.getByTestId('authenticated')).toHaveTextContent('true')
    })

    await act(async () => {
      screen.getByRole('button', { name: 'logout' }).click()
    })

    await waitFor(() => {
      expect(screen.getByTestId('authenticated')).toHaveTextContent('false')
    })
    expect(mockNavigate).toHaveBeenCalledWith({ to: '/login' })
  })

  it('can() checks permission via usePermissions', async () => {
    tokenStorage.set('acc', 'ref')
    mock.onGet('/auth/me').reply(200, {
      id: '1',
      email: 'x@y.com',
      permissions: ['dashboard'],
    })

    function PermConsumer() {
      const { user } = useAuthContext()
      const perms = user?.permissions ?? []
      return <span data-testid="has-dashboard">{String(perms.includes('dashboard'))}</span>
    }

    const Wrapper = createWrapper()
    render(
      <Wrapper>
        <PermConsumer />
      </Wrapper>,
    )

    await waitFor(() => {
      expect(screen.getByTestId('has-dashboard')).toHaveTextContent('true')
    })
  })
})
