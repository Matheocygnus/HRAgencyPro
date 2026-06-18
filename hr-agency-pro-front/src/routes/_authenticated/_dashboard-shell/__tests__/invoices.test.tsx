import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import MockAdapter from 'axios-mock-adapter'
import { api } from '../../../../lib/api'
import { InvoicesPage } from '../invoices'

function createWrapper() {
  const qc = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  })
  function Wrapper({ children }: { children: React.ReactNode }) {
    return <QueryClientProvider client={qc}>{children}</QueryClientProvider>
  }
  return Wrapper
}

const MOCK_INVOICES = [
  { id: 1, clientId: 5, amount: 1500, status: 'pending', dueDate: '2024-06-01', createdAt: '2024-01-01' },
  { id: 2, clientId: 6, amount: 3000, status: 'paid', dueDate: '2024-05-15', createdAt: '2024-01-01' },
]

describe('InvoicesPage', () => {
  let mock: MockAdapter

  beforeEach(() => {
    mock = new MockAdapter(api)
    mock.onGet('/invoices').reply(200, MOCK_INVOICES)
  })

  it('renders invoices table with rows', async () => {
    const Wrapper = createWrapper()
    render(<Wrapper><InvoicesPage /></Wrapper>)

    await waitFor(() => {
      expect(screen.getByTestId('invoice-row-1')).toBeInTheDocument()
      expect(screen.getByTestId('invoice-row-2')).toBeInTheDocument()
    })
  })

  it('status tab switches filter', async () => {
    const user = userEvent.setup()
    const Wrapper = createWrapper()
    render(<Wrapper><InvoicesPage /></Wrapper>)

    await waitFor(() => {
      expect(screen.getByTestId('invoice-row-1')).toBeInTheDocument()
    })

    await user.click(screen.getByRole('tab', { name: 'paid' }))

    await waitFor(() => {
      expect(screen.queryByTestId('invoice-row-1')).not.toBeInTheDocument()
      expect(screen.getByTestId('invoice-row-2')).toBeInTheDocument()
    })
  })

  it('invoice row is visible', async () => {
    const Wrapper = createWrapper()
    render(<Wrapper><InvoicesPage /></Wrapper>)

    await waitFor(() => {
      expect(screen.getByTestId('invoice-row-1')).toBeInTheDocument()
    })
    expect(screen.getByText('1500')).toBeInTheDocument()
  })
})
