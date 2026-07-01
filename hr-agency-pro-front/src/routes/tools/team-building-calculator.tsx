import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { Search, Trash, Plus, Calculator } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'
import { PublicNavbar } from '../../components/landing/PublicNavbar'
import { Footer } from '../../components/landing/Footer'
import { GetStartedModal } from '../../components/how-it-works/GetStartedModal'

// ── Static data ──────────────────────────────────────────────────────────────

const CATEGORY_DATA: Record<string, Record<string, { us: number; rh: number }>> = {
  Administrative: {
    'Virtual Assistant': { us: 48000, rh: 21600 },
    'Administrative Assistant': { us: 52000, rh: 21600 },
    'Executive Assistant': { us: 72000, rh: 27000 },
    'Data Entry Specialist': { us: 45000, rh: 21600 },
    'Office Manager': { us: 65000, rh: 28800 },
    'Personal Assistant': { us: 55000, rh: 25200 },
    'Operations Assistant': { us: 50000, rh: 23400 },
  },
  Technology: {
    'Software Engineer': { us: 120000, rh: 43200 },
    'Frontend Developer': { us: 115000, rh: 48000 },
    'Backend Developer': { us: 120000, rh: 50000 },
    'Full-stack Developer': { us: 130000, rh: 55000 },
    'Data Scientist': { us: 155000, rh: 48000 },
    'DevOps Engineer': { us: 130000, rh: 45600 },
    'Product Manager': { us: 140000, rh: 48000 },
    'UI/UX Designer': { us: 95000, rh: 36000 },
    'QA Tester': { us: 85000, rh: 36000 },
  },
  Marketing: {
    'Digital Marketing Manager': { us: 85000, rh: 36000 },
    'Marketing Specialist': { us: 70000, rh: 28800 },
    'Content Creator': { us: 55000, rh: 24000 },
    'SEO Specialist': { us: 72000, rh: 32000 },
    'Social Media Manager': { us: 65000, rh: 29000 },
    'Copywriter': { us: 62000, rh: 26400 },
    'Email Marketing Specialist': { us: 68000, rh: 30500 },
  },
  'Customer Support': {
    'Customer Success Manager': { us: 78000, rh: 32400 },
    'Support Representative': { us: 47500, rh: 21600 },
    'Technical Support Specialist': { us: 62000, rh: 27000 },
    'Live Chat Agent': { us: 42000, rh: 21600 },
    'Help Desk Specialist': { us: 52000, rh: 24000 },
  },
  Finance: {
    'Bookkeeper': { us: 58000, rh: 24000 },
    'Financial Analyst': { us: 78000, rh: 30000 },
    'Staff Accountant': { us: 58000, rh: 25200 },
    'Payroll Specialist': { us: 55000, rh: 22800 },
    'Accounts Receivable Specialist': { us: 48000, rh: 21600 },
  },
  Operations: {
    'Project Manager': { us: 108000, rh: 39600 },
    'Operations Manager': { us: 95000, rh: 36000 },
    'Operations Coordinator': { us: 62000, rh: 25200 },
    'Appointment Setter': { us: 45000, rh: 21600 },
  },
}

const SENIORITY_MULTIPLIERS: Record<string, number> = {
  'Junior (0-2 Yrs Exp)': 1,
  'Mid-Range (3-5 Yrs Exp)': 1.3,
  'Senior (5-8 Yrs Exp)': 1.6,
  'Lead (8+ Yrs Exp)': 1.9,
}

// ── Helpers ──────────────────────────────────────────────────────────────────

const CATEGORIES = Object.keys(CATEGORY_DATA)
const SENIORITIES = Object.keys(SENIORITY_MULTIPLIERS)
const BAR_HEIGHT = 192 // px — h-48

function fmt(n: number) {
  return '$' + new Intl.NumberFormat('de-DE').format(Math.round(n))
}

// ── Types ────────────────────────────────────────────────────────────────────

type Row = { id: string; category: string; role: string; seniority: string; count: number }
type Results = { usTotal: number; rhTotal: number; savings: number }

function makeRow(): Row {
  const category = CATEGORIES[0]
  const role = Object.keys(CATEGORY_DATA[category])[0]
  return { id: Math.random().toString(36).slice(2), category, role, seniority: SENIORITIES[0], count: 1 }
}

// ── Sub-components ───────────────────────────────────────────────────────────

function EmptyState() {
  return (
    <div className="flex flex-col items-center py-8 text-center">
      <div className="mb-5 flex size-16 items-center justify-center rounded-2xl bg-slate-100">
        <Calculator size={26} className="text-slate-400" />
      </div>
      <h3 className="mb-3 text-xl font-bold text-slate-900">Your potential savings</h3>
      <p className="text-sm leading-relaxed text-slate-500">
        Add the roles you want to fill with Remote Hero talent, then click{' '}
        <span className="font-semibold text-slate-700">"Calculate your savings"</span>
      </p>
    </div>
  )
}

function ResultsPanel({ r, onCta }: { r: Results; onCta: () => void }) {
  const rhBarH = r.usTotal > 0 ? Math.round((r.rhTotal / r.usTotal) * BAR_HEIGHT) : 0
  const pctSaved = r.usTotal > 0 ? Math.round((1 - r.rhTotal / r.usTotal) * 100) : 0

  return (
    <div>
      <p className="mb-1 text-xs font-bold uppercase tracking-widest text-slate-400">
        Total savings of:
      </p>
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="mb-6 text-4xl font-black text-emerald-500"
      >
        {fmt(r.savings)}
      </motion.p>

      <button
        onClick={onCta}
        className="mb-8 w-full rounded-xl bg-[#0f2447] py-3 text-sm font-bold text-white transition-colors hover:bg-[#162f5c]"
      >
        Request Sample Profiles
      </button>

      {/* Bar chart */}
      <div className="relative flex gap-4" style={{ height: `${BAR_HEIGHT}px` }}>
        {/* US bar */}
        <div className="relative flex-1">
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: BAR_HEIGHT }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            className="absolute bottom-0 left-0 right-0 overflow-hidden rounded-t-xl bg-slate-300"
          >
            <p className="pt-2 text-center text-[11px] font-bold leading-tight text-slate-600">
              {fmt(r.usTotal)}
            </p>
          </motion.div>
        </div>

        {/* RH bar */}
        <div className="relative flex-1">
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: rhBarH }}
            transition={{ duration: 0.65, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="absolute bottom-0 left-0 right-0 overflow-hidden rounded-t-xl bg-emerald-500"
          >
            <p className="pt-2 text-center text-[11px] font-bold leading-tight text-white">
              {fmt(r.rhTotal)}
            </p>
          </motion.div>
        </div>
      </div>

      {/* Bar labels */}
      <div className="mt-2 flex gap-4">
        <p className="flex-1 text-center text-xs font-bold text-slate-400">USA</p>
        <p className="flex-1 text-center text-xs font-bold text-slate-400">Remote Hero</p>
      </div>

      <p className="mt-4 text-center text-xs text-slate-400">
        Save up to {pctSaved}% compared to US hiring costs
      </p>
    </div>
  )
}

// ── Page ─────────────────────────────────────────────────────────────────────

function TeamBuildingCalculatorPage() {
  const [rows, setRows] = useState<Row[]>([makeRow()])
  const [results, setResults] = useState<Results | null>(null)
  const [calcKey, setCalcKey] = useState(0)
  const [modalOpen, setModalOpen] = useState(false)

  const addRow = () => setRows((prev) => [...prev, makeRow()])

  const removeRow = (id: string) => {
    if (rows.length === 1) return
    setResults(null)
    setRows((prev) => prev.filter((r) => r.id !== id))
  }

  const updateRow = (id: string, field: keyof Row, value: string | number) => {
    setResults(null)
    setRows((prev) =>
      prev.map((r) => {
        if (r.id !== id) return r
        if (field === 'category') {
          const cat = value as string
          const role = Object.keys(CATEGORY_DATA[cat] ?? {})[0] ?? ''
          return { ...r, category: cat, role }
        }
        return { ...r, [field]: value }
      }),
    )
  }

  const calculateSavings = () => {
    let usTotal = 0
    let rhTotal = 0
    rows.forEach((row) => {
      const salaries = CATEGORY_DATA[row.category]?.[row.role]
      if (!salaries) return
      const mult = SENIORITY_MULTIPLIERS[row.seniority] ?? 1
      usTotal += salaries.us * mult * row.count
      rhTotal += salaries.rh * mult * row.count
    })
    setResults({ usTotal, rhTotal, savings: usTotal - rhTotal })
    setCalcKey((k) => k + 1)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <PublicNavbar />
      <main className="flex-1 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-16">

          {/* Header */}
          <p className="mb-4 text-xs font-bold uppercase tracking-widest text-slate-400">
            Products → Team Building Calculator
          </p>
          <h1 className="mb-3 text-4xl font-bold text-slate-900">Team Building Calculator</h1>
          <p className="mb-12 text-base text-slate-500">
            See how far your budget goes with Remote Hero compared to hiring in the U.S.
          </p>

          {/* Main grid */}
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">

            {/* ── Left: form ──────────────────────────────────── */}
            <div className="lg:col-span-8">

              {/* Column headers — hidden on small screens */}
              <div className="mb-3 hidden grid-cols-12 gap-4 px-1 text-xs font-bold uppercase tracking-wider text-slate-400 lg:grid">
                <div className="col-span-3">Role Category</div>
                <div className="col-span-3">Job Title</div>
                <div className="col-span-3">Seniority</div>
                <div className="col-span-2"># of Hires</div>
                <div className="col-span-1" />
              </div>

              {/* Dynamic rows */}
              <AnimatePresence initial={false}>
                {rows.map((row) => (
                  <motion.div
                    key={row.id}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="mb-4 grid grid-cols-12 items-center gap-3">

                      {/* Category */}
                      <div className="col-span-12 lg:col-span-3">
                        <select
                          aria-label="Role Category"
                          value={row.category}
                          onChange={(e) => updateRow(row.id, 'category', e.target.value)}
                          className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 shadow-sm outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                        >
                          {CATEGORIES.map((cat) => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                        </select>
                      </div>

                      {/* Role */}
                      <div className="col-span-12 lg:col-span-3">
                        <select
                          aria-label="Job Title"
                          value={row.role}
                          onChange={(e) => updateRow(row.id, 'role', e.target.value)}
                          className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 shadow-sm outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                        >
                          {Object.keys(CATEGORY_DATA[row.category] ?? {}).map((role) => (
                            <option key={role} value={role}>{role}</option>
                          ))}
                        </select>
                      </div>

                      {/* Seniority */}
                      <div className="col-span-12 lg:col-span-3">
                        <select
                          aria-label="Seniority"
                          value={row.seniority}
                          onChange={(e) => updateRow(row.id, 'seniority', e.target.value)}
                          className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 shadow-sm outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                        >
                          {SENIORITIES.map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </div>

                      {/* # of hires */}
                      <div className="col-span-10 lg:col-span-2">
                        <div className="flex items-center justify-between gap-2 rounded-xl border border-slate-200 px-3 py-2.5">
                          <button
                            onClick={() => updateRow(row.id, 'count', Math.max(1, row.count - 1))}
                            className="flex size-5 items-center justify-center rounded font-bold text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-800"
                          >
                            −
                          </button>
                          <span className="min-w-[20px] text-center text-sm font-bold text-slate-800">
                            {row.count}
                          </span>
                          <button
                            onClick={() => updateRow(row.id, 'count', row.count + 1)}
                            className="flex size-5 items-center justify-center rounded font-bold text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-800"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {/* Delete */}
                      <div className="col-span-2 flex justify-center lg:col-span-1">
                        <button
                          onClick={() => removeRow(row.id)}
                          disabled={rows.length === 1}
                          className="flex size-9 items-center justify-center rounded-xl text-slate-300 transition-colors hover:bg-red-50 hover:text-red-400 disabled:cursor-not-allowed disabled:opacity-30"
                          aria-label="Remove row"
                        >
                          <Trash size={15} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Add row button */}
              <button
                onClick={addRow}
                className="mt-1 flex items-center gap-1.5 text-sm font-bold text-sky-600 transition-colors hover:text-sky-700"
              >
                <Plus size={15} />
                ADD ONE MORE
              </button>

              {/* Hint */}
              <p className="mt-8 flex items-start gap-2 text-sm leading-relaxed text-slate-500">
                <span className="mt-px text-amber-500">⊙</span>
                Add the roles you want to fill with Remote Hero Professionals, and our calculator will
                show you how much you can save.
              </p>

              {/* Contact Us card */}
              <div className="mt-5 flex items-start gap-4 rounded-2xl border border-sky-100 bg-sky-50 p-5">
                <Search className="mt-0.5 size-5 shrink-0 text-sky-500" />
                <div>
                  <p className="mb-3 text-sm text-slate-600">
                    {"Don't see the role you're looking for? We can still find it."}
                  </p>
                  <button
                    onClick={() => setModalOpen(true)}
                    className="rounded-xl bg-[#0f2447] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#162f5c]"
                  >
                    Contact Us
                  </button>
                </div>
              </div>

              {/* Calculate button */}
              <button
                onClick={calculateSavings}
                className="mt-8 flex items-center gap-3 rounded-2xl bg-[#0f2447] px-8 py-4 text-base font-bold text-white shadow-lg shadow-[#0f2447]/20 transition-all hover:scale-[1.02] hover:shadow-xl hover:shadow-[#0f2447]/25 active:scale-[0.99]"
              >
                <Calculator size={20} />
                Calculate your savings
              </button>
            </div>

            {/* ── Right: results ───────────────────────────────── */}
            <div className="lg:col-span-4">
              <div className="sticky top-24 rounded-3xl border border-slate-100 bg-white/80 p-8 shadow-xl backdrop-blur-md">
                  {results ? (
                    <motion.div
                      key={`results-${calcKey}`}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ResultsPanel r={results} onCta={() => setModalOpen(true)} />
                    </motion.div>
                  ) : (
                    <EmptyState />
                  )}
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

export const Route = createFileRoute('/tools/team-building-calculator')({
  component: TeamBuildingCalculatorPage,
})
