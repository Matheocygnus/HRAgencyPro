import { useState, useEffect, useRef } from 'react'
import { Button } from '@heroui/react'
import { ChevronDown } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'

type SubItem = { label: string; href: string }
type SimpleNavItem = { label: string; href: string; children?: never }
type DropdownNavItem = { label: string; href?: never; children: SubItem[] }
type NavItem = SimpleNavItem | DropdownNavItem

const navItems: NavItem[] = [
  { label: 'Home', href: '/' },
  {
    label: 'Services',
    children: [
      { label: 'Recruitment Process Outsourcing', href: '/services/rpo' },
      { label: 'Direct Hire & Placement', href: '/services/direct-hire' },
      { label: 'Resume Sourcing', href: '/services/resume-sourcing' },
    ],
  },
  { label: 'How It Works', href: '/how-it-works' },
  { label: 'Industries', href: '/industries' },
  {
    label: 'Tools',
    children: [
      { label: 'Salary Guide', href: '/tools/salary-guide' },
      { label: 'Team Building Calculator', href: '/tools/team-building-calculator' },
      { label: 'Scale Smart & Save Calculator', href: '/tools/savings-calculator' },
    ],
  },
  { label: 'Success Stories', href: '/success-stories' },
]

function NavDropdown({ item }: { item: DropdownNavItem }) {
  const [isOpen, setIsOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isOpen) return
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setIsOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen])

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setIsOpen((v) => !v)}
        aria-haspopup="true"
        aria-expanded={isOpen}
        className="flex items-center gap-1 rounded-md px-3 py-2 text-base font-medium text-slate-700 transition-colors hover:bg-slate-100 hover:text-[#0f2447] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
      >
        {item.label}
        <ChevronDown
          className={`size-3.5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.14 }}
            className="absolute left-0 top-full z-50 mt-1 min-w-[240px] rounded-xl border border-slate-200 bg-white p-1 shadow-xl shadow-slate-200/60"
          >
            {item.children.map((child) => (
              <a
                key={child.href}
                href={child.href}
                onClick={() => setIsOpen(false)}
                className="block rounded-lg px-3 py-2 text-sm text-slate-700 transition-colors hover:bg-slate-100 hover:text-[#0f2447]"
              >
                {child.label}
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function MobileExpandable({
  item,
  onClose,
}: {
  item: DropdownNavItem
  onClose: () => void
}) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div>
      <button
        onClick={() => setExpanded((v) => !v)}
        className="flex w-full items-center justify-between rounded-md px-2 py-3 text-lg font-medium text-slate-700 transition-colors hover:text-[#0f2447]"
      >
        <span>{item.label}</span>
        <ChevronDown
          className={`size-4 text-slate-400 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
        />
      </button>
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="overflow-hidden"
          >
            <div className="ml-4 flex flex-col pb-2">
              {item.children.map((child) => (
                <a
                  key={child.href}
                  href={child.href}
                  onClick={onClose}
                  className="rounded-md py-2 pl-2 text-base text-slate-500 transition-colors hover:text-[#0f2447]"
                >
                  {child.label}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export function PublicNavbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const closeMenu = () => setMobileOpen(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/60 bg-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <a href="/" className="flex shrink-0 items-center gap-2.5">
          <div className="flex size-8 items-center justify-center rounded-lg bg-[#0f2447] text-white">
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2" />
              <line x1="12" y1="22" x2="12" y2="15.5" />
              <polyline points="22 8.5 12 15.5 2 8.5" />
            </svg>
          </div>
          <span className="text-sm font-extrabold uppercase tracking-[0.15em] text-[#0f2447]">
            Remote<span className="text-sky-500"> Hero</span>
          </span>
        </a>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) =>
            item.children ? (
              <NavDropdown key={item.label} item={item} />
            ) : (
              <a
                key={item.label}
                href={item.href}
                className="rounded-md px-3 py-2 text-base font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-[#0f2447]"
              >
                {item.label}
              </a>
            ),
          )}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden items-center lg:flex">
          <a href="https://form.typeform.com/to/aKI8I8lO" target="_blank" rel="noopener noreferrer">
            <Button
              variant="solid"
              size="md"
              className="text-base bg-[#0f2447] px-6 font-semibold text-white shadow-md shadow-[#0f2447]/20 hover:opacity-90"
            >
              Hire Talent
            </Button>
          </a>
        </div>

        {/* Mobile: CTA + hamburger */}
        <div className="flex items-center gap-3 lg:hidden">
          <a href="https://form.typeform.com/to/aKI8I8lO" target="_blank" rel="noopener noreferrer">
            <Button size="sm" className="bg-[#0f2447] font-semibold text-white">
              Hire Talent
            </Button>
          </a>
          <button
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
            className="flex size-9 items-center justify-center rounded-md text-slate-600 transition-colors hover:bg-slate-100"
            onClick={() => setMobileOpen((v) => !v)}
          >
            <AnimatePresence mode="wait" initial={false}>
              {mobileOpen ? (
                <motion.svg
                  key="close"
                  initial={{ rotate: -45, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 45, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                >
                  <path d="M18 6 6 18M6 6l12 12" />
                </motion.svg>
              ) : (
                <motion.svg
                  key="menu"
                  initial={{ rotate: 45, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -45, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                >
                  <path d="M4 6h16M4 12h16M4 18h16" />
                </motion.svg>
              )}
            </AnimatePresence>
          </button>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="overflow-hidden border-t border-slate-100 bg-white/95 backdrop-blur-xl lg:hidden"
          >
            <div className="flex flex-col px-4 pb-5 pt-3">
              {navItems.map((item) =>
                item.children ? (
                  <MobileExpandable key={item.label} item={item} onClose={closeMenu} />
                ) : (
                  <a
                    key={item.label}
                    href={item.href}
                    onClick={closeMenu}
                    className="rounded-md px-2 py-3 text-lg font-medium text-slate-700 transition-colors hover:text-[#0f2447]"
                  >
                    {item.label}
                  </a>
                ),
              )}
              <div className="mt-3 border-t border-slate-100 pt-4">
                <a
                  href="https://form.typeform.com/to/aKI8I8lO"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={closeMenu}
                  className="block rounded-md px-2 py-3 text-center text-lg font-semibold text-[#0f2447]"
                >
                  Hire Talent →
                </a>
              </div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  )
}
