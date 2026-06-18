import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import MockAdapter from 'axios-mock-adapter'
import { api } from '../../../../lib/api'
import { ContractsPage } from '../contracts'

function createWrapper() {
  const qc = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  })
  function Wrapper({ children }: { children: React.ReactNode }) {
    return <QueryClientProvider client={qc}>{children}</QueryClientProvider>
  }
  return Wrapper
}

const MOCK_CONTRACTS = [
  { id: 1, heroId: 10, clientId: 5, status: 'active', startDate: '2024-01-01', endDate: '2025-01-01', lengthMonths: 12 },
  { id: 2, heroId: 11, clientId: 6, status: 'draft', startDate: '2024-03-01', endDate: undefined, lengthMonths: undefined },
]

describe('ContractsPage', () => {
  let mock: MockAdapter

  beforeEach(() => {
    mock = new MockAdapter(api)
    mock.onGet('/contracts').reply(200, MOCK_CONTRACTS)
    mock.onDelete('/contracts/1').reply(200)
  })

  it('renders table rows with contract data', async () => {
    const Wrapper = createWrapper()
    render(<Wrapper><ContractsPage /></Wrapper>)

    await waitFor(() => {
      expect(screen.getByTestId('contract-row-1')).toBeInTheDocument()
      expect(screen.getByTestId('contract-row-2')).toBeInTheDocument()
    })
  })

  it('status tab filters contracts', async () => {
    const user = userEvent.setup()
    const Wrapper = createWrapper()
    render(<Wrapper><ContractsPage /></Wrapper>)

    await waitFor(() => {
      expect(screen.getByTestId('contract-row-1')).toBeInTheDocument()
    })

    await user.click(screen.getByRole('tab', { name: 'draft' }))

    await waitFor(() => {
      expect(screen.queryByTestId('contract-row-1')).not.toBeInTheDocument()
      expect(screen.getByTestId('contract-row-2')).toBeInTheDocument()
    })
  })

  it('create button opens dialog', async () => {
    const user = userEvent.setup()
    const Wrapper = createWrapper()
    render(<Wrapper><ContractsPage /></Wrapper>)

    await user.click(screen.getByRole('button', { name: /add contract/i }))
    expect(screen.getByTestId('contract-form-dialog')).toBeInTheDocument()
  })
})
