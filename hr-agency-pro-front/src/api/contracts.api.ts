import { api } from '../lib/api'
import type { Contract } from '../types/contract.types'

export const contractsApi = {
  list: (params?: { heroId?: number; clientId?: number; status?: string }) =>
    api.get<Contract[]>('/contracts', { params }).then(r => r.data),
  get: (id: number) => api.get<Contract>(`/contracts/${id}`).then(r => r.data),
  create: (data: Partial<Contract>) => api.post<Contract>('/contracts', data).then(r => r.data),
  update: (id: number, data: Partial<Contract>) =>
    api.patch<Contract>(`/contracts/${id}`, data).then(r => r.data),
  remove: (id: number) => api.delete(`/contracts/${id}`).then(r => r.data),
}
