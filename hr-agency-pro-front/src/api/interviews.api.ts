import { api } from '../lib/api'
import type { Interview } from '../types/interview.types'

export const interviewsApi = {
  list: (params?: { prospectId?: number }) =>
    api.get<Interview[]>('/interviews', { params }).then(r => r.data),
  get: (id: number) => api.get<Interview>(`/interviews/${id}`).then(r => r.data),
  create: (data: Partial<Interview>) => api.post<Interview>('/interviews', data).then(r => r.data),
  update: (id: number, data: Partial<Interview>) =>
    api.patch<Interview>(`/interviews/${id}`, data).then(r => r.data),
  remove: (id: number) => api.delete(`/interviews/${id}`).then(r => r.data),
}
