import { createFileRoute } from '@tanstack/react-router'
import { motion } from 'motion/react'
import {
  ShieldCheck,
  DollarSign,
  Clock,
  Languages,
  ClipboardCheck,
  Zap,
  CheckCircle2,
  ArrowRight,
  Calculator,
} from 'lucide-react'
import { PopupButton } from '@typeform/embed-react'
import { PublicNavbar } from '../components/landing/PublicNavbar'
import { Footer } from '../components/landing/Footer'

export const Route = createFileRoute('/for-employers')({
  component: ForEmployersPage,
})

const VIEW = { once: true, margin: '-80px' } as const
const TYPEFORM_ID = 'aKI8I8lO'
const TYPEFORM_URL = 'https://form.typeform.com/to/aKI8I8lO'

const features = [
  {
    Icon: ShieldCheck,
    title: 'Pre-Vetted Talent',
    desc: "Only 3% of applicants pass our rigorous screening process. We test for technical skills, English proficiency, and culture fit to ensure high-quality matches.",
  },
  {
    Icon: DollarSign,
    title: 'Cost Savings',
    desc: "Save 50-70% on talent costs compared to US-based hiring while maintaining exceptional quality. Our transparent pricing means no hidden fees or surprises.",
  },
  {
    Icon: Clock,
    title: 'Time Zone Aligned',
    desc: "Our talent pool is primarily in time zones aligned with North America, enabling seamless real-time collaboration and communication with your team.",
  },
  {
    Icon: Languages,
    title: 'English Proficiency',
    desc: "All our candidates undergo thorough English proficiency testing to ensure clear communication and effective collaboration with your existing team.",
  },
  {
    Icon: ClipboardCheck,
    title: 'No-Risk Hiring',
    desc: "Our replacement guarantee ensures your satisfaction. If a hire doesn't work out within the guarantee period, we'll find a replacement at no additional cost.",
  },
  {
    Icon: Zap,
    title: 'Fast Placement',
    desc: "Our efficient process gets you quality candidates in as little as 48 hours. Most clients complete full hires within 2-3 weeks from initial contact.",
  },
]

const checklist = [
  'Select from various roles and seniority levels',
  'Compare costs across different regions',
  'See transparent pricing and potential savings',
  'Build the ideal team structure for your budget',
]

const plans = [
  {
    badge: 'Most Popular',
    title: 'RPO Service',
    desc: "Our Recruitment Process Outsourcing service handles all aspects of finding and vetting candidates, allowing you to focus only on final interviews with pre-qualified talent.",
    perks: [
      'Full talent sourcing and screening',
      'Background and reference checks',
      'Fixed monthly rate',
      'Legal and compliance is taken care of',
      'Pre-vetted candidates only',
      '60-day replacement guarantee',
      'Ongoing support and guidance',
    ],
    cta: 'Learn About Our RPO Service',
    href: 'https://remotehero.us/services/rpo',
    highlight: true,
  },
  {
    badge: null,
    title: 'Direct Hire & Placement',
    desc: "For specialized or executive roles, our Direct Hire & Placement service provides a comprehensive search and selection process to find the perfect candidate.",
    perks: [
      'Executive and specialized talent search',
      'Custom candidate assessments',
      'In-depth interviews and evaluation',
      'One-time placement fee (20-25% of annual salary)',
      '60-day replacement guarantee',
    ],
    cta: 'Learn More',
    href: 'https://remotehero.us/services/direct-hire',
    highlight: false,
  },
]

const roles = [
  {
    category: 'Software Development',
    items: ['Front-End Developers', 'Back-End Developers', 'Full-Stack Engineers', 'Mobile App Developers', 'DevOps Engineers'],
  },
  {
    category: 'Marketing & Design',
    items: ['Digital Marketing Specialists', 'UI/UX Designers', 'Content Marketers', 'Social Media Managers', 'SEO Specialists'],
  },
  {
    category: 'Customer Support',
    items: ['Customer Support Representatives', 'Technical Support Specialists', 'Customer Success Managers', 'Support Team Leaders', 'Client Relations Specialists'],
  },
  {
    category: 'Administrative',
    items: ['Virtual Assistants', 'Executive Assistants', 'Project Coordinators', 'Administrative Specialists', 'Data Entry Specialists'],
  },
  {
    category: 'Sales & Business Development',
    items: ['Sales Representatives', 'Business Development Associates', 'Account Managers', 'Inside Sales Specialists', 'Sales Operations'],
  },
  {
    category: 'Finance & Accounting',
    items: ['Bookkeepers', 'Accountants', 'Financial Analysts', 'Accounts Payable/Receivable', 'Payroll Specialists'],
  },
]

function ForEmployersPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <PublicNavbar />
      <main className="flex-1">

        {/* ── Hero ─────────────────────────────────────────────────────── */}
        <section className="bg-gradient-to-b from-sky-200 to-white px-6 pb-28 pt-20 lg:pb-36 lg:pt-28">
          <div className="mx-auto max-w-3xl text-center">

            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="mb-6 inline-block rounded-full bg-sky-100 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-sky-700"
            >
              For Employers
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.08 }}
              className="mb-6 text-4xl font-extrabold leading-tight tracking-tight text-[#0f2447] lg:text-6xl"
            >
              Hire Elite Remote Talent
              <br />
              <span className="text-sky-500">Save up to 70% on Costs</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="mb-5 text-lg leading-relaxed text-[#0f2447]/70"
            >
              Access top-tier remote professionals from Latin America, the Caribbean, and the
              Philippines at a fraction of the cost. Get matched with pre-vetted talent that aligns
              with your business needs.
            </motion.p>

            <motion.a
              href="/services/rpo"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.22 }}
              className="mb-8 inline-flex items-center gap-1 text-sm font-medium text-sky-600 transition-colors hover:text-sky-700"
            >
              <ArrowRight size={14} />
              Learn about our nearshore staffing services
            </motion.a>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.28 }}
              className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
            >
              <PopupButton
                id={TYPEFORM_ID}
                size={70}
                className="cursor-pointer rounded-xl bg-[#0f2447] px-8 py-3.5 text-base font-bold text-white shadow-lg shadow-[#0f2447]/20 transition-opacity hover:opacity-90"
              >
                Get Started Now
              </PopupButton>
              <a
                href={TYPEFORM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl border-2 border-[#0f2447] px-8 py-3.5 text-base font-bold text-[#0f2447] transition-all hover:bg-[#0f2447] hover:text-white"
              >
                Book a Discovery Call
              </a>
            </motion.div>
          </div>
        </section>

        {/* ── Why Employers Choose RemoteHero ──────────────────────────── */}
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
                Why Employers Choose RemoteHero
              </h2>
              <p className="text-lg text-[#0f2447]/60">
                We make remote hiring efficient, cost-effective, and risk-free
              </p>
            </motion.div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((f, i) => (
                <motion.div
                  key={f.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={VIEW}
                  transition={{ duration: 0.45, delay: (i % 3) * 0.09 }}
                  whileHover={{ y: -4 }}
                  className="group rounded-2xl border border-sky-100 bg-sky-50 p-7 transition-all duration-300 hover:border-sky-200 hover:shadow-lg hover:shadow-sky-100"
                >
                  <div className="mb-4 flex size-12 items-center justify-center rounded-xl bg-sky-100 text-sky-600 transition-colors duration-300 group-hover:bg-sky-500 group-hover:text-white">
                    <f.Icon size={22} />
                  </div>
                  <h3 className="mb-2 text-base font-bold text-[#0f2447]">{f.title}</h3>
                  <p className="text-sm leading-relaxed text-[#0f2447]/60">{f.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Build Your Custom Remote Team ─────────────────────────────── */}
        <section className="bg-sky-50 px-6 py-20">
          <div className="mx-auto max-w-6xl">
            <div className="flex flex-col items-center gap-14 lg:flex-row lg:gap-20">

              {/* Left */}
              <motion.div
                initial={{ opacity: 0, x: -28 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={VIEW}
                transition={{ duration: 0.55 }}
                className="flex-1"
              >
                <h2 className="mb-4 text-3xl font-extrabold tracking-tight text-[#0f2447] lg:text-4xl">
                  Build Your Custom Remote Team
                </h2>
                <p className="mb-7 text-base leading-relaxed text-[#0f2447]/60">
                  Use our interactive Team Building Calculator to explore different team structures,
                  estimate costs, and visualize the potential savings of hiring through RemoteHero.
                </p>
                <ul className="mb-8 space-y-3">
                  {checklist.map((item) => (
                    <li key={item} className="flex items-center gap-3 text-sm text-[#0f2447]/80">
                      <CheckCircle2 size={17} className="shrink-0 text-sky-500" />
                      {item}
                    </li>
                  ))}
                </ul>
                <a
                  href="/tools/savings-calculator"
                  className="inline-flex items-center gap-2 rounded-xl bg-[#0f2447] px-7 py-3.5 text-sm font-bold text-white shadow-md shadow-[#0f2447]/20 transition-opacity hover:opacity-90"
                >
                  Try the Calculator <ArrowRight size={15} />
                </a>
              </motion.div>

              {/* Right — calculator preview card */}
              <motion.div
                initial={{ opacity: 0, x: 28 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={VIEW}
                transition={{ duration: 0.55, delay: 0.1 }}
                className="w-full max-w-sm lg:w-96 lg:shrink-0"
              >
                <div className="rounded-2xl border border-sky-100 bg-white p-8 shadow-xl shadow-sky-100/60">
                  <div className="mb-5 flex justify-center">
                    <div className="flex size-14 items-center justify-center rounded-2xl bg-sky-100">
                      <Calculator size={28} className="text-sky-600" />
                    </div>
                  </div>
                  <h3 className="mb-1 text-center text-lg font-bold text-[#0f2447]">
                    Team Building Calculator
                  </h3>
                  <p className="mb-6 text-center text-sm text-[#0f2447]/50">
                    Design your ideal remote team and get instant cost estimates based on roles,
                    experience levels, and regions.
                  </p>
                  <div className="space-y-3 rounded-xl bg-sky-50 p-5">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-[#0f2447]/70">US-Based Senior Developer</span>
                      <span className="font-semibold text-[#0f2447]">$130,000/yr</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-[#0f2447]/70">RemoteHero Senior Developer</span>
                      <span className="font-bold text-sky-600">$52,000/yr</span>
                    </div>
                    <div className="flex items-center justify-between border-t border-sky-100 pt-3 text-sm">
                      <span className="font-semibold text-[#0f2447]">Your Savings</span>
                      <span className="font-extrabold text-sky-600">$78,000/yr (60%)</span>
                    </div>
                  </div>
                </div>
              </motion.div>

            </div>
          </div>
        </section>

        {/* ── Flexible Hiring Solutions ────────────────────────────────── */}
        <section className="bg-white px-6 py-20">
          <div className="mx-auto max-w-5xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={VIEW}
              transition={{ duration: 0.5 }}
              className="mb-14 text-center"
            >
              <h2 className="mb-3 text-3xl font-extrabold tracking-tight text-[#0f2447] lg:text-4xl">
                Flexible Hiring Solutions
              </h2>
              <p className="text-lg text-[#0f2447]/60">
                Choose the hiring model that works best for your business needs
              </p>
            </motion.div>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
              {plans.map((plan, i) => (
                <motion.div
                  key={plan.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={VIEW}
                  transition={{ duration: 0.45, delay: i * 0.12 }}
                  className={`flex flex-col rounded-2xl border p-8 transition-shadow duration-300 hover:shadow-lg ${
                    plan.highlight
                      ? 'border-sky-200 bg-sky-50 hover:shadow-sky-100'
                      : 'border-sky-100 bg-white hover:shadow-sky-50'
                  }`}
                >
                  {plan.badge && (
                    <span className="mb-4 inline-block self-start rounded-full bg-sky-500 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white">
                      {plan.badge}
                    </span>
                  )}
                  <h3 className="mb-3 text-xl font-extrabold text-[#0f2447]">{plan.title}</h3>
                  <p className="mb-6 text-sm leading-relaxed text-[#0f2447]/60">{plan.desc}</p>
                  <ul className="mb-8 flex-1 space-y-3">
                    {plan.perks.map((perk) => (
                      <li key={perk} className="flex items-start gap-2.5 text-sm text-[#0f2447]/80">
                        <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-sky-500" />
                        {perk}
                      </li>
                    ))}
                  </ul>
                  <a
                    href={plan.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex w-full items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-sm font-bold transition-all ${
                      plan.highlight
                        ? 'bg-[#0f2447] text-white shadow-md shadow-[#0f2447]/20 hover:opacity-90'
                        : 'border-2 border-[#0f2447] text-[#0f2447] hover:bg-[#0f2447] hover:text-white'
                    }`}
                  >
                    {plan.cta} <ArrowRight size={14} />
                  </a>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Popular Roles We Fill ─────────────────────────────────────── */}
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
                Popular Roles We Fill
              </h2>
              <p className="text-lg text-[#0f2447]/60">
                We specialize in placing these high-demand positions
              </p>
            </motion.div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {roles.map((role, i) => (
                <motion.div
                  key={role.category}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={VIEW}
                  transition={{ duration: 0.4, delay: (i % 3) * 0.08 }}
                  whileHover={{ y: -3 }}
                  className="rounded-2xl border border-sky-100 bg-white p-6 transition-shadow duration-300 hover:shadow-md hover:shadow-sky-100"
                >
                  <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-sky-600">
                    {role.category}
                  </h3>
                  <ul className="space-y-2">
                    {role.items.map((item) => (
                      <li key={item} className="flex items-center gap-2.5 text-sm text-[#0f2447]/80">
                        <span className="size-1.5 shrink-0 rounded-full bg-sky-400" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={VIEW}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="mt-12 text-center"
            >
              <p className="mb-5 text-[#0f2447]/60">
                Don't see the role you're looking for? We can help with most professional remote positions.
              </p>
              <PopupButton
                id={TYPEFORM_ID}
                size={70}
                className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-[#0f2447] px-7 py-3.5 text-sm font-bold text-white shadow-md shadow-[#0f2447]/20 transition-opacity hover:opacity-90"
              >
                Contact Us <ArrowRight size={15} />
              </PopupButton>
            </motion.div>
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
              Ready to Scale Your Team Efficiently?
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={VIEW}
              transition={{ duration: 0.45, delay: 0.08 }}
              className="mb-10 text-lg text-sky-200"
            >
              Get started with RemoteHero today and tap into high-quality global talent at a fraction of the cost.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={VIEW}
              transition={{ duration: 0.4, delay: 0.15 }}
              className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
            >
              <PopupButton
                id={TYPEFORM_ID}
                size={70}
                className="cursor-pointer rounded-xl bg-sky-500 px-8 py-3.5 text-base font-bold text-white shadow-lg shadow-sky-500/30 transition-opacity hover:opacity-90"
              >
                Get Started Now
              </PopupButton>
              <a
                href={TYPEFORM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl border-2 border-white px-8 py-3.5 text-base font-bold text-white transition-all hover:bg-white hover:text-[#0f2447]"
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
