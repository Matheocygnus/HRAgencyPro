import { createRootRoute, Outlet } from '@tanstack/react-router'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import { queryClient } from '../lib/query-client'
import { AuthProvider } from '../features/auth/auth-context'
import { ToastProvider } from '../lib/toast'

export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <AuthProvider>
          <Outlet />
          {import.meta.env.DEV && (
            <>
              <ReactQueryDevtools buttonPosition="bottom-right" />
              <TanStackRouterDevtools position="bottom-left" />
            </>
          )}
        </AuthProvider>
      </ToastProvider>
    </QueryClientProvider>
  )
}
