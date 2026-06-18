import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import MockAdapter from 'axios-mock-adapter'
import { api } from '../../../../lib/api'
import { AuthProvider } from '../../../../features/auth/auth-context'
import { tokenStorage } from '../../../../lib/token-storage'
import { HeroDashboard } from '../hero-dashboard'

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

describe('HeroDashboard', () => {
  let mock: MockAdapter

  beforeEach(() => {
    mock = new MockAdapter(api)
    localStorage.clear()
    tokenStorage.set('acc', 'ref')
    mock.onGet('/auth/me').reply(200, {
      id: '1',
      email: 'hero@test.com',
      permissions: ['hero_dashboard'],
      heroId: 1,
    })
  })

  it('renders with mocked user (heroId: 1)', async () => {
    mock.onGet('/heroes/1').reply(200, {
      id: 1,
      name: 'Jane Hero',
      title: 'Senior Developer',
    })
    mock.onGet('/contracts').reply(200, [
      { id: 1, title: 'Contract A', lengthMonths: 6 },
    ])

    const Wrapper = createWrapper()
    render(
      <Wrapper>
        <HeroDashboard />
      </Wrapper>,
    )

    await waitFor(() => {
      expect(screen.getByText('Jane Hero')).toBeInTheDocument()
    })
  })

  it('shows contract length stat', async () => {
    mock.onGet('/heroes/1').reply(200, {
      id: 1,
      name: 'Jane Hero',
      title: 'Senior Developer',
    })
    mock.onGet('/contracts').reply(200, [
      { id: 1, title: 'Contract A', lengthMonths: 12 },
    ])

    const Wrapper = createWrapper()
    render(
      <Wrapper>
        <HeroDashboard />
      </Wrapper>,
    )

    await waitFor(() => {
      expect(screen.getByTestId('stat-contract-length')).toHaveTextContent('12')
    })
  })
})
