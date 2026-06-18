import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import MockAdapter from 'axios-mock-adapter'
import { api } from '../../../../lib/api'
import { ToastProvider } from '../../../../lib/toast'
import { ProspectDatabase } from '../prospect-database'

function createWrapper() {
  const qc = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  })
  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <QueryClientProvider client={qc}>
        <ToastProvider>{children}</ToastProvider>
      </QueryClientProvider>
    )
  }
  return Wrapper
}

const MOCK_PROSPECTS = [
  {
    id: 1,
    firstName: 'Alice',
    lastName: 'Smith',
    email: 'alice@test.com',
    status: 'sourcing',
    createdAt: '2024-01-01',
  },
  {
    id: 2,
    firstName: 'Bob',
    lastName: 'Jones',
    email: 'bob@test.com',
    status: 'interview',
    createdAt: '2024-01-01',
  },
]

describe('ProspectDatabase', () => {
  let mock: MockAdapter

  beforeEach(() => {
    mock = new MockAdapter(api)
    mock.onGet('/prospects').reply(200, MOCK_PROSPECTS)
    mock.onGet('/companies').reply(200, [])
  })

  it('renders table with prospect rows', async () => {
    const Wrapper = createWrapper()
    render(
      <Wrapper>
        <ProspectDatabase />
      </Wrapper>,
    )

    await waitFor(() => {
      expect(screen.getByTestId('prospect-row-1')).toBeInTheDocument()
      expect(screen.getByTestId('prospect-row-2')).toBeInTheDocument()
    })

    expect(screen.getByText('Alice Smith')).toBeInTheDocument()
    expect(screen.getByText('Bob Jones')).toBeInTheDocument()
  })

  it('search input filters visible rows', async () => {
    const user = userEvent.setup({ delay: null })
    const Wrapper = createWrapper()
    render(
      <Wrapper>
        <ProspectDatabase />
      </Wrapper>,
    )

    await waitFor(() => {
      expect(screen.getByTestId('prospect-row-1')).toBeInTheDocument()
    })

    const searchInput = screen.getByRole('searchbox', { name: /search/i })
    await user.type(searchInput, 'Alice')

    // Wait for debounce (300ms) + re-render
    await waitFor(
      () => {
        expect(screen.queryByTestId('prospect-row-2')).not.toBeInTheDocument()
      },
      { timeout: 1000 },
    )

    expect(screen.getByTestId('prospect-row-1')).toBeInTheDocument()
  })
})
