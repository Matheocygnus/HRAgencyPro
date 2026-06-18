import { api } from '../lib/api'
import type { Company } from '../types/company.types'

export const companiesApi = {
  list: (params?: { clientId?: number }) =>
    api.get<Company[]>('/companies', { params }).then(r => r.data),
  get: (id: number) => api.get<Company>(`/companies/${id}`).then(r => r.data),
  create: (data: Partial<Company>) => api.post<Company>('/companies', data).then(r => r.data),
  update: (id: number, data: Partial<Company>) =>
    api.patch<Company>(`/companies/${id}`, data).then(r => r.data),
  remove: (id: number) => api.delete(`/companies/${id}`).then(r => r.data),
}
