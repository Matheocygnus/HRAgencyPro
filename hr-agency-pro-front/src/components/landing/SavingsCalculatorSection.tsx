import { useState } from 'react'
import { Card, Button, Chip } from '@heroui/react'
import { DollarSign, TrendingDown, CalendarDays } from 'lucide-react'
import { motion } from 'motion/react'

const roles = [
  { value: 'virtual-assistant', label: 'Virtual Assistant' },
  { value: 'sales-rep', label: 'Sales Representative' },
  { value: 'developer', label: 'Software Developer' },
  { value: 'operations', label: 'Operations Manager' },
  { value: 'customer-support', label: 'Customer Support' },
  { value: 'marketing', label: 'Marketing Specialist' },
  { value: 'recruiter', label: 'Recruiter' },
]

const skillsByRole: Record<string, string[]> = {
  'virtual-assistant': ['Admin Support', 'Calendar Management', 'Email Management', 'Research'],
  'sales-rep': ['CRM', 'Cold Outreach', 'Lead Generation', 'Sales Strategy'],
  'developer': ['React', 'Node.js', 'Python', 'TypeScript'],
  'operations': ['Process Optimization', 'Team Management', 'Data Analysis', 'Project Management'],
  'customer-support': ['Zendesk', 'Intercom', 'Customer Success', 'Live Chat'],
  'marketing': ['SEO', 'Content Strategy', 'Social Media', 'Email Marketing'],
  'recruiter': ['Sourcing', 'ATS', 'Interviewing', 'Talent Mapping'],
}

const experiences = [
  { value: 'entry', label: 'Entry Level (0–2 yrs)', multiplier: 1.0 },
  { value: 'mid', label: 'Mid Level (3–5 yrs)', multiplier: 1.4 },
  { value: 'senior', label: 'Senior (6+ yrs)', multiplier: 1.9 },
]

const regions = [
  { value: 'latam', label: 'Latin America' },
  { value: 'asia', label: 'Asia Pacific' },
  { value: 'europe', label: 'Eastern Europe' },
]

const baseCosts: Record<string, { remote: number; us: number }> = {
  'virtual-assistant': { remote: 1000, us: 2800 },
  'sales-rep': { remote: 1400, us: 3800 },
  'developer': { remote: 2200, us: 7000 },
  'operations': { remote: 1700, us: 5000 },
  'customer-support': { remote: 800, us: 2200 },
  'marketing': { remote: 1300, us: 3500 },
  'recruiter': { remote: 1100, us: 3000 },
}

function FieldSelect({
  label,
  value,
  onChange,
  children,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 shadow-sm transition-all focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-400/20"
      >
        {children}
      </select>
    </div>
  )
}

export function SavingsCalculatorSection() {
  const [role, setRole] = useState('virtual-assistant')
  const [experience, setExperience] = useState('entry')
  const [region, setRegion] = useState('latam')

  const expMult = experiences.find((e) => e.value === experience)?.multiplier ?? 1.0
  const base = baseCosts[role] ?? baseCosts['virtual-assistant']
  const remoteCost = Math.round(base.remote * expMult)
  const usCost = Math.round(base.us * expMult)
  const savingsPct = Math.round((1 - remoteCost / usCost) * 100)

  return (
    <section className="bg-slate-50 px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">

        {/* Header */}
        <div className="mb-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Chip
              variant="flat"
              className="mb-4 border border-violet-200 bg-violet-100/80 text-xs font-bold uppercase tracking-widest text-violet-700"
            >
              Make Your Work Life Easier
            </Chip>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl font-black tracking-tight text-[#0f2447] lg:text-5xl"
          >
            Hire Elite Virtual Assistants
            <br className="hidden sm:block" />
            &amp; Remote Professionals
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mx-auto mt-4 max-w-2xl text-base text-slate-500"
          >
            Search our curated pool of pre-vetted Remote Hero professionals. Save 50–70%
            compared to US hiring costs while getting English-speaking talent in your time zone.
          </motion.p>
        </div>

        {/* Calculator card */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <Card className="overflow-hidden bg-white shadow-xl shadow-slate-200/60">

            {/* Selects */}
            <Card.Content className="p-6 sm:p-8">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <FieldSelect label="Role" value={role} onChange={setRole}>
                  {roles.map((r) => (
                    <option key={r.value} value={r.value}>
                      {r.label}
                    </option>
                  ))}
                </FieldSelect>

                <FieldSelect label="Skills" value="all" onChange={() => undefined}>
                  <option value="all">All Skills</option>
                  {(skillsByRole[role] ?? []).map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </FieldSelect>

                <FieldSelect label="Experience" value={experience} onChange={setExperience}>
                  {experiences.map((e) => (
                    <option key={e.value} value={e.value}>
                      {e.label}
                    </option>
                  ))}
                </FieldSelect>

                <FieldSelect label="Region" value={region} onChange={setRegion}>
                  {regions.map((r) => (
                    <option key={r.value} value={r.value}>
                      {r.label}
                    </option>
                  ))}
                </FieldSelect>
              </div>
            </Card.Content>

            {/* Result block */}
            <div className="border-t border-slate-100 bg-[#0f2447]/[0.04] px-6 py-6 sm:px-8 sm:py-7">
              <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">

                {/* Estimated cost */}
                <div>
                  <p className="text-sm text-slate-500">
                    Estimated monthly cost with RemoteHero:
                  </p>
                  <div className="mt-1 flex items-end gap-1">
                    <span className="text-5xl font-black text-[#0f2447]">
                      ${remoteCost.toLocaleString()}
                    </span>
                    <span className="mb-1.5 text-xl font-semibold text-slate-400">/mo</span>
                  </div>
                  <p className="mt-1 text-xs text-slate-400">Full-time remote professional</p>
                </div>

                {/* Stats + CTA */}
                <div className="flex flex-col gap-4">
                  <div className="flex gap-8">
                    <div className="flex items-start gap-2">
                      <DollarSign className="mt-0.5 size-4 shrink-0 text-slate-400" />
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                          US Equivalent
                        </p>
                        <p className="text-base font-bold text-slate-700">
                          ${usCost.toLocaleString()}/mo
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <TrendingDown className="mt-0.5 size-4 shrink-0 text-emerald-500" />
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                          Your Savings
                        </p>
                        <p className="text-base font-bold text-emerald-600">{savingsPct}%</p>
                      </div>
                    </div>
                  </div>

                  <Button
                    size="lg"
                    className="w-full bg-[#0f2447] font-semibold text-white shadow-md shadow-[#0f2447]/20 hover:opacity-90 sm:w-auto"
                  >
                    <CalendarDays className="size-4" />
                    Book a Discovery Call
                  </Button>
                </div>

              </div>
            </div>
          </Card>
        </motion.div>

      </div>
    </section>
  )
}
