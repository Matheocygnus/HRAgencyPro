import {
  createContext, useCallback, useContext, useEffect, useRef, useState,
  type ComponentType, type ReactNode,
} from 'react'
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react'
import { toastEmitter, type ToastPayload, type ToastType } from './toast-emitter'

interface Toast extends ToastPayload {
  id: string
}

interface ToastContextValue {
  addToast: (message: string, type?: ToastType) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

const ICONS: Record<ToastType, ComponentType> = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
}

const COLORS: Record<ToastType, string> = {
  success: 'border-success/30 bg-success/10 text-success',
  error: 'border-danger/30 bg-danger/10 text-danger',
  warning: 'border-warning/30 bg-warning/10 text-warning',
  info: 'border-primary/30 bg-primary/10 text-primary',
}

let uid = 0

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])
  const timers = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map())

  const dismiss = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
    const timer = timers.current.get(id)
    if (timer) { clearTimeout(timer); timers.current.delete(id) }
  }, [])

  const addToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = String(++uid)
    setToasts(prev => [...prev, { id, message, type }])
    const timer = setTimeout(() => dismiss(id), 4000)
    timers.current.set(id, timer)
  }, [dismiss])

  // Subscribe to emitter so axios interceptors can trigger toasts
  useEffect(() => {
    return toastEmitter.subscribe(({ message, type }) => addToast(message, type))
  }, [addToast])

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div
        aria-live="polite"
        aria-atomic="false"
        className="pointer-events-none fixed bottom-4 right-4 z-[9999] flex flex-col gap-2"
      >
        {toasts.map(toast => {
          const Icon = ICONS[toast.type]
          return (
            <div
              key={toast.id}
              role="alert"
              className={`pointer-events-auto flex max-w-sm items-start gap-3 rounded-xl border px-4 py-3 shadow-lg backdrop-blur-sm ${COLORS[toast.type]}`}
            >
              <Icon className="mt-0.5 size-4 shrink-0" />
              <p className="flex-1 text-sm font-medium">{toast.message}</p>
              <button
                type="button"
                onClick={() => dismiss(toast.id)}
                className="ml-1 shrink-0 opacity-60 hover:opacity-100"
                aria-label="Dismiss"
              >
                <X className="size-3.5" />
              </button>
            </div>
          )
        })}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}
