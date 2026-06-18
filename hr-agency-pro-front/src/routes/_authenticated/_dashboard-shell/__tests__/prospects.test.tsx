import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import MockAdapter from 'axios-mock-adapter'
import { api } from '../../../../lib/api'
import { ProspectsKanban } from '../prospects'

// Mock @dnd-kit/core to avoid pointer sensor issues in jsdom
vi.mock('@dnd-kit/core', () => ({
  DndContext: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  PointerSensor: class {},
  useSensor: () => ({}),
  useSensors: (...args: unknown[]) => args,
  useDroppable: () => ({ setNodeRef: () => {} }),
}))

vi.mock('@dnd-kit/sortable', () => ({
  SortableContext: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  useSortable: () => ({
    attributes: {},
    listeners: {},
    setNodeRef: () => {},
    transform: null,
    transition: undefined,
  }),
  verticalListSortingStrategy: {},
}))

vi.mock('@dnd-kit/utilities', () => ({
  CSS: { Transform: { toString: () => '' } },
}))

function createWrapper() {
  const qc = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  })
  function Wrapper({ children }: { children: React.ReactNode }) {
    return <QueryClientProvider client={qc}>{children}</QueryClientProvider>
  }
  return Wrapper
}

const MOCK_PROSPECTS = [
  {
    id: 1,
    firstName: 'Alice',
    lastName: 'Smith',
    email: 'alice@example.com',
    status: 'sourcing',
    targetCompany: 'ACME',
    createdAt: '2024-01-01',
  },
  {
    id: 2,
    firstName: 'Bob',
    lastName: 'Jones',
    email: 'bob@example.com',
    status: 'interview',
    createdAt: '2024-01-01',
  },
]

describe('ProspectsKanban', () => {
  let mock: MockAdapter

  beforeEach(() => {
    mock = new MockAdapter(api)
    mock.onGet('/prospects').reply(200, MOCK_PROSPECTS)
  })

  it('renders 8 column headers', async () => {
    const Wrapper = createWrapper()
    render(
      <Wrapper>
        <ProspectsKanban />
      </Wrapper>,
    )

    await waitFor(() => {
      expect(screen.getByTestId('column-sourcing')).toBeInTheDocument()
    })

    expect(screen.getByTestId('column-contacted')).toBeInTheDocument()
    expect(screen.getByTestId('column-interview')).toBeInTheDocument()
    expect(screen.getByTestId('column-client_review')).toBeInTheDocument()
    expect(screen.getByTestId('column-budget')).toBeInTheDocument()
    expect(screen.getByTestId('column-contract')).toBeInTheDocument()
    expect(screen.getByTestId('column-hired')).toBeInTheDocument()
    expect(screen.getByTestId('column-rejected')).toBeInTheDocument()
  })

  it('renders prospect card in correct column', async () => {
    const Wrapper = createWrapper()
    render(
      <Wrapper>
        <ProspectsKanban />
      </Wrapper>,
    )

    await waitFor(() => {
      expect(screen.getByTestId('prospect-card-1')).toBeInTheDocument()
    })

    // Alice should be in sourcing column
    const sourcingCol = screen.getByTestId('column-sourcing')
    expect(sourcingCol).toHaveTextContent('Alice Smith')

    // Bob should be in interview column
    const interviewCol = screen.getByTestId('column-interview')
    expect(interviewCol).toHaveTextContent('Bob Jones')
  })
})
