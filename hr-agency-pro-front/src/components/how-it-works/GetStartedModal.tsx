import { useEffect } from 'react'
import { X } from 'lucide-react'

interface GetStartedModalProps {
  isOpen: boolean
  onClose: () => void
}

export function GetStartedModal({ isOpen, onClose }: GetStartedModalProps) {
  useEffect(() => {
    if (!isOpen) return
    const scrollY = window.scrollY
    document.body.style.position = 'fixed'
    document.body.style.top = `-${scrollY}px`
    document.body.style.width = '100%'
    return () => {
      document.body.style.position = ''
      document.body.style.top = ''
      document.body.style.width = ''
      window.scrollTo(0, scrollY)
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="relative z-10 w-full max-w-[700px] overflow-hidden rounded-lg shadow-2xl"
        style={{ height: '650px' }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-3 top-3 z-10 rounded-full bg-white/80 p-1 text-slate-500 backdrop-blur-sm transition-colors hover:text-slate-900"
          aria-label="Close"
        >
          <X size={18} />
        </button>

        <iframe
          src="https://form.typeform.com/to/aKI8I8lO"
          style={{ width: '100%', height: '100%', border: 'none' }}
          title="Contact Form"
        />
      </div>
    </div>
  )
}
