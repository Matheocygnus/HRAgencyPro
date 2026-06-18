import { useAuthContext } from './auth-context'
import { hasPermission } from '../../lib/permissions'

export function usePermissions() {
  const { user } = useAuthContext()
  const permissions = user?.permissions ?? []

  return {
    can: (perm: string) => hasPermission(permissions, perm),
  }
}
