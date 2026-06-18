import { createFileRoute, redirect } from '@tanstack/react-router'
import { tokenStorage } from '../lib/token-storage'
import { queryClient } from '../lib/query-client'
import { getRoleLanding } from '../lib/role-landing'
import type { User } from '../features/auth/auth-context'
import { LoginForm } from '../features/auth/LoginForm'

export const Route = createFileRoute('/login')({
  beforeLoad: async () => {
    if (tokenStorage.getAccess()) {
      // Already authenticated — redirect to role landing
      const user = queryClient.getQueryData<User | null>(['auth', 'me'])
      const permissions = user?.permissions ?? []
      throw redirect({ to: getRoleLanding(permissions) })
    }
  },
  component: LoginPage,
})

function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <LoginForm />
    </div>
  )
}
