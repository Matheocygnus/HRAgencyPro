import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import MockAdapter from 'axios-mock-adapter'
import { api } from '../../../../lib/api'
import { HeroesList } from '../heroes.index'

// Mock TanStack Router navigation
vi.mock('@tanstack/react-router', async () => {
  const actual = await vi.importActual('@tanstack/react-router')
  return {
    ...actual,
    createFileRoute: () => (config: { component: unknown }) => config,
    useNavigate: () => vi.fn(),
  }
})

function createWrapper() {
  const qc = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  })
  function Wrapper({ children }: { children: React.ReactNode }) {
    return <QueryClientProvider client={qc}>{children}</QueryClientProvider>
  }
  return Wrapper
}

const MOCK_HEROES = [
  {
    id: 1,
    firstName: 'Jane',
    lastName: 'Doe',
    email: 'jane@example.com',
    skills: ['React', 'TypeScript'],
    createdAt: '2024-01-01',
  },
  {
    id: 2,
    firstName: 'John',
    lastName: 'Smith',
    email: 'john@example.com',
    skills: ['Node.js'],
    createdAt: '2024-01-01',
  },
]

describe('HeroesList', () => {
  let mock: MockAdapter

  beforeEach(() => {
    mock = new MockAdapter(api)
    mock.onGet('/heroes').reply(200, MOCK_HEROES)
  })

  it('renders hero table with rows', async () => {
    const Wrapper = createWrapper()
    render(
      <Wrapper>
        <HeroesList />
      </Wrapper>,
    )

    await waitFor(() => {
      expect(screen.getByTestId('hero-row-1')).toBeInTheDocument()
      expect(screen.getByTestId('hero-row-2')).toBeInTheDocument()
    })

    expect(screen.getByText('Jane Doe')).toBeInTheDocument()
    expect(screen.getByText('John Smith')).toBeInTheDocument()
  })

  it('search filters heroes', async () => {
    const user = userEvent.setup()
    const Wrapper = createWrapper()
    render(
      <Wrapper>
        <HeroesList />
      </Wrapper>,
    )

    await waitFor(() => {
      expect(screen.getByTestId('hero-row-1')).toBeInTheDocument()
    })

    const searchInput = screen.getByRole('searchbox', { name: /search heroes/i })
    await user.type(searchInput, 'Jane')

    await waitFor(() => {
      expect(screen.queryByTestId('hero-row-2')).not.toBeInTheDocument()
    })
    expect(screen.getByTestId('hero-row-1')).toBeInTheDocument()
  })
})
