export interface Hero {
  id: number
  prospectId?: number
  firstName: string
  lastName: string
  email: string
  phone?: string
  skills?: string[]
  clientId?: number
  companyId?: number
  startDate?: string
  createdAt: string
}
