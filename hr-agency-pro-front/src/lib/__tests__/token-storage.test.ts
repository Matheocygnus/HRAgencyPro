import { describe, it, expect, beforeEach } from 'vitest'
import { tokenStorage } from '../token-storage'

describe('tokenStorage', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('getAccess returns null initially', () => {
    expect(tokenStorage.getAccess()).toBeNull()
  })

  it('getRefresh returns null initially', () => {
    expect(tokenStorage.getRefresh()).toBeNull()
  })

  it('set stores both access and refresh tokens', () => {
    tokenStorage.set('access123', 'refresh456')
    expect(tokenStorage.getAccess()).toBe('access123')
    expect(tokenStorage.getRefresh()).toBe('refresh456')
  })

  it('clear removes both tokens', () => {
    tokenStorage.set('access123', 'refresh456')
    tokenStorage.clear()
    expect(tokenStorage.getAccess()).toBeNull()
    expect(tokenStorage.getRefresh()).toBeNull()
  })
})
