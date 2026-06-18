import { api } from '../lib/api'
import type { Role } from '../types/role.types'

export const rolesApi = {
  list: () => api.get<Role[]>('/roles').then(r => r.data),
  get: (id: number) => api.get<Role>(`/roles/${id}`).then(r => r.data),
  create: (data: Partial<Role>) => api.post<Role>('/roles', data).then(r => r.data),
  update: (id: number, data: Partial<Role>) =>
    api.patch<Role>(`/roles/${id}`, data).then(r => r.data),
  remove: (id: number) => api.delete(`/roles/${id}`).then(r => r.data),
}
