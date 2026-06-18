import { createContext, useContext, type ReactNode } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { api } from '../../lib/api'
import { tokenStorage } from '../../lib/token-storage'
import type { User } from '../../types/auth.types'

export type { User }

interface LoginCredentials {
  username: string
  password: string
}

interface LoginResponse {
  access_token: string
  refresh_token: string
}

interface AuthContextValue {
  user: User | null | undefined
  isAuthenticated: boolean
  isLoading: boolean
  login: (credentials: LoginCredentials) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const reactQueryClient = useQueryClient()
  const navigate = useNavigate()

  const { data: user, isLoading } = useQuery<User | null>({
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
    staleTime: 1000 * 60 * 5,
  })

  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      const { data } = await api.post<LoginResponse>('/auth/login', credentials)
      tokenStorage.set(data.access_token, data.refresh_token)
    },
    onSuccess: () => {
      reactQueryClient.invalidateQueries({ queryKey: ['auth', 'me'] })
    },
  })

  const logoutMutation = useMutation({
    mutationFn: async () => {
      const refreshToken = tokenStorage.getRefresh()
      try {
        await api.post('/auth/logout', { refreshToken })
      } finally {
        tokenStorage.clear()
      }
    },
    onSettled: () => {
      reactQueryClient.clear()
      navigate({ to: '/login' })
    },
  })

  const login = async (credentials: LoginCredentials) => {
    await loginMutation.mutateAsync(credentials)
  }

  const logout = async () => {
    await logoutMutation.mutateAsync()
  }

  return (
    <AuthContext.Provider
      value={{
        user: user ?? null,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuthContext(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuthContext must be used within AuthProvider')
  }
  return ctx
}
