export interface Hero {
  id: number
  firstName: string
  lastName: string
  email: string
  phone?: string
  skills?: string[]
  clientId?: number
  companyId?: number
  createdAt: string
}
