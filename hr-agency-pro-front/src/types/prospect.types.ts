export interface Prospect {
  id: number
  firstName: string
  lastName: string
  email: string
  phone?: string
  position?: string
  skills?: string
  status:
    | 'sourcing'
    | 'contacted'
    | 'interview'
    | 'client_review'
    | 'budget'
    | 'contract'
    | 'hired'
    | 'rejected'
  clientId?: number
  companyId?: number
  targetCompany?: string
  notes?: string
  isInterviewed?: boolean
  isClientApproved?: boolean
  isBudgetAgreed?: boolean
  resume?: string
  notesHistory?: { note: string; createdAt: string }[]
  rejectionReason?: string | null
  createdAt: string
}
