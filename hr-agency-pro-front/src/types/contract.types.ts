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
  company?: { id: number; name: string }
  hero?: {
    id: number
    prospectId: number
    prospect?: {
      id: number
      firstName: string
      lastName: string
    }
  }
}
