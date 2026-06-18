import { describe, it, expect, beforeEach, vi } from 'vitest'

vi.mock('@tanstack/react-router', () => ({
  useNavigate: () => vi.fn(),
}))
import { render, screen, waitFor, act } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import MockAdapter from 'axios-mock-adapter'
import { api } from '../../../lib/api'
import { AuthProvider, useAuthContext } from '../auth-context'
import { tokenStorage } from '../../../lib/token-storage'
import { hasPermission } from '../../../lib/permissions'

const ADMIN_USER = {
  id: '1',
  email: 'admin@test.com',
  firstName: 'Admin',
  lastName: 'Test',
  permissions: ['*'],
}

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

function AuthConsumer() {
  const { user, isAuthenticated, login, logout } = useAuthContext()
  return (
    <div>
      <span data-testid="authenticated">{String(isAuthenticated)}</span>
      <span data-testid="email">{user?.email ?? 'none'}</span>
      <button onClick={() => login({ email: 'admin@test.com', password: 'pass' })}>login</button>
      <button onClick={() => logout()}>logout</button>
    </div>
  )
}

describe('Auth flow integration', () => {
  let mock: MockAdapter

  beforeEach(() => {
    mock = new MockAdapter(api)
    localStorage.clear()
  })

  it('Test 1: login → tokens stored → /auth/me called → isAuthenticated true', async () => {
    mock.onGet('/auth/me').replyOnce(401)
    mock.onPost('/auth/login').reply(200, {
      access_token: 'tok',
      refresh_token: 'ref',
    })
    mock.onGet('/auth/me').reply(200, ADMIN_USER)

    const Wrapper = createWrapper()
    render(
      <Wrapper>
        <AuthConsumer />
      </Wrapper>,
    )

    await waitFor(() => {
      expect(screen.getByTestId('authenticated')).toHaveTextContent('false')
    })

    await act(async () => {
      screen.getByRole('button', { name: 'login' }).click()
    })

    await waitFor(() => {
      expect(screen.getByTestId('authenticated')).toHaveTextContent('true')
      expect(screen.getByTestId('email')).toHaveTextContent('admin@test.com')
    })
  })

  it('Test 2: navigate to guarded route without token → returns unauthenticated', async () => {
    mock.onGet('/auth/me').reply(401)

    const Wrapper = createWrapper()
    render(
      <Wrapper>
        <AuthConsumer />
      </Wrapper>,
    )

    await waitFor(() => {
      expect(screen.getByTestId('authenticated')).toHaveTextContent('false')
    })

    // No token — isAuthenticated should remain false
    expect(tokenStorage.getAccess()).toBeNull()
  })

  it("Test 3: can('prospects') returns true for ['*'] permissions", () => {
    expect(hasPermission(['*'], 'prospects')).toBe(true)
    expect(hasPermission(['dashboard', 'prospects'], 'prospects')).toBe(true)
    expect(hasPermission(['dashboard'], 'prospects')).toBe(false)
  })

  it('Test 4: logout → user null → tokens cleared', async () => {
    tokenStorage.set('tok', 'ref')
    mock.onGet('/auth/me').reply(200, ADMIN_USER)
    mock.onPost('/auth/logout').reply(200)

    const Wrapper = createWrapper()
    render(
      <Wrapper>
        <AuthConsumer />
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

    expect(tokenStorage.getAccess()).toBeNull()
  })
})
