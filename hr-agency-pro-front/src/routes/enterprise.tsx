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
  Briefcase,
  LayoutGrid,
  Map,
  Search,
} from 'lucide-react'
import { PopupButton } from '@typeform/embed-react'
import { PublicNavbar } from '../components/landing/PublicNavbar'
import { Footer } from '../components/landing/Footer'

export const Route = createFileRoute('/enterprise')({
  component: EnterprisePage,
})

const VIEW = { once: true, margin: '-80px' } as const
const TYPEFORM_ID = 'aKI8I8lO'
const CALENDAR_URL =
  'https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ3rsj860PQZ_X3IlSZEGb7BlVGKLseUeK8CKuBFA4YTvcgxDThlsxfoD0irpGZdv02GLrGENtw2'

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

const solutions = [
  {
    Icon: Briefcase,
    title: 'Enterprise RPO',
    desc: 'Our enterprise-grade Recruitment Process Outsourcing service is designed for high-volume, ongoing talent acquisition needs across multiple departments or regions.',
    perks: [
      'Dedicated enterprise account team',
      'High-volume hiring capabilities',
      'Custom recruiting workflows',
      'Advanced reporting and analytics',
      'Integration with your HRIS/ATS',
    ],
  },
  {
    Icon: Globe,
    title: 'Global Workforce Management',
    desc: 'End-to-end solutions for building and managing distributed teams across international borders, including compliance, payroll, and operational support.',
    perks: [
      'Multi-country employment solutions',
      'Compliant contracts and payments',
      'Global payroll management',
      'Benefits administration',
      'Ongoing support and retention',
    ],
  },
  {
    Icon: Map,
    title: 'Strategic Workforce Planning',
    desc: 'Partner with our experts to develop comprehensive global talent strategies aligned with your business objectives, cost targets, and growth plans.',
    perks: [
      'Workforce needs assessment',
      'Global talent market insights',
      'Cost optimization strategies',
      'Long-term talent roadmapping',
      'Risk management planning',
    ],
  },
  {
    Icon: Search,
    title: 'Executive Search',
    desc: 'Specialized talent acquisition for C-suite, senior leadership, and key strategic roles across global markets with a focus on cultural alignment and long-term retention.',
    perks: [
      'Senior executive placement',
      'Comprehensive leadership assessment',
      'Cultural alignment evaluation',
      'Competitive market analysis',
      'Extended placement guarantee',
    ],
  },
]

const approachSteps = [
  {
    n: 1,
    title: 'Discovery & Needs Assessment',
    desc: "We begin with a thorough understanding of your enterprise's unique requirements, goals, and challenges.",
  },
  {
    n: 2,
    title: 'Strategic Planning',
    desc: 'Our team develops a customized enterprise solution that aligns with your business objectives and budget.',
  },
  {
    n: 3,
    title: 'Implementation & Management',
    desc: 'We execute the plan and handle all aspects of talent acquisition, compliance, and onboarding.',
  },
  {
    n: 4,
    title: 'Ongoing Support & Optimization',
    desc: 'Continuous improvement through regular reviews, analytics, and program refinements for long-term success.',
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
                href="https://form.typeform.com/to/aKI8I8lO"
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

        {/* ── Comprehensive Enterprise Solutions ────────────────────────── */}
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
                Comprehensive Enterprise Solutions
              </h2>
              <p className="text-lg text-[#0f2447]/60">
                Custom talent solutions designed for enterprise-scale requirements
              </p>
            </motion.div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {solutions.map((s, i) => (
                <motion.div
                  key={s.title}
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={VIEW}
                  transition={{ duration: 0.5, delay: (i % 2) * 0.1 }}
                  whileHover={{ y: -4 }}
                  className="flex flex-col rounded-2xl border border-sky-100 bg-white p-8 transition-all duration-300 hover:border-sky-200 hover:shadow-xl hover:shadow-sky-100"
                >
                  <div className="mb-5 flex size-12 items-center justify-center rounded-xl bg-sky-100 text-sky-600">
                    <s.Icon size={22} />
                  </div>
                  <h3 className="mb-3 text-xl font-extrabold text-[#0f2447]">{s.title}</h3>
                  <p className="mb-6 text-sm leading-relaxed text-[#0f2447]/60">{s.desc}</p>
                  <ul className="mb-8 flex-1 space-y-2.5">
                    {s.perks.map((perk) => (
                      <li key={perk} className="flex items-center gap-3 text-sm text-[#0f2447]/70">
                        <CheckCircle2 size={15} className="shrink-0 text-sky-500" />
                        {perk}
                      </li>
                    ))}
                  </ul>
                  <PopupButton
                    id={TYPEFORM_ID}
                    size={70}
                    className="inline-flex w-full cursor-pointer items-center justify-center rounded-xl bg-[#0f2447] px-6 py-3.5 text-sm font-bold text-white shadow-md shadow-[#0f2447]/20 transition-opacity hover:opacity-90"
                  >
                    Learn More
                  </PopupButton>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Client Testimonial ────────────────────────────────────────── */}
        <section className="bg-white px-6 py-20">
          <div className="mx-auto max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={VIEW}
              transition={{ duration: 0.5 }}
              className="mb-12 text-center"
            >
              <h2 className="mb-3 text-3xl font-extrabold tracking-tight text-[#0f2447] lg:text-4xl">
                Client Testimonials
              </h2>
              <p className="text-lg text-[#0f2447]/60">
                What our enterprise clients say about working with RemoteHero
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={VIEW}
              transition={{ duration: 0.55 }}
              className="rounded-2xl bg-[#0f2447] px-10 py-12 text-center"
            >
              <p className="mb-8 text-xl font-semibold italic leading-relaxed text-white lg:text-2xl">
                "RemoteHero transformed our global hiring strategy. We found exceptional talent faster and at a significant cost advantage."
              </p>
              <div className="flex items-center justify-center gap-4">
                <div className="flex size-12 items-center justify-center rounded-full bg-sky-500 text-sm font-bold text-white">
                  PT
                </div>
                <div className="text-left">
                  <p className="font-bold text-white">Perla Tapiero</p>
                  <p className="text-sm text-sky-300">CEO of Chai Mazel</p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── Our Enterprise Approach ───────────────────────────────────── */}
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
                Our Enterprise Approach
              </h2>
              <p className="text-lg text-[#0f2447]/60">
                A strategic partnership from initial consultation through ongoing support
              </p>
            </motion.div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {approachSteps.map((step, i) => (
                <motion.div
                  key={step.n}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={VIEW}
                  transition={{ duration: 0.45, delay: i * 0.1 }}
                  className="rounded-2xl border border-sky-100 bg-white p-6"
                >
                  <div className="mb-4 flex size-10 items-center justify-center rounded-full bg-gradient-to-br from-sky-400 to-[#0f2447] text-sm font-extrabold text-white shadow-md shadow-[#0f2447]/20">
                    {step.n}
                  </div>
                  <h3 className="mb-2 text-base font-extrabold text-[#0f2447]">{step.title}</h3>
                  <p className="text-sm leading-relaxed text-[#0f2447]/60">{step.desc}</p>
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
              Ready to scale your enterprise with global talent?
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={VIEW}
              transition={{ duration: 0.45, delay: 0.08 }}
              className="mb-10 text-lg text-sky-200"
            >
              Get in touch with our enterprise solutions team to discuss your specific needs and discover how RemoteHero can transform your global workforce strategy.
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
                Schedule a Consultation
              </PopupButton>
              <a
                href={CALENDAR_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl border-2 border-white px-9 py-4 text-base font-bold text-white transition-all hover:bg-white hover:text-[#0f2447]"
              >
                Book Discovery Call
              </a>
            </motion.div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  )
}
