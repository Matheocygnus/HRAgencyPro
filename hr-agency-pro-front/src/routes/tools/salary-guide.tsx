import { useState, useEffect } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { Search, GraduationCap } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'
import { Button } from '@heroui/react'
import { PublicNavbar } from '../../components/landing/PublicNavbar'
import { Footer } from '../../components/landing/Footer'
import { GetStartedModal } from '../../components/how-it-works/GetStartedModal'

type Role = { role: string; category: string; usSalary: number; remoteHeroSalary: number }

const roles: Role[] = [
  { role: 'Virtual Assistant', category: 'Administrative', usSalary: 48000, remoteHeroSalary: 21600 },
  { role: 'Administrative Assistant', category: 'Administrative', usSalary: 52000, remoteHeroSalary: 21600 },
  { role: 'Executive Assistant', category: 'Administrative', usSalary: 72000, remoteHeroSalary: 27000 },
  { role: 'Data Entry Specialist', category: 'Administrative', usSalary: 45000, remoteHeroSalary: 21600 },
  { role: 'Office Manager', category: 'Administrative', usSalary: 65000, remoteHeroSalary: 28800 },
  { role: 'Personal Assistant', category: 'Administrative', usSalary: 55000, remoteHeroSalary: 25200 },
  { role: 'Operations Assistant', category: 'Administrative', usSalary: 50000, remoteHeroSalary: 23400 },
  { role: 'Human Resources Manager', category: 'Human Resources', usSalary: 95000, remoteHeroSalary: 36000 },
  { role: 'HR Coordinator', category: 'Human Resources', usSalary: 65000, remoteHeroSalary: 26400 },
  { role: 'Bookkeeper', category: 'Finance', usSalary: 58000, remoteHeroSalary: 24000 },
  { role: 'Finance Manager', category: 'Finance', usSalary: 115000, remoteHeroSalary: 42000 },
  { role: 'Financial Analyst', category: 'Finance', usSalary: 78000, remoteHeroSalary: 30000 },
  { role: 'Staff Accountant', category: 'Finance', usSalary: 58000, remoteHeroSalary: 25200 },
  { role: 'Accounting Manager', category: 'Finance', usSalary: 88000, remoteHeroSalary: 36000 },
  { role: 'Tax Specialist', category: 'Finance', usSalary: 72000, remoteHeroSalary: 28800 },
  { role: 'Payroll Specialist', category: 'Finance', usSalary: 55000, remoteHeroSalary: 22800 },
  { role: 'Accounts Receivable Specialist', category: 'Finance', usSalary: 48000, remoteHeroSalary: 21600 },
  { role: 'Accounts Payable Specialist', category: 'Finance', usSalary: 46000, remoteHeroSalary: 21600 },
  { role: 'FP&A Analyst', category: 'Finance', usSalary: 90000, remoteHeroSalary: 38000 },
  { role: 'Accountant', category: 'Finance', usSalary: 75000, remoteHeroSalary: 32000 },
  { role: 'Digital Marketing Manager', category: 'Marketing', usSalary: 85000, remoteHeroSalary: 36000 },
  { role: 'Digital Marketing Specialist', category: 'Marketing', usSalary: 70000, remoteHeroSalary: 28800 },
  { role: 'Marketing Coordinator', category: 'Marketing', usSalary: 52000, remoteHeroSalary: 21600 },
  { role: 'Content Marketing Specialist', category: 'Marketing', usSalary: 65000, remoteHeroSalary: 26400 },
  { role: 'Content Creator', category: 'Marketing', usSalary: 55000, remoteHeroSalary: 24000 },
  { role: 'Marketing Manager', category: 'Marketing', usSalary: 95000, remoteHeroSalary: 38400 },
  { role: 'SEO Specialist', category: 'Marketing', usSalary: 72000, remoteHeroSalary: 32000 },
  { role: 'Paid Media Specialist', category: 'Marketing', usSalary: 75000, remoteHeroSalary: 33500 },
  { role: 'Email Marketing Specialist', category: 'Marketing', usSalary: 68000, remoteHeroSalary: 30500 },
  { role: 'Social Media Specialist', category: 'Marketing', usSalary: 65000, remoteHeroSalary: 29000 },
  { role: 'Software Engineer', category: 'Technology', usSalary: 120000, remoteHeroSalary: 43200 },
  { role: 'Developer', category: 'Technology', usSalary: 118000, remoteHeroSalary: 42000 },
  { role: 'Data Scientist', category: 'Technology', usSalary: 155000, remoteHeroSalary: 48000 },
  { role: 'DevOps Engineer', category: 'Technology', usSalary: 130000, remoteHeroSalary: 45600 },
  { role: 'Product Manager', category: 'Technology', usSalary: 140000, remoteHeroSalary: 48000 },
  { role: 'Back-end Developer', category: 'Technology', usSalary: 120000, remoteHeroSalary: 50000 },
  { role: 'Front-end Developer', category: 'Technology', usSalary: 115000, remoteHeroSalary: 48000 },
  { role: 'Full-stack Developer', category: 'Technology', usSalary: 130000, remoteHeroSalary: 55000 },
  { role: 'Web Developer', category: 'Technology', usSalary: 110000, remoteHeroSalary: 46000 },
  { role: 'Data Analyst', category: 'Technology', usSalary: 95000, remoteHeroSalary: 40000 },
  { role: 'UI/UX Developer', category: 'Technology', usSalary: 105000, remoteHeroSalary: 45000 },
  { role: 'QA Tester', category: 'Technology', usSalary: 85000, remoteHeroSalary: 36000 },
  { role: 'IT Support Specialist', category: 'Technology', usSalary: 75000, remoteHeroSalary: 32000 },
  { role: 'Graphic Designer', category: 'Creative', usSalary: 68000, remoteHeroSalary: 27600 },
  { role: 'UI/UX Designer', category: 'Creative', usSalary: 95000, remoteHeroSalary: 36000 },
  { role: 'Content Writer', category: 'Creative', usSalary: 58000, remoteHeroSalary: 24000 },
  { role: 'Copywriter', category: 'Creative', usSalary: 62000, remoteHeroSalary: 26400 },
  { role: 'Video Editor', category: 'Creative', usSalary: 65000, remoteHeroSalary: 28800 },
  { role: 'Web Designer', category: 'Creative', usSalary: 72000, remoteHeroSalary: 30000 },
  { role: 'Customer Success Manager', category: 'Customer Support', usSalary: 78000, remoteHeroSalary: 32400 },
  { role: 'Customer Support Representative', category: 'Customer Support', usSalary: 47500, remoteHeroSalary: 21600 },
  { role: 'Customer Support Manager', category: 'Customer Support', usSalary: 68000, remoteHeroSalary: 30000 },
  { role: 'Technical Support Specialist', category: 'Customer Support', usSalary: 62000, remoteHeroSalary: 27000 },
  { role: 'Live Chat Agent', category: 'Customer Support', usSalary: 42000, remoteHeroSalary: 21600 },
  { role: 'Help Desk Specialist', category: 'Customer Support', usSalary: 52000, remoteHeroSalary: 24000 },
  { role: 'Project Manager', category: 'Operations', usSalary: 108000, remoteHeroSalary: 39600 },
  { role: 'Operations Manager', category: 'Operations', usSalary: 95000, remoteHeroSalary: 36000 },
  { role: 'Operations Coordinator', category: 'Operations', usSalary: 62000, remoteHeroSalary: 25200 },
  { role: 'Appointment Setter', category: 'Operations', usSalary: 45000, remoteHeroSalary: 21600 },
  { role: 'Sales Development Representative', category: 'Sales', usSalary: 65000, remoteHeroSalary: 26400 },
  { role: 'Account Executive', category: 'Sales', usSalary: 95000, remoteHeroSalary: 36000 },
  { role: 'Sales Manager', category: 'Sales', usSalary: 125000, remoteHeroSalary: 45600 },
  { role: 'Inside Sales Representative', category: 'Sales', usSalary: 58000, remoteHeroSalary: 24000 },
  { role: 'Lead Generation Specialist', category: 'Sales', usSalary: 52000, remoteHeroSalary: 21600 },
  { role: 'Sales Coordinator', category: 'Sales', usSalary: 48000, remoteHeroSalary: 21600 },
]

// Count-up hook — resets whenever target changes or component remounts
function useCountUp(target: number, duration = 900) {
  const [value, setValue] = useState(0)
  useEffect(() => {
    setValue(0)
    let cancelled = false
    const start = performance.now()
    const tick = (now: number) => {
      if (cancelled) return
      const t = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - t, 3) // ease-out cubic
      setValue(Math.round(eased * target))
      if (t < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
    return () => { cancelled = true }
  }, [target, duration])
  return value
}

function fmt(n: number) {
  return '$' + new Intl.NumberFormat('de-DE').format(n)
}

const BAR_MAX = 200 // px — height of the US (full) bar

// Animated bar — key on role so it re-animates from 0 on role change
function AnimatedBar({ height, color, delay, role }: { height: number; color: string; delay: number; role: string }) {
  return (
    <motion.div
      key={role}
      initial={{ height: 0 }}
      animate={{ height }}
      transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
      className={`flex-1 rounded-t-xl ${color}`}
      style={{ minHeight: 0 }}
    />
  )
}

function SalaryChart({ r }: { r: Role }) {
  const savings = r.usSalary - r.remoteHeroSalary
  const rhH = Math.round((r.remoteHeroSalary / r.usSalary) * BAR_MAX)
  const countUS = useCountUp(r.usSalary)
  const countRH = useCountUp(r.remoteHeroSalary)
  const countSav = useCountUp(savings)

  return (
    <div className="h-full rounded-3xl bg-amber-50/70 p-8 shadow-sm ring-1 ring-amber-100 transition-all duration-300 hover:scale-[1.01] hover:shadow-lg">
      <h3 className="mb-1 text-xl font-bold text-slate-900">{r.role}</h3>
      <p className="mb-8 text-sm text-slate-500">
        How much you could save by hiring top Remote Hero professionals
      </p>

      <div className="mb-3 flex justify-between text-sm font-medium text-slate-400">
        <span>US Salary</span>
        <span>Remote Hero Salary</span>
      </div>

      {/* Bars */}
      <div
        className="relative flex items-end gap-6"
        style={{ height: `${BAR_MAX + 24}px` }}
      >
        <AnimatedBar height={BAR_MAX} color="bg-orange-500" delay={0} role={r.role} />

        {/* Savings badge — appears after bars */}
        <motion.div
          key={`badge-${r.role}`}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.75 }}
          className="absolute left-1/2 z-10 -translate-x-1/2 rounded-xl bg-yellow-200 px-3 py-1.5 text-center shadow-md"
          style={{ bottom: `${rhH + 14}px` }}
        >
          <p className="text-sm font-bold text-slate-900">{fmt(countSav)}</p>
          <p className="text-xs text-slate-600">Savings</p>
        </motion.div>

        <AnimatedBar height={rhH} color="bg-blue-600" delay={0.2} role={r.role} />
      </div>

      {/* Salary values — count up */}
      <div className="mt-4 flex justify-between text-base font-bold text-slate-700">
        <span>{fmt(countUS)}</span>
        <span>{fmt(countRH)}</span>
      </div>
    </div>
  )
}

function SalaryGuidePage() {
  const [query, setQuery] = useState('')
  const [modalOpen, setModalOpen] = useState(false)

  const filtered = query
    ? roles.filter((r) => r.role.toLowerCase().includes(query.toLowerCase()))
    : roles

  const active = filtered[0] ?? roles[0]
  const savings = active.usSalary - active.remoteHeroSalary

  // Count-up for text column — reset on role change via key (AnimatePresence unmounts)
  const countUS = useCountUp(active.usSalary)
  const countRH = useCountUp(active.remoteHeroSalary)
  const countSav = useCountUp(savings)

  return (
    <div className="flex min-h-screen flex-col">
      <PublicNavbar />
      <main className="flex-1 bg-white">

        {/* ── Hero + Search ─────────────────────────────── */}
        <section className="bg-gradient-to-br from-slate-50 to-sky-50/40 px-6 py-24 lg:py-32">
          <div className="mx-auto max-w-6xl">

            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              className="mb-6 flex items-center gap-3"
            >
              <div className="flex size-10 items-center justify-center rounded-xl bg-sky-100 text-sky-700">
                <GraduationCap size={20} />
              </div>
              <span className="rounded-full bg-sky-100 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-sky-700">
                Comparing Salaries: US vs. Remote Hero
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.08 }}
              className="mb-4 text-4xl font-extrabold tracking-tight text-slate-900 lg:text-5xl"
            >
              2025 Salary Guide: US vs Remote Hero
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="mb-8 text-lg text-slate-500"
            >
              Discover US and Remote Hero talent salaries by role.
            </motion.p>

            {/* Search */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.22 }}
              className="relative mb-4 max-w-lg"
            >
              <Search className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Virtual Assistant"
                className="w-full rounded-2xl border border-slate-200 bg-white py-3.5 pl-11 pr-4 text-base text-slate-900 shadow-sm outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
              />
            </motion.div>

            {/* Contact Us callout */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.3 }}
              className="flex max-w-lg items-start gap-4 rounded-2xl border border-sky-100 bg-sky-50 p-5 shadow-sm"
            >
              <Search className="mt-0.5 size-5 shrink-0 text-sky-500" />
              <div>
                <p className="mb-3 text-sm text-slate-600">
                  {"Don't see the role you're looking for? We can still find it."}
                </p>
                <Button
                  size="sm"
                  className="bg-[#0f2447] font-semibold text-white hover:bg-[#162f5c]"
                  onPress={() => setModalOpen(true)}
                >
                  Contact Us
                </Button>
              </div>
            </motion.div>

          </div>
        </section>

        {/* ── Role Detail ───────────────────────────────── */}
        <section className="px-6 py-24 lg:py-32">
          <div className="mx-auto max-w-6xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={active.role}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.35 }}
                className="grid grid-cols-1 gap-16 lg:grid-cols-2"
              >
                {/* Left: dynamic text */}
                <div className="flex flex-col justify-center">
                  <h2 className="mb-6 text-3xl font-bold text-slate-900">{active.role}</h2>

                  <p className="mb-4 leading-relaxed text-slate-600">
                    {`Looking to hire a ${active.role}? Remote Hero professionals offer exceptional quality at significantly lower costs compared to US-based talent.`}
                  </p>

                  <p className="mb-6 leading-relaxed text-slate-600">
                    The average {active.role} in the US earns{' '}
                    <span className="font-bold text-[#0f2447]">{fmt(countUS)}</span> annually,
                    while top Remote Hero talent with similar skills and experience costs
                    approximately{' '}
                    <span className="font-bold text-[#0f2447]">{fmt(countRH)}</span> per year.
                  </p>

                  {/* Savings highlight box */}
                  <div className="mb-6 cursor-default rounded-2xl border border-sky-100 bg-sky-50/80 p-5 shadow-sm transition-all duration-300 hover:scale-[1.01] hover:shadow-md">
                    <p className="text-base font-bold text-slate-900">
                      Potential annual savings:{' '}
                      <span className="text-xl text-sky-600">{fmt(countSav)}</span>
                    </p>
                  </div>

                  <p className="leading-relaxed text-slate-600">
                    {"Beyond cost savings, you'll benefit from team members who work in similar time zones, have strong English communication skills, and bring diverse perspectives to your organization."}
                  </p>
                </div>

                {/* Right: animated chart */}
                <SalaryChart r={active} />
              </motion.div>
            </AnimatePresence>
          </div>
        </section>

        {/* ── CTA Banner ────────────────────────────────── */}
        <section className="bg-[#0f2447] px-6 py-16">
          <div className="mx-auto flex max-w-6xl flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="mb-2 text-2xl font-bold text-white lg:text-3xl">
                Ready to hire top Remote Hero professionals?
              </h2>
              <p className="text-slate-300">
                Join hundreds of companies saving thousands while building world-class remote teams.
              </p>
            </div>
            <button
              onClick={() => setModalOpen(true)}
              className="shrink-0 rounded-xl border border-white/50 px-8 py-3 text-base font-semibold text-white transition-colors hover:bg-white/10"
            >
              Schedule a Call
            </button>
          </div>
        </section>

      </main>
      <Footer />
      <GetStartedModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  )
}

export const Route = createFileRoute('/tools/salary-guide')({
  component: SalaryGuidePage,
})
