import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import MockAdapter from 'axios-mock-adapter'
import { api } from '../../../../lib/api'
import { JobsPage } from '../jobs'

function createWrapper() {
  const qc = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  })
  function Wrapper({ children }: { children: React.ReactNode }) {
    return <QueryClientProvider client={qc}>{children}</QueryClientProvider>
  }
  return Wrapper
}

const MOCK_OPENINGS = [
  {
    id: 1,
    title: 'Frontend Dev',
    location: 'Remote',
    salaryRange: '5k-8k',
    status: 'active',
    createdAt: '2024-01-01',
  },
]

const MOCK_APPLICATIONS = [
  {
    id: 1,
    firstName: 'Alice',
    lastName: 'Smith',
    email: 'alice@test.com',
    jobOpeningId: 1,
    status: 'pending',
  },
]

const MOCK_REQUESTS = [
  {
    id: 1,
    clientId: 2,
    title: 'Backend Dev',
    status: 'pending',
    createdAt: '2024-01-01',
  },
]

describe('JobsPage', () => {
  let mock: MockAdapter

  beforeEach(() => {
    mock = new MockAdapter(api)
    mock.onGet('/job-openings').reply(200, MOCK_OPENINGS)
    mock.onGet('/job-applications').reply(200, MOCK_APPLICATIONS)
    mock.onGet('/job-requests').reply(200, MOCK_REQUESTS)
  })

  it('renders Job Openings tab by default', async () => {
    const Wrapper = createWrapper()
    render(
      <Wrapper>
        <JobsPage />
      </Wrapper>,
    )

    await waitFor(() => {
      expect(screen.getByTestId('jobs-page')).toBeInTheDocument()
    })

    expect(screen.getByTestId('tab-job-openings')).toBeInTheDocument()
    await waitFor(() => {
      expect(screen.getByText('Frontend Dev')).toBeInTheDocument()
    })
  })

  it('switches to Job Applications tab', async () => {
    const user = userEvent.setup()
    const Wrapper = createWrapper()
    render(
      <Wrapper>
        <JobsPage />
      </Wrapper>,
    )

    await waitFor(() => {
      expect(screen.getByTestId('tab-job-applications')).toBeInTheDocument()
    })

    await user.click(screen.getByTestId('tab-job-applications'))

    await waitFor(() => {
      expect(screen.getByText('Alice Smith')).toBeInTheDocument()
    })
  })

  it('switches to Job Requests tab', async () => {
    const user = userEvent.setup()
    const Wrapper = createWrapper()
    render(
      <Wrapper>
        <JobsPage />
      </Wrapper>,
    )

    await waitFor(() => {
      expect(screen.getByTestId('tab-job-requests')).toBeInTheDocument()
    })

    await user.click(screen.getByTestId('tab-job-requests'))

    await waitFor(() => {
      expect(screen.getByText('Backend Dev')).toBeInTheDocument()
    })
  })
})
