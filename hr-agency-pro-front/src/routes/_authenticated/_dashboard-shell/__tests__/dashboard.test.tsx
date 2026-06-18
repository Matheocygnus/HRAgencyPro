import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import MockAdapter from 'axios-mock-adapter'
import { api } from '../../../../lib/api'
import { AuthProvider } from '../../../../features/auth/auth-context'
import { tokenStorage } from '../../../../lib/token-storage'
import { Dashboard } from '../dashboard'

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

describe('Dashboard', () => {
  let mock: MockAdapter

  beforeEach(() => {
    mock = new MockAdapter(api)
    localStorage.clear()
    tokenStorage.set('acc', 'ref')
    mock.onGet('/auth/me').reply(200, {
      id: '1',
      email: 'admin@test.com',
      permissions: ['dashboard'],
    })
  })

  it('renders stat cards when data loaded', async () => {
    mock.onGet('/dashboard/stats').reply(200, {
      upcomingInterviews: 3,
      matchedProspects: 12,
      activeClients: 5,
      pendingInvoices: 2,
    })
    mock.onGet('/job-requests').reply(200, [])
    mock.onGet('/job-applications').reply(200, [])

    const Wrapper = createWrapper()
    render(
      <Wrapper>
        <Dashboard />
      </Wrapper>,
    )

    await waitFor(() => {
      expect(screen.getByText('3')).toBeInTheDocument()
      expect(screen.getByText('12')).toBeInTheDocument()
      expect(screen.getByText('5')).toBeInTheDocument()
      expect(screen.getByText('2')).toBeInTheDocument()
    })
    expect(screen.getByText('Upcoming Interviews')).toBeInTheDocument()
    expect(screen.getByText('Matched Prospects')).toBeInTheDocument()
    expect(screen.getByText('Active Clients')).toBeInTheDocument()
    expect(screen.getByText('Pending Invoices')).toBeInTheDocument()
  })

  it('shows loading state when queries pending', async () => {
    mock.onGet('/dashboard/stats').reply(() => new Promise(() => {}))
    mock.onGet('/job-requests').reply(() => new Promise(() => {}))
    mock.onGet('/job-applications').reply(() => new Promise(() => {}))

    const Wrapper = createWrapper()
    render(
      <Wrapper>
        <Dashboard />
      </Wrapper>,
    )

    expect(screen.getByTestId('dashboard-loading')).toBeInTheDocument()
  })

  it('tabs switch between job requests and job applications', async () => {
    mock.onGet('/dashboard/stats').reply(200, {
      upcomingInterviews: 0,
      matchedProspects: 0,
      activeClients: 0,
      pendingInvoices: 0,
    })
    mock.onGet('/job-requests').reply(200, [
      { id: 1, title: 'Frontend Dev', status: 'open' },
    ])
    mock.onGet('/job-applications').reply(200, [
      { id: 1, firstName: 'John', lastName: 'Doe', status: 'pending' },
    ])

    const Wrapper = createWrapper()
    render(
      <Wrapper>
        <Dashboard />
      </Wrapper>,
    )

    await waitFor(() => {
      expect(screen.getByText('Frontend Dev')).toBeInTheDocument()
    })

    await userEvent.click(screen.getByRole('tab', { name: /applications/i }))

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument()
    })
    expect(screen.queryByText('Frontend Dev')).not.toBeInTheDocument()
  })
})
