export interface Invoice {
  id: number
  invoiceNumber: string
  contractId: number
  heroId: number
  clientId: number
  companyId: number
  amount: number
  status: 'pending' | 'paid' | 'overdue' | 'cancelled'
  dueDate: string
  paidDate?: string
  createdAt: string
}
