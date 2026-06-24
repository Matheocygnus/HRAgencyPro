import { api } from '../lib/api'
import type { Invoice } from '../types/invoice.types'

export const invoicesApi = {
  list: (params?: { status?: string }) =>
    api.get<Invoice[]>('/invoices', { params }).then(r => r.data),
  get: (id: number) => api.get<Invoice>(`/invoices/${id}`).then(r => r.data),
  nextNumber: () => api.get<{ invoiceNumber: string }>('/invoices/next-number').then(r => r.data),
  create: (data: Partial<Invoice>) => api.post<Invoice>('/invoices', data).then(r => r.data),
  update: (id: number, data: Partial<Invoice>) =>
    api.patch<Invoice>(`/invoices/${id}`, data).then(r => r.data),
  remove: (id: number) => api.delete(`/invoices/${id}`).then(r => r.data),
}
