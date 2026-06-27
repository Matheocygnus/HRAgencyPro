import { useRef, useState, useEffect, type ReactNode } from 'react'

interface Props {
  children: ReactNode
  className?: string
}

export function TabScrollShadow({ children, className }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [showStart, setShowStart] = useState(false)
  const [showEnd, setShowEnd] = useState(false)

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return

    const check = () => {
      setShowStart(el.scrollLeft > 2)
      setShowEnd(el.scrollLeft + el.clientWidth < el.scrollWidth - 2)
    }

    check()
    el.addEventListener('scroll', check, { passive: true })
    const ro = new ResizeObserver(check)
    ro.observe(el)

    return () => {
      el.removeEventListener('scroll', check)
      ro.disconnect()
    }
  }, [])

  const maskImage = showStart && showEnd
    ? 'linear-gradient(to right, transparent 0%, black 3rem, black calc(100% - 3rem), transparent 100%)'
    : showEnd
      ? 'linear-gradient(to right, black 0%, black calc(100% - 3rem), transparent 100%)'
      : showStart
        ? 'linear-gradient(to right, transparent 0%, black 3rem, black 100%)'
        : undefined

  return (
    <div className={`w-full ${className ?? ''}`}>
      <div
        ref={scrollRef}
        className="overflow-x-auto md:overflow-x-visible"
        style={maskImage ? { maskImage, WebkitMaskImage: maskImage } : undefined}
      >
        {children}
      </div>
    </div>
  )
}
