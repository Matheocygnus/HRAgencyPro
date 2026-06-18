import axios, { type InternalAxiosRequestConfig, type AxiosResponse } from 'axios'
import { tokenStorage } from './token-storage'
import { toastEmitter } from './toast-emitter'

export const api = axios.create({
  baseURL: (import.meta.env.VITE_API_URL ?? 'http://localhost:3000') + '/api',
})

// Single-flight refresh state
let refreshPromise: Promise<string> | null = null

// Request interceptor: attach Bearer token if available
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = tokenStorage.getAccess()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

async function refreshAccessToken(): Promise<string> {
  const refreshToken = tokenStorage.getRefresh()
  // Use api instance so tests can mock it; _skipRefreshInterceptor prevents loops
  const response = await api.post<{ access_token: string; refresh_token: string }>(
    '/auth/refresh',
    { refresh_token: refreshToken },
    { headers: { _skipRefreshInterceptor: 'true' } },
  )
  tokenStorage.set(response.data.access_token, response.data.refresh_token)
  return response.data.access_token
}

// Response interceptor: on 401, queue behind refreshPromise, retry with new token
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean }

    // Skip if this is already a retry or a refresh call itself
    const isRefreshCall = originalRequest.headers?._skipRefreshInterceptor === 'true'
    if (error.response?.status === 401 && !originalRequest._retry && !isRefreshCall) {
      originalRequest._retry = true

      // No refresh token means we're unauthenticated — reject without redirecting
      // (prevents an infinite reload loop on the login page)
      if (!tokenStorage.getRefresh()) {
        return Promise.reject(error)
      }

      try {
        if (!refreshPromise) {
          refreshPromise = refreshAccessToken().finally(() => {
            refreshPromise = null
          })
        }
        const newAccessToken = await refreshPromise
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
        return api(originalRequest)
      } catch {
        tokenStorage.clear()
        window.location.assign('/login')
        return Promise.reject(error)
      }
    }

    // Surface non-auth errors as toasts so the user always sees feedback
    const status = error.response?.status
    const isAuthError = status === 401 || isRefreshCall
    if (!isAuthError && status !== undefined) {
      const message: string =
        error.response?.data?.message ??
        error.response?.data?.error ??
        'Something went wrong. Please try again.'
      toastEmitter.emit({ message: Array.isArray(message) ? message[0] : message, type: 'error' })
    }

    return Promise.reject(error)
  },
)
