import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import MockAdapter from 'axios-mock-adapter'
import { api } from '../../../../lib/api'
import { JobRequestsPage } from '../job-requests'

// Mock auth context so useAuth().user?.clientId returns 5
vi.mock('../../../../features/auth/use-auth', () => ({
  useAuth: () => ({ user: { clientId: 5 } }),
}))

function createWrapper() {
  const qc = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  })
  function Wrapper({ children }: { children: React.ReactNode }) {
    return <QueryClientProvider client={qc}>{children}</QueryClientProvider>
  }
  return Wrapper
}

const MOCK_REQUESTS = [
  {
    id: 1,
    clientId: 5,
    title: 'Senior Backend Dev',
    description: 'Need a senior',
    status: 'pending',
    createdAt: '2024-01-01',
  },
]

describe('JobRequestsPage', () => {
  let mock: MockAdapter

  beforeEach(() => {
    mock = new MockAdapter(api)
    mock.onGet('/job-requests').reply(200, MOCK_REQUESTS)
  })

  it('renders job requests table', async () => {
    const Wrapper = createWrapper()
    render(
      <Wrapper>
        <JobRequestsPage />
      </Wrapper>,
    )

    await waitFor(() => {
      expect(screen.getByTestId('job-requests-page')).toBeInTheDocument()
    })

    await waitFor(() => {
      expect(screen.getByText('Senior Backend Dev')).toBeInTheDocument()
    })
  })

  it('create button opens dialog', async () => {
    const user = userEvent.setup()
    const Wrapper = createWrapper()
    render(
      <Wrapper>
        <JobRequestsPage />
      </Wrapper>,
    )

    await waitFor(() => {
      expect(screen.getByTestId('job-requests-page')).toBeInTheDocument()
    })

    await user.click(screen.getByTestId('btn-add-job-request'))

    expect(screen.getByRole('dialog', { hidden: true })).toBeInTheDocument()
  })
})
