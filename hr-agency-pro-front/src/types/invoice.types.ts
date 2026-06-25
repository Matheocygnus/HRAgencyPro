export interface Invoice {
  id: number
  invoiceNumber: string
  contractId: number
  heroId: number
  hero?: {
    id: number
    prospect?: {
      firstName?: string
      lastName?: string
    }
  }
  clientId: number
  companyId: number
  amount: number
  status: 'pending' | 'paid' | 'overdue' | 'cancelled'
  dueDate: string
  paidDate?: string
  createdAt: string
  company?: { id: number; name: string }
}

export function heroName(invoice: Invoice): string {
  const p = invoice.hero?.prospect
  if (p) {
    const name = `${p.firstName ?? ''} ${p.lastName ?? ''}`.trim()
    if (name) return name
  }
  return ''
}
