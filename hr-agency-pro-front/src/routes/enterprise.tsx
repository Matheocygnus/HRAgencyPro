import { createFileRoute } from '@tanstack/react-router'
import { motion } from 'motion/react'
import {
  DollarSign,
  ShieldCheck,
  Scale,
  Users,
  Globe,
  Clock,
  CheckCircle2,
  Building2,
  Briefcase,
  Target,
} from 'lucide-react'
import { PopupButton } from '@typeform/embed-react'
import { PublicNavbar } from '../components/landing/PublicNavbar'
import { Footer } from '../components/landing/Footer'

export const Route = createFileRoute('/enterprise')({
  component: EnterprisePage,
})

const VIEW = { once: true, margin: '-80px' } as const
const TYPEFORM_ID = 'aKI8I8lO'
const TYPEFORM_URL = 'https://form.typeform.com/to/aKI8I8lO'

const reasons = [
  {
    Icon: DollarSign,
    title: 'Significant Cost Savings',
    desc: 'Reduce labor costs by 50–70% compared to US-based hiring. Our transparent pricing model ensures predictable budgeting with no hidden fees or surprises.',
  },
  {
    Icon: ShieldCheck,
    title: 'Compliance & Security',
    desc: 'Navigate global employment regulations with confidence. We ensure full compliance with local labor laws, data protection standards, and security requirements.',
  },
  {
    Icon: Scale,
    title: 'Flexible Scaling',
    desc: 'Rapidly expand or contract your global workforce as needed. Our scalable solutions adapt to your changing business requirements with minimal friction.',
  },
  {
    Icon: Users,
    title: 'Elite Talent Access',
    desc: 'Our rigorous vetting process ensures you get only the top 3% of global talent. Access specialized skills that may be scarce or highly competitive in your local market.',
  },
  {
    Icon: Globe,
    title: 'Global Expansion Support',
    desc: 'Enter new markets with confidence. Our knowledge of regional business practices and culture helps you navigate expansion into Latin America, the Caribbean, and beyond.',
  },
  {
    Icon: Clock,
    title: 'Accelerated Hiring',
    desc: 'Dramatically reduce your time-to-hire with our pre-vetted talent pool. Get qualified candidates in days rather than weeks or months, even for specialized roles.',
  },
]

const plans = [
  {
    Icon: Building2,
    badge: 'Most Popular',
    title: 'Dedicated Remote Teams',
    desc: 'Build a fully integrated remote team that operates as an extension of your organization. Ideal for enterprises looking to scale quickly with consistent talent.',
    perks: [
      'Fully managed team of 5–50+ professionals',
      'Dedicated HR and compliance support',
      'Custom onboarding and training protocols',
      'Fixed monthly rate with full transparency',
      'SLA-backed performance guarantees',
      'Quarterly business reviews',
    ],
    highlight: true,
  },
  {
    Icon: Briefcase,
    badge: null,
    title: 'Enterprise RPO',
    desc: 'Outsource your entire recruitment function to RemoteHero. We manage sourcing, screening, and hiring at scale while you focus on running your business.',
    perks: [
      'End-to-end recruitment process management',
      'Dedicated talent acquisition team',
      'ATS integration and reporting dashboards',
      'Volume hiring with consistent quality',
      '60-day replacement guarantee',
    ],
    highlight: false,
  },
  {
    Icon: Target,
    badge: null,
    title: 'Executive Search',
    desc: 'For critical leadership and specialized roles, our Executive Search service delivers top-tier candidates through a rigorous, confidential search process.',
    perks: [
      'C-suite and VP-level talent sourcing',
      'Custom executive assessment framework',
      'Confidential search process',
      'Market intelligence and compensation benchmarking',
      '90-day replacement guarantee',
    ],
    highlight: false,
  },
]

function EnterprisePage() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <PublicNavbar />
      <main className="flex-1">

        {/* ── Hero ─────────────────────────────────────────────────────── */}
        <section className="bg-gradient-to-b from-sky-200 to-white px-6 pb-28 pt-20 lg:pb-36 lg:pt-28">
          <div className="mx-auto max-w-3xl text-center">
            <motion.h1
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55 }}
              className="mb-6 text-4xl font-extrabold leading-tight tracking-tight text-[#0f2447] lg:text-6xl"
            >
              Enterprise Talent
              <br />
              <span className="text-sky-600">Solutions</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mb-10 text-lg leading-relaxed text-[#0f2447]/70"
            >
              Scalable and compliant global workforce solutions for large organizations.
              Strategic talent acquisition to help your enterprise reduce costs and drive innovation.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.2 }}
              className="flex flex-col items-center justify-center gap-4 sm:flex-row"
            >
              <PopupButton
                id={TYPEFORM_ID}
                size={70}
                className="cursor-pointer rounded-xl bg-[#0f2447] px-9 py-4 text-base font-bold text-white shadow-lg shadow-[#0f2447]/20 transition-opacity hover:opacity-90"
              >
                Request a Consultation
              </PopupButton>
              <a
                href={TYPEFORM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl border-2 border-[#0f2447] px-9 py-4 text-base font-bold text-[#0f2447] transition-all hover:bg-[#0f2447] hover:text-white"
              >
                Book a Discovery Call
              </a>
            </motion.div>
          </div>
        </section>

        {/* ── Why Enterprises Choose RemoteHero ────────────────────────── */}
        <section className="bg-white px-6 py-20">
          <div className="mx-auto max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={VIEW}
              transition={{ duration: 0.5 }}
              className="mb-14 text-center"
            >
              <h2 className="mb-3 text-3xl font-extrabold tracking-tight text-[#0f2447] lg:text-4xl">
                Why Enterprises Choose RemoteHero
              </h2>
              <p className="text-lg text-[#0f2447]/60">
                Strategic advantages for{' '}
                <span className="text-sky-500">large organizations seeking global talent solutions</span>
              </p>
            </motion.div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {reasons.map((r, i) => (
                <motion.div
                  key={r.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={VIEW}
                  transition={{ duration: 0.45, delay: (i % 3) * 0.09 }}
                  whileHover={{ y: -4 }}
                  className="group rounded-2xl border border-sky-100 bg-sky-50 p-7 transition-all duration-300 hover:border-sky-200 hover:shadow-lg hover:shadow-sky-100"
                >
                  <div className="mb-4 flex size-12 items-center justify-center rounded-xl bg-sky-100 text-sky-600 transition-colors duration-300 group-hover:bg-sky-500 group-hover:text-white">
                    <r.Icon size={22} />
                  </div>
                  <h3 className="mb-2 text-base font-bold text-[#0f2447]">{r.title}</h3>
                  <p className="text-sm leading-relaxed text-[#0f2447]/60">{r.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Enterprise Solutions ──────────────────────────────────────── */}
        <section className="bg-sky-50 px-6 py-20">
          <div className="mx-auto max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={VIEW}
              transition={{ duration: 0.5 }}
              className="mb-14 text-center"
            >
              <h2 className="mb-3 text-3xl font-extrabold tracking-tight text-[#0f2447] lg:text-4xl">
                Enterprise Solutions
              </h2>
              <p className="text-lg text-[#0f2447]/60">
                Tailored engagement models designed for the scale and complexity of enterprise hiring
              </p>
            </motion.div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              {plans.map((plan, i) => (
                <motion.div
                  key={plan.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={VIEW}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  whileHover={{ y: -4 }}
                  className={`relative flex flex-col rounded-2xl border p-8 transition-all duration-300 hover:shadow-xl ${
                    plan.highlight
                      ? 'border-sky-300 bg-white shadow-lg shadow-sky-100'
                      : 'border-sky-100 bg-white hover:shadow-sky-100'
                  }`}
                >
                  {plan.badge && (
                    <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-[#0f2447] px-4 py-1 text-xs font-bold uppercase tracking-widest text-white">
                      {plan.badge}
                    </span>
                  )}

                  <div className="mb-5 flex size-12 items-center justify-center rounded-xl bg-sky-100 text-sky-600">
                    <plan.Icon size={22} />
                  </div>

                  <h3 className="mb-3 text-xl font-extrabold text-[#0f2447]">{plan.title}</h3>
                  <p className="mb-6 text-sm leading-relaxed text-[#0f2447]/60">{plan.desc}</p>

                  <ul className="mb-8 flex-1 space-y-3">
                    {plan.perks.map((perk) => (
                      <li key={perk} className="flex items-start gap-3 text-sm text-[#0f2447]/70">
                        <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-sky-500" />
                        {perk}
                      </li>
                    ))}
                  </ul>

                  <PopupButton
                    id={TYPEFORM_ID}
                    size={70}
                    className={`inline-flex w-full cursor-pointer items-center justify-center rounded-xl px-6 py-3.5 text-sm font-bold transition-all ${
                      plan.highlight
                        ? 'bg-[#0f2447] text-white shadow-md shadow-[#0f2447]/20 hover:opacity-90'
                        : 'border border-[#0f2447] text-[#0f2447] hover:bg-[#0f2447] hover:text-white'
                    }`}
                  >
                    Request a Consultation
                  </PopupButton>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Final CTA ────────────────────────────────────────────────── */}
        <section className="bg-[#0f2447] px-6 py-20">
          <div className="mx-auto max-w-3xl text-center">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={VIEW}
              transition={{ duration: 0.5 }}
              className="mb-4 text-3xl font-extrabold tracking-tight text-white lg:text-4xl"
            >
              Ready to Transform Your Enterprise Workforce?
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={VIEW}
              transition={{ duration: 0.45, delay: 0.08 }}
              className="mb-10 text-lg text-sky-200"
            >
              Join leading enterprises that trust RemoteHero to build high-performing global teams at a fraction of the cost.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={VIEW}
              transition={{ duration: 0.4, delay: 0.15 }}
              className="flex flex-col items-center justify-center gap-4 sm:flex-row"
            >
              <PopupButton
                id={TYPEFORM_ID}
                size={70}
                className="cursor-pointer rounded-xl bg-sky-500 px-9 py-4 text-base font-bold text-white shadow-lg shadow-sky-500/30 transition-opacity hover:opacity-90"
              >
                Request a Consultation
              </PopupButton>
              <a
                href={TYPEFORM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl border-2 border-white px-9 py-4 text-base font-bold text-white transition-all hover:bg-white hover:text-[#0f2447]"
              >
                Book a Discovery Call
              </a>
            </motion.div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  )
}
