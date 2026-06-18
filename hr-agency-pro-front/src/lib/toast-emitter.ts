export type ToastType = 'success' | 'error' | 'warning' | 'info'

export interface ToastPayload {
  message: string
  type: ToastType
}

type Listener = (payload: ToastPayload) => void

const listeners = new Set<Listener>()

export const toastEmitter = {
  emit: (payload: ToastPayload) => listeners.forEach(fn => fn(payload)),
  subscribe: (fn: Listener) => {
    listeners.add(fn)
    return () => listeners.delete(fn)
  },
}
