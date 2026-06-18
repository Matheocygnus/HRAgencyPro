import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import MockAdapter from 'axios-mock-adapter'
import { api } from '../../../../lib/api'
import { UsersPage } from '../users'

function createWrapper() {
  const qc = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  })
  function Wrapper({ children }: { children: React.ReactNode }) {
    return <QueryClientProvider client={qc}>{children}</QueryClientProvider>
  }
  return Wrapper
}

const MOCK_USERS = [
  { id: 1, firstName: 'Alice', lastName: 'Smith', email: 'alice@test.com', roleId: 1, role: { id: 1, name: 'Admin', permissions: [] } },
  { id: 2, firstName: 'Bob', lastName: 'Jones', email: 'bob@test.com', roleId: 2, role: { id: 2, name: 'Agent', permissions: [] } },
]

const MOCK_ROLES = [
  { id: 1, name: 'Admin', permissions: [] },
  { id: 2, name: 'Agent', permissions: [] },
]

describe('UsersPage', () => {
  let mock: MockAdapter

  beforeEach(() => {
    mock = new MockAdapter(api)
    mock.onGet('/users').reply(200, MOCK_USERS)
    mock.onGet('/roles').reply(200, MOCK_ROLES)
  })

  it('renders user table with rows', async () => {
    const Wrapper = createWrapper()
    render(<Wrapper><UsersPage /></Wrapper>)

    await waitFor(() => {
      expect(screen.getByTestId('user-row-1')).toBeInTheDocument()
      expect(screen.getByTestId('user-row-2')).toBeInTheDocument()
    })
    expect(screen.getByText('Alice')).toBeInTheDocument()
  })

  it('role select is populated in dialog', async () => {
    const user = userEvent.setup()
    const Wrapper = createWrapper()
    render(<Wrapper><UsersPage /></Wrapper>)

    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByTestId('user-row-1')).toBeInTheDocument()
    })

    await user.click(screen.getByRole('button', { name: /add user/i }))

    await waitFor(() => {
      expect(screen.getByTestId('user-form-dialog')).toBeInTheDocument()
    })

    await waitFor(() => {
      expect(screen.getByRole('option', { name: 'Admin' })).toBeInTheDocument()
      expect(screen.getByRole('option', { name: 'Agent' })).toBeInTheDocument()
    })
  })
})
