import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import MockAdapter from 'axios-mock-adapter'
import { api } from '../../../../lib/api'
import { ClientsPage } from '../clients'

function createWrapper() {
  const qc = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  })
  function Wrapper({ children }: { children: React.ReactNode }) {
    return <QueryClientProvider client={qc}>{children}</QueryClientProvider>
  }
  return Wrapper
}

const MOCK_CLIENTS = [
  { id: 1, name: 'Acme Corp', email: 'acme@test.com', createdAt: '2024-01-01' },
  { id: 2, name: 'Globex', email: 'globex@test.com', createdAt: '2024-01-01' },
]

const MOCK_COMPANIES = [
  { id: 10, name: 'Acme HQ', clientId: 1, createdAt: '2024-01-01' },
]

describe('ClientsPage', () => {
  let mock: MockAdapter

  beforeEach(() => {
    mock = new MockAdapter(api)
    mock.onGet('/clients').reply(200, MOCK_CLIENTS)
    mock.onGet('/companies').reply(200, MOCK_COMPANIES)
  })

  it('renders clients tab with rows', async () => {
    const Wrapper = createWrapper()
    render(
      <Wrapper>
        <ClientsPage />
      </Wrapper>,
    )

    await waitFor(() => {
      expect(screen.getByTestId('client-row-1')).toBeInTheDocument()
      expect(screen.getByTestId('client-row-2')).toBeInTheDocument()
    })

    expect(screen.getByText('Acme Corp')).toBeInTheDocument()
    expect(screen.getByText('Globex')).toBeInTheDocument()
  })

  it('switches to companies tab', async () => {
    const user = userEvent.setup()
    const Wrapper = createWrapper()
    render(
      <Wrapper>
        <ClientsPage />
      </Wrapper>,
    )

    // Initially showing clients tab
    await waitFor(() => {
      expect(screen.getByTestId('client-row-1')).toBeInTheDocument()
    })

    // Click Companies tab
    await user.click(screen.getByRole('tab', { name: 'Companies' }))

    await waitFor(() => {
      expect(screen.getByTestId('company-row-10')).toBeInTheDocument()
    })

    expect(screen.queryByTestId('client-row-1')).not.toBeInTheDocument()
  })
})
