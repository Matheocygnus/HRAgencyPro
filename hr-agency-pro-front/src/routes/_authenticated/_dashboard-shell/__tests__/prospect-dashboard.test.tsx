import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import MockAdapter from 'axios-mock-adapter'
import { api } from '../../../../lib/api'
import { AuthProvider } from '../../../../features/auth/auth-context'
import { tokenStorage } from '../../../../lib/token-storage'
import { ProspectDashboard } from '../prospect-dashboard'

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

describe('ProspectDashboard', () => {
  let mock: MockAdapter

  beforeEach(() => {
    mock = new MockAdapter(api)
    localStorage.clear()
    tokenStorage.set('acc', 'ref')
    mock.onGet('/auth/me').reply(200, {
      id: '1',
      email: 'prospect@test.com',
      permissions: ['prospect_dashboard'],
      prospectId: 1,
    })
  })

  it('renders with mocked user (prospectId: 1)', async () => {
    mock.onGet('/prospects/1').reply(200, {
      id: 1,
      name: 'Alice Prospect',
      targetCompany: 'BigCorp',
      status: 'active',
    })
    mock.onGet('/interviews').reply(200, [
      { id: 1, date: '2026-06-10', status: 'scheduled' },
    ])

    const Wrapper = createWrapper()
    render(
      <Wrapper>
        <ProspectDashboard />
      </Wrapper>,
    )

    await waitFor(() => {
      expect(screen.getByText('Alice Prospect')).toBeInTheDocument()
    })
  })

  it('shows interview stats', async () => {
    mock.onGet('/prospects/1').reply(200, {
      id: 1,
      name: 'Alice Prospect',
      targetCompany: 'BigCorp',
      status: 'active',
    })
    mock.onGet('/interviews').reply(200, [
      { id: 1, date: '2026-06-10', status: 'scheduled' },
      { id: 2, date: '2026-05-10', status: 'completed' },
      { id: 3, date: '2026-05-20', status: 'completed' },
    ])

    const Wrapper = createWrapper()
    render(
      <Wrapper>
        <ProspectDashboard />
      </Wrapper>,
    )

    await waitFor(() => {
      expect(screen.getByTestId('stat-upcoming-interviews')).toHaveTextContent('1')
      expect(screen.getByTestId('stat-completed-interviews')).toHaveTextContent('2')
    })
  })
})
