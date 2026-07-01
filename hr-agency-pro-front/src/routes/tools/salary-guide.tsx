import { useState, useEffect } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { Search, GraduationCap } from 'lucide-react'
import { motion } from 'motion/react'
import { Button } from '@heroui/react'
import { PublicNavbar } from '../../components/landing/PublicNavbar'
import { Footer } from '../../components/landing/Footer'
import { GetStartedModal } from '../../components/how-it-works/GetStartedModal'
import { salaryData, type RoleEntry } from '../../data/salaryData'

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

function SalaryChart({ r }: { r: RoleEntry }) {
  const savings = r.us - r.rh
  const rhH = Math.round((r.rh / r.us) * BAR_MAX)
  const countUS = useCountUp(r.us)
  const countRH = useCountUp(r.rh)
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
  const [selectedRole, setSelectedRole] = useState<string>(salaryData[0].role)
  const [modalOpen, setModalOpen] = useState(false)

  const filtered = query
    ? salaryData.filter((r) => r.role.toLowerCase().includes(query.toLowerCase()))
    : salaryData

  const active = filtered.find((r) => r.role === selectedRole) ?? filtered[0] ?? salaryData[0]

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const q = e.target.value
    setQuery(q)
    if (q) {
      const first = salaryData.find((r) => r.role.toLowerCase().includes(q.toLowerCase()))
      if (first) setSelectedRole(first.role)
    } else {
      setSelectedRole(salaryData[0].role)
    }
  }

  const savings = active.us - active.rh
  const countUS = useCountUp(active.us)
  const countRH = useCountUp(active.rh)
  const countSav = useCountUp(savings)

  return (
    <div className="flex min-h-screen flex-col">
      <PublicNavbar />
      <main className="flex-1 bg-white">

        {/* ── Hero ──────────────────────────────────────── */}
        <section className="bg-gradient-to-br from-slate-50 to-sky-50/40 px-6 py-16">
          <div className="mx-auto max-w-7xl">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              className="mb-5 flex items-center gap-3"
            >
              <div className="flex size-9 items-center justify-center rounded-xl bg-sky-100 text-sky-700">
                <GraduationCap size={18} />
              </div>
              <span className="rounded-full bg-sky-100 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-sky-700">
                Comparing Salaries: US vs. Remote Hero
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.08 }}
              className="mb-3 text-4xl font-extrabold tracking-tight text-slate-900 lg:text-5xl"
            >
              2025 Salary Guide: US vs Remote Hero
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="text-lg text-slate-500"
            >
              Browse all {salaryData.length} roles and compare salaries side by side.
            </motion.p>
          </div>
        </section>

        {/* ── Main: role browser + detail ───────────────── */}
        <section className="px-6 py-12">
          <div className="mx-auto max-w-7xl">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">

              {/* Left: search + scrollable role list */}
              <div className="flex flex-col gap-3">
                <div className="relative">
                  <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={query}
                    onChange={handleQueryChange}
                    placeholder="Search roles..."
                    className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm text-slate-900 shadow-sm outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                  />
                </div>

                <div
                  className="overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-sm"
                  style={{ maxHeight: '520px' }}
                >
                  {filtered.length === 0 ? (
                    <p className="px-4 py-4 text-sm text-slate-400">No roles found</p>
                  ) : (
                    filtered.map((r) => (
                      <button
                        key={r.role}
                        onClick={() => setSelectedRole(r.role)}
                        className={`w-full border-b border-slate-100 px-4 py-3 text-left last:border-b-0 transition-colors hover:bg-sky-50 ${
                          active.role === r.role
                            ? 'border-l-[3px] border-l-sky-500 bg-sky-50'
                            : 'border-l-[3px] border-l-transparent'
                        }`}
                      >
                        <span className="block text-sm font-medium text-slate-900">{r.role}</span>
                        <span className="text-xs text-slate-400">{r.category}</span>
                      </button>
                    ))
                  )}
                </div>

                <div className="flex items-start gap-3 rounded-xl border border-sky-100 bg-sky-50 p-4">
                  <Search className="mt-0.5 size-4 shrink-0 text-sky-500" />
                  <div>
                    <p className="mb-2 text-xs text-slate-600">
                      {"Don't see the role you're looking for?"}
                    </p>
                    <Button
                      size="sm"
                      className="bg-[#0f2447] font-semibold text-white hover:bg-[#162f5c]"
                      onPress={() => setModalOpen(true)}
                    >
                      Contact Us
                    </Button>
                  </div>
                </div>
              </div>

              {/* Right: role detail — no AnimatePresence, enter animation only */}
              <div className="lg:col-span-2">
                <motion.div
                  key={active.role}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35 }}
                  className="grid grid-cols-1 gap-10 lg:grid-cols-2"
                >
                  <div className="flex flex-col justify-center">
                    <h2 className="mb-5 text-3xl font-bold text-slate-900">{active.role}</h2>

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

                  <SalaryChart r={active} />
                </motion.div>
              </div>

            </div>
          </div>
        </section>

        {/* ── CTA Banner ────────────────────────────────── */}
        <section className="bg-[#0f2447] px-6 py-16">
          <div className="mx-auto flex max-w-7xl flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
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
