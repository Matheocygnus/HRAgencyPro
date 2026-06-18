import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Skeleton, SkeletonTable } from '../Skeleton'

describe('Skeleton', () => {
  it('renders with animate-pulse class', () => {
    const { container } = render(<Skeleton />)
    const el = container.firstChild as HTMLElement
    expect(el).toHaveClass('animate-pulse')
  })

  it('accepts custom className', () => {
    const { container } = render(<Skeleton className="h-4 w-full" />)
    const el = container.firstChild as HTMLElement
    expect(el).toHaveClass('h-4')
    expect(el).toHaveClass('w-full')
  })
})

describe('SkeletonTable', () => {
  it('renders correct row count (default 5)', () => {
    render(<SkeletonTable />)
    const rows = screen.getAllByRole('row')
    expect(rows).toHaveLength(5)
  })

  it('renders custom row count', () => {
    render(<SkeletonTable rows={3} cols={2} />)
    const rows = screen.getAllByRole('row')
    expect(rows).toHaveLength(3)
  })

  it('renders loading table aria label', () => {
    render(<SkeletonTable />)
    expect(screen.getByRole('table', { name: 'loading table' })).toBeInTheDocument()
  })
})
