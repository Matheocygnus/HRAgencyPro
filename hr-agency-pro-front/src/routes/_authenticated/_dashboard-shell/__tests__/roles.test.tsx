import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import MockAdapter from 'axios-mock-adapter'
import { api } from '../../../../lib/api'
import { RolesPage } from '../roles'

function createWrapper() {
  const qc = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  })
  function Wrapper({ children }: { children: React.ReactNode }) {
    return <QueryClientProvider client={qc}>{children}</QueryClientProvider>
  }
  return Wrapper
}

const MOCK_ROLES = [
  { id: 1, name: 'Admin', permissions: ['prospects', 'heroes', 'contracts'] },
  { id: 2, name: 'Agent', permissions: ['prospects'] },
]

describe('RolesPage', () => {
  let mock: MockAdapter

  beforeEach(() => {
    mock = new MockAdapter(api)
    mock.onGet('/roles').reply(200, MOCK_ROLES)
  })

  it('renders roles table', async () => {
    const Wrapper = createWrapper()
    render(<Wrapper><RolesPage /></Wrapper>)

    await waitFor(() => {
      expect(screen.getByTestId('role-row-1')).toBeInTheDocument()
      expect(screen.getByTestId('role-row-2')).toBeInTheDocument()
    })
    expect(screen.getByText('Admin')).toBeInTheDocument()
  })

  it('permission checkboxes rendered in dialog', async () => {
    const user = userEvent.setup()
    const Wrapper = createWrapper()
    render(<Wrapper><RolesPage /></Wrapper>)

    await user.click(screen.getByRole('button', { name: /add role/i }))

    await waitFor(() => {
      expect(screen.getByTestId('role-form-dialog')).toBeInTheDocument()
    })

    // Check that permission checkboxes are rendered
    expect(screen.getByRole('checkbox', { name: 'prospects' })).toBeInTheDocument()
    expect(screen.getByRole('checkbox', { name: 'heroes' })).toBeInTheDocument()
    expect(screen.getByRole('checkbox', { name: 'contracts' })).toBeInTheDocument()
  })
})
