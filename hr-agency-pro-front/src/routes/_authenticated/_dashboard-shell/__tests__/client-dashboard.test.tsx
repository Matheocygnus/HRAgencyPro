import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import MockAdapter from 'axios-mock-adapter'
import { api } from '../../../../lib/api'
import { AuthProvider } from '../../../../features/auth/auth-context'
import { tokenStorage } from '../../../../lib/token-storage'
import { ClientDashboard } from '../client-dashboard'

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

describe('ClientDashboard', () => {
  let mock: MockAdapter

  beforeEach(() => {
    mock = new MockAdapter(api)
    localStorage.clear()
    tokenStorage.set('acc', 'ref')
    mock.onGet('/auth/me').reply(200, {
      id: '1',
      email: 'client@test.com',
      permissions: ['client_dashboard'],
      clientId: 1,
    })
  })

  it('renders with mocked user (clientId: 1)', async () => {
    mock.onGet('/clients/1').reply(200, {
      id: 1,
      name: 'Acme Corp',
      industry: 'Tech',
    })
    mock.onGet('/heroes').reply(200, [{ id: 1, name: 'Hero One' }])
    mock.onGet('/contracts').reply(200, [{ id: 1, title: 'Contract A' }])

    const Wrapper = createWrapper()
    render(
      <Wrapper>
        <ClientDashboard />
      </Wrapper>,
    )

    await waitFor(() => {
      expect(screen.getAllByText('Acme Corp').length).toBeGreaterThan(0)
    })
  })

  it('shows company, hero, contract counts', async () => {
    mock.onGet('/clients/1').reply(200, {
      id: 1,
      name: 'Acme Corp',
      industry: 'Tech',
    })
    mock.onGet('/heroes').reply(200, [
      { id: 1, name: 'Hero One' },
      { id: 2, name: 'Hero Two' },
    ])
    mock.onGet('/contracts').reply(200, [
      { id: 1, title: 'Contract A' },
      { id: 2, title: 'Contract B' },
      { id: 3, title: 'Contract C' },
    ])

    const Wrapper = createWrapper()
    render(
      <Wrapper>
        <ClientDashboard />
      </Wrapper>,
    )

    await waitFor(() => {
      expect(screen.getByTestId('stat-heroes')).toHaveTextContent('2')
      expect(screen.getByTestId('stat-contracts')).toHaveTextContent('3')
    })
  })
})
