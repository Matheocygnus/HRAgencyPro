export interface Contract {
  id: number
  heroId: number
  clientId: number
  companyId: number
  title: string
  startDate: string
  endDate?: string
  compensation: number
  companyPayment?: number
  profit?: number
  status: 'draft' | 'signed' | 'active' | 'completed' | 'terminated'
  lengthMonths?: number
  createdAt?: string
}
