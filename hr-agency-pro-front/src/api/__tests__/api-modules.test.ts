import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import MockAdapter from 'axios-mock-adapter'
import { api } from '../../lib/api'
import { prospectsApi } from '../prospects.api'
import { heroesApi } from '../heroes.api'
import { clientsApi } from '../clients.api'
import { companiesApi } from '../companies.api'

describe('API modules smoke tests', () => {
  let mock: MockAdapter

  beforeEach(() => {
    mock = new MockAdapter(api)
  })

  afterEach(() => {
    mock.restore()
  })

  it('prospectsApi.list() calls GET /prospects', async () => {
    mock.onGet('/prospects').reply(200, [])
    const result = await prospectsApi.list()
    expect(result).toEqual([])
    expect(mock.history.get[0].url).toBe('/prospects')
  })

  it('heroesApi.list({ clientId: 1 }) calls GET /heroes?clientId=1', async () => {
    mock.onGet('/heroes').reply(200, [])
    await heroesApi.list({ clientId: 1 })
    expect(mock.history.get[0].url).toBe('/heroes')
    expect(mock.history.get[0].params).toEqual({ clientId: 1 })
  })

  it('clientsApi.get(5) calls GET /clients/5', async () => {
    mock.onGet('/clients/5').reply(200, { id: 5, name: 'Acme' })
    const result = await clientsApi.get(5)
    expect(result.id).toBe(5)
  })

  it('companiesApi.create({ name: "ACME" }) calls POST /companies', async () => {
    mock.onPost('/companies').reply(201, { id: 1, name: 'ACME' })
    const result = await companiesApi.create({ name: 'ACME' })
    expect(result.name).toBe('ACME')
    expect(mock.history.post[0].url).toBe('/companies')
  })
})
