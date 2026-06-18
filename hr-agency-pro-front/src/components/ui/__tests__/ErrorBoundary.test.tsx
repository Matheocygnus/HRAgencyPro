import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ErrorBoundary } from '../ErrorBoundary'

function ThrowingComponent({ shouldThrow }: { shouldThrow: boolean }) {
  if (shouldThrow) {
    throw new Error('Test error')
  }
  return <div data-testid="child">Normal content</div>
}

describe('ErrorBoundary', () => {
  it('renders children when no error', () => {
    render(
      <ErrorBoundary>
        <ThrowingComponent shouldThrow={false} />
      </ErrorBoundary>,
    )

    expect(screen.getByTestId('child')).toBeInTheDocument()
    expect(screen.getByText('Normal content')).toBeInTheDocument()
  })

  it('renders fallback when child throws', () => {
    // Suppress console.error for this test
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})

    render(
      <ErrorBoundary fallback={<div role="alert">Custom fallback</div>}>
        <ThrowingComponent shouldThrow />
      </ErrorBoundary>,
    )

    expect(screen.getByRole('alert')).toBeInTheDocument()
    expect(screen.queryByTestId('child')).not.toBeInTheDocument()

    spy.mockRestore()
  })

  it('renders default fallback when no fallback prop provided', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})

    render(
      <ErrorBoundary>
        <ThrowingComponent shouldThrow />
      </ErrorBoundary>,
    )

    expect(screen.getByRole('alert')).toBeInTheDocument()
    expect(screen.getByText(/Something went wrong/i)).toBeInTheDocument()

    spy.mockRestore()
  })
})
