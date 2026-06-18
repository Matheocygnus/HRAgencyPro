import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import MockAdapter from 'axios-mock-adapter'
import { api } from '../../../../lib/api'
import { InterviewsPage } from '../interviews'

function createWrapper() {
  const qc = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  })
  function Wrapper({ children }: { children: React.ReactNode }) {
    return <QueryClientProvider client={qc}>{children}</QueryClientProvider>
  }
  return Wrapper
}

const MOCK_INTERVIEWS = [
  { id: 1, prospectId: 10, scheduledAt: '2024-06-01T10:00', status: 'scheduled', notes: 'First round' },
  { id: 2, prospectId: 11, scheduledAt: '2024-06-05T14:00', status: 'completed', notes: undefined },
]

describe('InterviewsPage', () => {
  let mock: MockAdapter

  beforeEach(() => {
    mock = new MockAdapter(api)
    mock.onGet('/interviews').reply(200, MOCK_INTERVIEWS)
  })

  it('renders table with interview rows', async () => {
    const Wrapper = createWrapper()
    render(<Wrapper><InterviewsPage /></Wrapper>)

    await waitFor(() => {
      expect(screen.getByTestId('interview-row-1')).toBeInTheDocument()
      expect(screen.getByTestId('interview-row-2')).toBeInTheDocument()
    })
  })

  it('schedule button opens dialog', async () => {
    const user = userEvent.setup()
    const Wrapper = createWrapper()
    render(<Wrapper><InterviewsPage /></Wrapper>)

    await user.click(screen.getByRole('button', { name: /schedule interview/i }))
    expect(screen.getByTestId('interview-form-dialog')).toBeInTheDocument()
  })
})
