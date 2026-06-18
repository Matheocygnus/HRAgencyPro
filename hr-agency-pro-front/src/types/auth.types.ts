export interface User {
  id: string
  username?: string
  email: string
  firstName?: string
  lastName?: string
  permissions: string[]
  clientId?: number
  heroId?: number
  prospectId?: number
}
