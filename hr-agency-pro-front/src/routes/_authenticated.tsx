import { createFileRoute, redirect, Outlet } from '@tanstack/react-router'
import { queryClient } from '../lib/query-client'
import { tokenStorage } from '../lib/token-storage'
import { api } from '../lib/api'
import type { User } from '../features/auth/auth-context'

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: async () => {
    if (!tokenStorage.getAccess()) {
      throw redirect({ to: '/login' })
    }
    const user = await queryClient.ensureQueryData<User | null>({
      queryKey: ['auth', 'me'],
      queryFn: async () => {
        try {
          const { data } = await api.get<any>('/auth/me')
          return {
            ...data,
            permissions: data.role?.permissions ?? data.permissions ?? [],
          } as User
        } catch {
          return null
        }
      },
    })
    return { permissions: user?.permissions ?? [] }
  },
  loader: async () => {
    const user = queryClient.getQueryData<User | null>(['auth', 'me'])
    return { user }
  },
  component: AuthenticatedLayout,
})

function AuthenticatedLayout() {
  return <Outlet />
}
