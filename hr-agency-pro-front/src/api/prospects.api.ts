import { api } from '../lib/api'
import type { Prospect } from '../types/prospect.types'

export interface PromoteResult {
  prospect: Prospect
  hero: { id: number; prospectId: number; clientId: number; companyId: number; startDate: string; contractId?: number }
  contract: { id: number; title: string; compensation: number; companyPayment: number; profit: number; status: string }
  invoice: { id: number; invoiceNumber: string; amount: number; status: string; dueDate: string }
}

export const prospectsApi = {
  list: () => api.get<Prospect[]>('/prospects').then(r => r.data),
  get: (id: number) => api.get<Prospect>(`/prospects/${id}`).then(r => r.data),
  create: (data: Partial<Prospect>) => api.post<Prospect>('/prospects', data).then(r => r.data),
  update: (id: number, data: Partial<Prospect>) =>
    api.patch<Prospect>(`/prospects/${id}`, data).then(r => r.data),
  remove: (id: number) => api.delete(`/prospects/${id}`).then(r => r.data),
  importCsv: (file: File): Promise<{ imported: number; skipped: number; errors: string[] }> => {
    const form = new FormData()
    form.append('file', file)
    return api.post('/prospects/import', form).then(r => r.data)
  },
  sendResume: (id: number) =>
    api.post<{ sent: boolean }>(`/prospects/${id}/send-resume`).then(r => r.data),
  reject: (id: number, reason: string) =>
    api.post<Prospect>(`/prospects/${id}/reject`, { reason }).then(r => r.data),
  promote: (
    id: number,
    data: { startDate?: string; endDate?: string; compensation?: number; companyPayment?: number },
  ) => api.post<PromoteResult>(`/prospects/${id}/promote`, data).then(r => r.data),
}
