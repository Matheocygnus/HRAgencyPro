import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import MockAdapter from 'axios-mock-adapter'
import { api } from '../../lib/api'
import { CareersPage } from '../careers'

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
    title: 'Frontend Engineer',
    location: 'Remote',
    salaryRange: '6k-9k',
    status: 'active',
    createdAt: '2024-01-01',
  },
  {
    id: 2,
    title: 'Closed Position',
    location: 'NYC',
    salaryRange: '4k-6k',
    status: 'closed',
    createdAt: '2024-01-01',
  },
]

describe('CareersPage', () => {
  let mock: MockAdapter

  beforeEach(() => {
    mock = new MockAdapter(api)
    mock.onGet('/job-openings').reply(200, MOCK_OPENINGS)
  })

  it('renders without redirect (no auth check)', async () => {
    const Wrapper = createWrapper()
    render(
      <Wrapper>
        <CareersPage />
      </Wrapper>,
    )

    await waitFor(() => {
      expect(screen.getByTestId('careers-page')).toBeInTheDocument()
    })
  })

  it('shows only active job cards', async () => {
    const Wrapper = createWrapper()
    render(
      <Wrapper>
        <CareersPage />
      </Wrapper>,
    )

    await waitFor(() => {
      expect(screen.getByText('Frontend Engineer')).toBeInTheDocument()
    })

    expect(screen.queryByText('Closed Position')).not.toBeInTheDocument()
  })

  it('apply dialog opens and shows form fields', async () => {
    const user = userEvent.setup()
    const Wrapper = createWrapper()
    render(
      <Wrapper>
        <CareersPage />
      </Wrapper>,
    )

    await waitFor(() => {
      expect(screen.getByText('Frontend Engineer')).toBeInTheDocument()
    })

    await user.click(screen.getByTestId('btn-apply-1'))

    expect(screen.getByTestId('apply-dialog')).toBeInTheDocument()
    expect(screen.getByTestId('input-first-name')).toBeInTheDocument()
    expect(screen.getByTestId('input-email')).toBeInTheDocument()
  })

  it('submit shows success message', async () => {
    const user = userEvent.setup({ delay: null })
    mock.onPost('/job-applications').reply(201, { id: 99 })

    const Wrapper = createWrapper()
    render(
      <Wrapper>
        <CareersPage />
      </Wrapper>,
    )

    await waitFor(() => {
      expect(screen.getByText('Frontend Engineer')).toBeInTheDocument()
    })

    await user.click(screen.getByTestId('btn-apply-1'))

    await user.type(screen.getByTestId('input-first-name'), 'John')
    await user.type(screen.getByTestId('input-last-name'), 'Doe')
    await user.type(screen.getByTestId('input-country'), 'Argentina')
    await user.type(screen.getByTestId('input-email'), 'john@test.com')
    await user.type(screen.getByTestId('input-phone'), '+54911000000')
    await user.selectOptions(screen.getByLabelText('How should we refer to you? *'), 'He/Him')
    await user.type(screen.getByPlaceholderText('e.g. Senior React Developer'), 'React Developer')
    await user.type(screen.getByPlaceholderText('e.g. LinkedIn, referral, job board'), 'LinkedIn')
    await user.click(screen.getByTestId('checkbox-salary'))
    await user.type(screen.getByPlaceholderText('https://vocaroo.com/...'), 'https://vocaroo.com/test123')
    const file = new File(['resume'], 'resume.pdf', { type: 'application/pdf' })
    await user.upload(document.querySelector('input[type="file"]') as HTMLInputElement, file)
    await user.selectOptions(screen.getByLabelText('English Level *'), 'Advanced')
    await user.selectOptions(screen.getByLabelText('Years of Experience *'), 'Senior (6+ years)')
    await user.type(screen.getByPlaceholderText('Slack, Notion, Jira, Figma...'), 'Slack')
    await user.type(screen.getByPlaceholderText(/Reference 1:/), 'Ref: John Smith, CTO, +1 555 0001, john@co.com, Manager')

    await user.click(screen.getByTestId('btn-submit-apply'))

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument()
    })
  })
})
