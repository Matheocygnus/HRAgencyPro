import { api } from '../lib/api'
import type { UserRecord } from '../types/user.types'

export const usersApi = {
  list: () => api.get<UserRecord[]>('/users').then(r => r.data),
  get: (id: number) => api.get<UserRecord>(`/users/${id}`).then(r => r.data),
  create: (data: Partial<UserRecord>) => api.post<UserRecord>('/users', data).then(r => r.data),
  update: (id: number, data: Partial<UserRecord>) =>
    api.patch<UserRecord>(`/users/${id}`, data).then(r => r.data),
  remove: (id: number) => api.delete(`/users/${id}`).then(r => r.data),
}
