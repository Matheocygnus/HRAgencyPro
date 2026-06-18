import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import MockAdapter from 'axios-mock-adapter'
import { api } from '../api'
import { tokenStorage } from '../token-storage'

// Mock window.location.assign
const mockAssign = vi.fn()
Object.defineProperty(window, 'location', {
  value: { assign: mockAssign },
  writable: true,
})

describe('api', () => {
  let mock: MockAdapter

  beforeEach(() => {
    mock = new MockAdapter(api)
    localStorage.clear()
    mockAssign.mockClear()
  })

  afterEach(() => {
    mock.restore()
  })

  it('attaches Authorization header when access token is set', async () => {
    tokenStorage.set('my-access-token', 'my-refresh-token')
    mock.onGet('/test').reply((config) => {
      expect(config.headers?.Authorization).toBe('Bearer my-access-token')
      return [200, { ok: true }]
    })
    await api.get('/test')
  })

  it('does not attach Authorization header when no access token', async () => {
    mock.onGet('/test').reply((config) => {
      expect(config.headers?.Authorization).toBeUndefined()
      return [200, { ok: true }]
    })
    await api.get('/test')
  })

  it('on 401, calls refresh endpoint and retries with new token', async () => {
    tokenStorage.set('expired-token', 'valid-refresh')

    // First request returns 401, second (retry) returns 200
    mock.onGet('/protected').replyOnce(401, {})
    mock.onGet('/protected').reply(200, { data: 'secret' })
    mock.onPost('/auth/refresh').reply(200, {
      access_token: 'new-access-token',
      refresh_token: 'new-refresh-token',
    })

    const response = await api.get('/protected')
    expect(response.data).toEqual({ data: 'secret' })
    expect(tokenStorage.getAccess()).toBe('new-access-token')
  })

  it('concurrent 401s send only ONE refresh request', async () => {
    tokenStorage.set('expired-token', 'valid-refresh')
    let refreshCallCount = 0

    // Both initial calls return 401
    mock.onGet('/a').replyOnce(401, {})
    mock.onGet('/a').reply(200, { resource: 'a' })
    mock.onGet('/b').replyOnce(401, {})
    mock.onGet('/b').reply(200, { resource: 'b' })

    mock.onPost('/auth/refresh').reply(() => {
      refreshCallCount++
      return [200, {
        access_token: 'new-access-token',
        refresh_token: 'new-refresh-token',
      }]
    })

    await Promise.all([api.get('/a'), api.get('/b')])
    expect(refreshCallCount).toBe(1)
  })

  it('refresh failure clears tokens and redirects to /login', async () => {
    tokenStorage.set('expired-token', 'bad-refresh')
    mock.onGet('/protected').reply(401, {})
    mock.onPost('/auth/refresh').reply(401, {})

    await expect(api.get('/protected')).rejects.toThrow()
    expect(tokenStorage.getAccess()).toBeNull()
    expect(mockAssign).toHaveBeenCalledWith('/login')
  })
})
