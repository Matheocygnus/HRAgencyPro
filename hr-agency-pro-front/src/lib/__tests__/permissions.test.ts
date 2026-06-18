import { describe, it, expect } from 'vitest'
import { hasPermission } from '../permissions'

describe('hasPermission', () => {
  it('wildcard grants access', () => {
    expect(hasPermission(['*'], 'dashboard')).toBe(true)
  })

  it('exact match grants access', () => {
    expect(hasPermission(['dashboard', 'reports'], 'dashboard')).toBe(true)
  })

  it('no match denies access', () => {
    expect(hasPermission(['reports'], 'dashboard')).toBe(false)
  })

  it('empty perms array denies access', () => {
    expect(hasPermission([], 'dashboard')).toBe(false)
  })

  it('empty req string matches if included', () => {
    expect(hasPermission([''], '')).toBe(true)
  })

  it('empty req string with wildcard grants access', () => {
    expect(hasPermission(['*'], '')).toBe(true)
  })
})
