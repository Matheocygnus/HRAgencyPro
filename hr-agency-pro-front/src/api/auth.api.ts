import { api } from '../lib/api'
import type { User } from '../types/auth.types'

export const authApi = {
  login: (data: { email: string; password: string }) =>
    api.post<{ access_token: string; refresh_token: string }>('/auth/login', data).then(r => r.data),
  me: () => api.get<User>('/auth/me').then(r => r.data),
  logout: () => api.post('/auth/logout').then(r => r.data),
  refresh: (refresh_token: string) =>
    api
      .post<{ access_token: string; refresh_token: string }>('/auth/refresh', { refresh_token })
      .then(r => r.data),
}
