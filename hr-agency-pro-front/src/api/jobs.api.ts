import { api } from '../lib/api'
import type { JobOpening, JobApplication, JobRequest } from '../types/job.types'

export const jobsApi = {
  openings: {
    list: () => api.get<JobOpening[]>('/job-openings').then(r => r.data),
    get: (id: number) => api.get<JobOpening>(`/job-openings/${id}`).then(r => r.data),
    create: (data: Partial<JobOpening>) =>
      api.post<JobOpening>('/job-openings', data).then(r => r.data),
    update: (id: number, data: Partial<JobOpening>) =>
      api.patch<JobOpening>(`/job-openings/${id}`, data).then(r => r.data),
    remove: (id: number) => api.delete(`/job-openings/${id}`).then(r => r.data),
  },
  applications: {
    list: (params?: { jobOpeningId?: number }) =>
      api.get<JobApplication[]>('/job-applications', { params }).then(r => r.data),
    get: (id: number) => api.get<JobApplication>(`/job-applications/${id}`).then(r => r.data),
    create: (data: Partial<JobApplication> | FormData) =>
      api.post<JobApplication>('/job-applications', data).then(r => r.data),
    update: (id: number, data: Partial<JobApplication>) =>
      api.patch<JobApplication>(`/job-applications/${id}`, data).then(r => r.data),
    remove: (id: number) => api.delete(`/job-applications/${id}`).then(r => r.data),
  },
  enhance: {
    fromRequest: (jobRequestId: number) =>
      api.post<{ enhancedText: string; debug?: string }>('/job-openings/enhance-from-request', { jobRequestId }).then(r => r.data),
    geminiStatus: () =>
      api.get<{ configured: boolean; keyPrefix: string; testResult?: string; error?: string }>('/job-openings/gemini-status').then(r => r.data),
  },
  requests: {
    list: (params?: { clientId?: number }) =>
      api.get<JobRequest[]>('/job-requests', { params }).then(r => r.data),
    get: (id: number) => api.get<JobRequest>(`/job-requests/${id}`).then(r => r.data),
    create: (data: Partial<JobRequest>) =>
      api.post<JobRequest>('/job-requests', data).then(r => r.data),
    update: (id: number, data: Partial<JobRequest>) =>
      api.patch<JobRequest>(`/job-requests/${id}`, data).then(r => r.data),
    remove: (id: number) => api.delete(`/job-requests/${id}`).then(r => r.data),
  },
}
