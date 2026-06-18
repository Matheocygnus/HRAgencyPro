import { api } from '../lib/api'
import type { Client } from '../types/client.types'

export const clientsApi = {
  list: () => api.get<Client[]>('/clients').then(r => r.data),
  get: (id: number) => api.get<Client>(`/clients/${id}`).then(r => r.data),
  create: (data: Partial<Client>) => api.post<Client>('/clients', data).then(r => r.data),
  update: (id: number, data: Partial<Client>) =>
    api.patch<Client>(`/clients/${id}`, data).then(r => r.data),
  remove: (id: number) => api.delete(`/clients/${id}`).then(r => r.data),
}
