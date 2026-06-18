import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import MockAdapter from 'axios-mock-adapter'
import { api } from '../../../../lib/api'
import { AuthProvider } from '../../../../features/auth/auth-context'
import { ToastProvider } from '../../../../lib/toast'
import { SettingsPage } from '../settings'

const MOCK_USER = {
  id: '42',
  email: 'alice@test.com',
  permissions: ['settings'],
}

function createWrapper() {
  const qc = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  })

  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <QueryClientProvider client={qc}>
        <ToastProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </ToastProvider>
      </QueryClientProvider>
    )
  }
  return Wrapper
}

describe('SettingsPage', () => {
  let mock: MockAdapter

  beforeEach(() => {
    mock = new MockAdapter(api)
    mock.onGet('/auth/me').reply(200, MOCK_USER)
    mock.onPatch('/users/42').reply(200, { ...MOCK_USER })
    mock.onPost('/auth/change-password').reply(200)
  })

  it('profile tab renders with user email', async () => {
    const Wrapper = createWrapper()
    render(<Wrapper><SettingsPage /></Wrapper>)

    await waitFor(() => {
      expect(screen.getByTestId('settings-page')).toBeInTheDocument()
    })
    expect(screen.getByTestId('profile-tab-content')).toBeInTheDocument()
  })

  it('switches to password tab', async () => {
    const user = userEvent.setup()
    const Wrapper = createWrapper()
    render(<Wrapper><SettingsPage /></Wrapper>)

    await waitFor(() => {
      expect(screen.getByTestId('settings-page')).toBeInTheDocument()
    })

    await user.click(screen.getByRole('tab', { name: 'Password' }))

    await waitFor(() => {
      expect(screen.getByTestId('password-tab-content')).toBeInTheDocument()
    })
  })

  it('password mismatch shows error', async () => {
    const user = userEvent.setup()
    const Wrapper = createWrapper()
    render(<Wrapper><SettingsPage /></Wrapper>)

    await waitFor(() => {
      expect(screen.getByTestId('settings-page')).toBeInTheDocument()
    })

    await user.click(screen.getByRole('tab', { name: 'Password' }))

    await waitFor(() => {
      expect(screen.getByTestId('password-tab-content')).toBeInTheDocument()
    })

    await user.type(screen.getByLabelText('Current Password'), 'oldpass123')
    await user.type(screen.getByLabelText('New Password'), 'newpass123')
    await user.type(screen.getByLabelText('Confirm Password'), 'different123')

    await user.click(screen.getByRole('button', { name: /save password/i }))

    await waitFor(() => {
      expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument()
    })
  })
})
