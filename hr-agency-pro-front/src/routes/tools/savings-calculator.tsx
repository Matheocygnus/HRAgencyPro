import { useState, useMemo, useEffect } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { Search } from 'lucide-react'
import { motion } from 'motion/react'
import { Button } from '@heroui/react'
import { PublicNavbar } from '../../components/landing/PublicNavbar'
import { Footer } from '../../components/landing/Footer'
import { GetStartedModal } from '../../components/how-it-works/GetStartedModal'
import { CATEGORY_DATA, CATEGORIES } from '../../data/salaryData'

// ── Static data ───────────────────────────────────────────────────────────────

const SENIORITY_MULTIPLIERS: Record<string, number> = {
  'Junior (0-2 Yrs Exp)': 1,
  'Mid-Range (3-5 Yrs Exp)': 1.3,
  'Senior (5-8 Yrs Exp)': 1.6,
  'Lead (8+ Yrs Exp)': 1.9,
}

const SENIORITIES = Object.keys(SENIORITY_MULTIPLIERS)

// ── Helpers ───────────────────────────────────────────────────────────────────

function useCountUp(target: number, duration = 550) {
  const [value, setValue] = useState(0)
  useEffect(() => {
    setValue(0)
    let cancelled = false
    const start = performance.now()
    const tick = (now: number) => {
      if (cancelled) return
      const t = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - t, 3)
      setValue(Math.round(eased * target))
      if (t < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
    return () => { cancelled = true }
  }, [target, duration])
  return value
}

const SELECT_CLS =
  'w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-800 shadow-sm outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100'

// ── Page ─────────────────────────────────────────────────────────────────────

function SavingsCalculatorPage() {
  const [monthlyBudget, setMonthlyBudget] = useState(5500)
  const [category, setCategory] = useState(CATEGORIES[0])
  const [role, setRole] = useState(Object.keys(CATEGORY_DATA[CATEGORIES[0]])[0])
  const [seniority, setSeniority] = useState(SENIORITIES[0])
  const [modalOpen, setModalOpen] = useState(false)

  const results = useMemo(() => {
    const salaries = CATEGORY_DATA[category]?.[role]
    if (!salaries) return { hiresUS: 0, hiresRH: 0, pctExtra: 0 }
    const mult = SENIORITY_MULTIPLIERS[seniority] ?? 1
    const monthlyUS = (salaries.us * mult) / 12
    const monthlyRH = (salaries.rh * mult) / 12
    const hiresUS = monthlyUS > 0 ? Math.floor(monthlyBudget / monthlyUS) : 0
    const hiresRH = monthlyRH > 0 ? Math.floor(monthlyBudget / monthlyRH) : 0
    const pctExtra = hiresUS > 0 ? Math.round(((hiresRH - hiresUS) / hiresUS) * 100) : 0
    return { hiresUS, hiresRH, pctExtra }
  }, [monthlyBudget, category, role, seniority])

  const countUS = useCountUp(results.hiresUS)
  const countRH = useCountUp(results.hiresRH)

  const handleCategoryChange = (cat: string) => {
    setCategory(cat)
    setRole(Object.keys(CATEGORY_DATA[cat] ?? {})[0] ?? '')
  }

  const usRoleName = results.hiresUS === 1 ? role : `${role}s`
  const rhRoleName = results.hiresRH === 1 ? role : `${role}s`

  return (
    <div className="flex min-h-screen flex-col">
      <PublicNavbar />
      <main className="flex-1 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-16">

          {/* ── Header ─────────────────────────────────────── */}
          <p className="mb-4 text-xs font-bold uppercase tracking-widest text-slate-400">
            Products → Scale Smart & Save Calculator
          </p>
          <h1 className="mb-3 text-4xl font-bold text-slate-900 lg:text-5xl">
            Scale Smart & Save Calculator
          </h1>
          <p className="text-base text-slate-500">
            Calculate Your Savings: Unlock Funds for Growth and Key Initiatives
          </p>

          {/* ── Main grid ──────────────────────────────────── */}
          <div className="mt-12 grid grid-cols-1 gap-12 lg:grid-cols-2">

            {/* ── Left: Inputs ─────────────────────────────── */}
            <div className="flex flex-col gap-6">

              {/* Budget card */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="mb-1 text-lg font-bold text-slate-900">
                  {"What's your monthly budget?"}
                </h2>
                <p className="mb-5 text-sm text-slate-400">
                  Enter your total monthly budget for building your team
                </p>
                <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm transition focus-within:border-sky-400 focus-within:ring-2 focus-within:ring-sky-100">
                  <span className="shrink-0 text-base font-semibold text-slate-400">$</span>
                  <input
                    type="number"
                    min={0}
                    value={monthlyBudget}
                    onChange={(e) => setMonthlyBudget(Math.max(0, Number(e.target.value)))}
                    className="min-w-0 flex-1 bg-transparent text-base font-semibold text-slate-900 outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                  />
                  <span className="shrink-0 text-sm text-slate-400">/month</span>
                </div>
              </div>

              {/* Role card */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="mb-1 text-lg font-bold text-slate-900">
                  What type of roles are you hiring?
                </h2>
                <p className="mb-5 text-sm text-slate-400">
                  Select the role type and seniority level
                </p>
                <div className="flex flex-col gap-4">

                  {/* Category */}
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                      Role Category
                    </label>
                    <select
                      value={category}
                      onChange={(e) => handleCategoryChange(e.target.value)}
                      className={SELECT_CLS}
                    >
                      {CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  {/* Role */}
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                      Role
                    </label>
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className={SELECT_CLS}
                    >
                      {Object.keys(CATEGORY_DATA[category] ?? {}).map((r) => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                    </select>
                  </div>

                  {/* Seniority */}
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                      Seniority Level
                    </label>
                    <select
                      value={seniority}
                      onChange={(e) => setSeniority(e.target.value)}
                      className={SELECT_CLS}
                    >
                      {SENIORITIES.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>

                </div>
              </div>
            </div>

            {/* ── Right: Results ────────────────────────────── */}
            <div className="rounded-3xl bg-slate-50 p-8 lg:p-10">
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
                Your Hiring Power
              </p>
              <p className="mt-1 text-base font-semibold text-slate-600">
                For ${monthlyBudget.toLocaleString()}/month budget
              </p>

              {/* Comparison cards */}
              <div className="mt-6 flex gap-4">

                {/* Without Remote Hero */}
                <motion.div
                  whileHover={{ y: -4 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                  className="flex flex-1 flex-col items-center rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow duration-300 hover:shadow-xl"
                >
                  <p className="text-center text-[11px] font-bold uppercase tracking-widest text-slate-400">
                    Without Remote Hero
                  </p>
                  <motion.p
                    key={results.hiresUS}
                    initial={{ opacity: 0, scale: 0.75 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                    className="my-4 text-6xl font-black text-[#0f2447]"
                  >
                    {countUS}
                  </motion.p>
                  <p className="text-center text-sm text-slate-500">{usRoleName}</p>
                </motion.div>

                {/* With Remote Hero */}
                <motion.div
                  whileHover={{ y: -4 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                  className="relative flex flex-1 flex-col items-center rounded-2xl border-2 border-sky-400 bg-white p-5 shadow-lg transition-shadow duration-300 hover:shadow-xl hover:shadow-sky-100/80"
                >
                  <span className="absolute -top-3.5 right-3 rounded-full bg-[#0f2447] px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white shadow-sm">
                    RECOMMENDED
                  </span>
                  <p className="text-center text-[11px] font-bold uppercase tracking-widest text-slate-400">
                    With Remote Hero
                  </p>
                  <motion.p
                    key={results.hiresRH}
                    initial={{ opacity: 0, scale: 0.75 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                    className="my-4 text-6xl font-black text-[#0f2447]"
                  >
                    {countRH}
                  </motion.p>
                  <p className="text-center text-sm text-slate-500">{rhRoleName}</p>
                  {results.pctExtra > 0 && (
                    <p className="mt-1.5 text-sm font-bold text-emerald-500">
                      {results.pctExtra}% more talent
                    </p>
                  )}
                </motion.div>

              </div>

              {/* Summary text */}
              <p className="mt-6 text-center text-sm leading-relaxed text-slate-600">
                With Remote Hero, hire up to{' '}
                <span className="font-bold text-sky-600">
                  {results.hiresRH} {rhRoleName}
                </span>{' '}
                for the same budget
              </p>

              {/* CTA button */}
              <div className="mt-6 flex justify-center">
                <a
                  href="https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ2UpOei0V8GAa6sYFiLO49OBQrFe2yiwB6JGXMGXUBIWB1zo2iunWj6GS5hJJBeP_h8G3AFT0hg"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block rounded-xl bg-[#0f2447] px-8 py-3.5 text-base font-bold text-white shadow-md shadow-[#0f2447]/20 transition-opacity hover:opacity-90"
                >
                  Get Started Now
                </a>
              </div>

              {/* Contact block */}
              <div className="mt-8 flex items-start gap-4 rounded-2xl border border-sky-100 bg-sky-50 p-5">
                <Search className="mt-0.5 size-5 shrink-0 text-sky-500" />
                <div>
                  <p className="mb-3 text-sm text-slate-600">
                    Need help figuring out your staffing needs?
                  </p>
                  <button
                    onClick={() => setModalOpen(true)}
                    className="rounded-xl bg-[#0f2447] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#162f5c]"
                  >
                    Contact Us
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>
      <Footer />
      <GetStartedModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  )
}

export const Route = createFileRoute('/tools/savings-calculator')({
  component: SavingsCalculatorPage,
})
