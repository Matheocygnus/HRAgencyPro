export interface UserRecord {
  id: number
  email: string
  firstName: string
  lastName: string
  roleId: number
  role?: { id: number; name: string; permissions: string[] }
}
