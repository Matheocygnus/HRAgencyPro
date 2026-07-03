import { createFileRoute } from '@tanstack/react-router'
import { motion } from 'motion/react'
import {
  Globe,
  DollarSign,
  Sparkles,
  ShieldCheck,
  Clock,
  Zap,
  CheckCircle2,
} from 'lucide-react'
import { PopupButton } from '@typeform/embed-react'
import { PublicNavbar } from '../components/landing/PublicNavbar'
import { Footer } from '../components/landing/Footer'

export const Route = createFileRoute('/for-agencies')({
  component: ForAgenciesPage,
})

const VIEW = { once: true, margin: '-80px' } as const
const TYPEFORM_ID = 'aKI8I8lO'
const CALENDAR_URL =
  'https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ3rsj860PQZ_X3IlSZEGb7BlVGKLseUeK8CKuBFA4YTvcgxDThlsxfoD0irpGZdv02GLrGENtw2'

const benefits = [
  {
    Icon: Globe,
    title: 'Expanded Talent Pool',
    desc: 'Access our extensive network of pre-vetted professionals from Latin America, the Caribbean, and the Philippines. Fill roles that might be challenging in your local market.',
  },
  {
    Icon: DollarSign,
    title: 'Cost-Effective Solutions',
    desc: 'Provide your clients with cost-saving options by leveraging offshore talent pools. Offer competitive solutions while maintaining quality and improving margins.',
  },
  {
    Icon: Sparkles,
    title: 'Specialized Expertise',
    desc: 'Fill niche technical roles for your clients with our specialized talent. We cover a wide range of roles from software development to digital marketing.',
  },
  {
    Icon: ShieldCheck,
    title: 'Quality Assurance',
    desc: 'Rest easy knowing all candidates go through our rigorous vetting process. We ensure English proficiency, technical skills, and reliability.',
  },
  {
    Icon: Clock,
    title: 'Fast Turnaround',
    desc: 'Speed up your client delivery with our efficient matching process. Access pre-vetted candidates quickly without lengthy sourcing delays.',
  },
  {
    Icon: Zap,
    title: 'White-Labeled Solutions',
    desc: 'Present our candidates as part of your own talent pool. We offer white-labeled services to seamlessly integrate with your brand.',
  },
]

const models = [
  {
    badge: 'Popular',
    title: 'White-Label Partnership',
    desc: 'Access our talent pool and present candidates as your own. We handle sourcing and vetting while you maintain the client relationship.',
    perks: [
      'Present candidates under your brand',
      'Flexible partnership structure',
      'Backend recruiting support',
      'Dedicated account manager',
    ],
    highlight: true,
  },
  {
    badge: null,
    title: 'Strategic Alliance',
    desc: 'Create a deeper integration between our organizations with shared resources, co-marketing initiatives, and joint client pitches.',
    perks: [
      'Joint client acquisition',
      'Dedicated talent acquisition team',
      'Co-branded marketing initiatives',
      'Customized partnership framework',
    ],
    highlight: false,
  },
]

function ForAgenciesPage() {
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
              Expand Your Staffing
              <br />
              <span className="text-sky-600">Agency's Capabilities</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mb-10 text-lg leading-relaxed text-[#0f2447]/70"
            >
              Partner with RemoteHero to access an expanded talent pool, fill specialized roles,
              and provide your clients with cost-effective remote staffing solutions.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.2 }}
            >
              <a
                href={CALENDAR_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block rounded-xl bg-[#0f2447] px-10 py-4 text-base font-bold text-white shadow-lg shadow-[#0f2447]/20 transition-opacity hover:opacity-90"
              >
                Become a Partner
              </a>
            </motion.div>
          </div>
        </section>

        {/* ── Agency Partnership Benefits ───────────────────────────────── */}
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
                Agency Partnership Benefits
              </h2>
              <p className="text-lg text-[#0f2447]/60">
                Enhance your capabilities and{' '}
                <span className="text-sky-500">generate additional revenue streams</span>
              </p>
            </motion.div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {benefits.map((b, i) => (
                <motion.div
                  key={b.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={VIEW}
                  transition={{ duration: 0.45, delay: (i % 3) * 0.09 }}
                  whileHover={{ y: -4 }}
                  className="group rounded-2xl border border-sky-100 bg-sky-50 p-7 transition-all duration-300 hover:border-sky-200 hover:shadow-lg hover:shadow-sky-100"
                >
                  <div className="mb-4 flex size-12 items-center justify-center rounded-xl bg-sky-100 text-sky-600 transition-colors duration-300 group-hover:bg-sky-500 group-hover:text-white">
                    <b.Icon size={22} />
                  </div>
                  <h3 className="mb-2 text-base font-bold text-[#0f2447]">{b.title}</h3>
                  <p className="text-sm leading-relaxed text-[#0f2447]/60">{b.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Partnership Models ────────────────────────────────────────── */}
        <section className="bg-sky-50 px-6 py-20">
          <div className="mx-auto max-w-5xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={VIEW}
              transition={{ duration: 0.5 }}
              className="mb-14 text-center"
            >
              <h2 className="mb-3 text-3xl font-extrabold tracking-tight text-[#0f2447] lg:text-4xl">
                Partnership Models
              </h2>
              <p className="text-lg text-[#0f2447]/60">
                Choose the collaboration approach that best suits your agency
              </p>
            </motion.div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {models.map((m, i) => (
                <motion.div
                  key={m.title}
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={VIEW}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  whileHover={{ y: -4 }}
                  className={`relative rounded-2xl border p-8 transition-all duration-300 hover:shadow-xl ${
                    m.highlight
                      ? 'border-sky-300 bg-white shadow-lg shadow-sky-100'
                      : 'border-sky-100 bg-white hover:shadow-sky-100'
                  }`}
                >
                  {m.badge && (
                    <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-[#0f2447] px-4 py-1 text-xs font-bold uppercase tracking-widest text-white">
                      {m.badge}
                    </span>
                  )}

                  <h3 className="mb-3 text-xl font-extrabold text-[#0f2447]">{m.title}</h3>
                  <p className="mb-6 text-sm leading-relaxed text-[#0f2447]/60">{m.desc}</p>

                  <ul className="mb-8 space-y-3">
                    {m.perks.map((perk) => (
                      <li key={perk} className="flex items-center gap-3 text-sm text-[#0f2447]/70">
                        <CheckCircle2 size={16} className="shrink-0 text-sky-500" />
                        {perk}
                      </li>
                    ))}
                  </ul>

                  <PopupButton
                    id={TYPEFORM_ID}
                    size={70}
                    className={`inline-flex w-full cursor-pointer items-center justify-center rounded-xl px-6 py-3.5 text-sm font-bold transition-all ${
                      m.highlight
                        ? 'bg-[#0f2447] text-white shadow-md shadow-[#0f2447]/20 hover:opacity-90'
                        : 'border border-[#0f2447] text-[#0f2447] hover:bg-[#0f2447] hover:text-white'
                    }`}
                  >
                    Learn More
                  </PopupButton>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Final CTA ────────────────────────────────────────────────── */}
        <section className="bg-[#0f2447] px-6 py-20">
          <div className="mx-auto max-w-5xl lg:flex lg:items-center lg:justify-between lg:gap-12">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={VIEW}
              transition={{ duration: 0.55 }}
              className="mb-8 lg:mb-0"
            >
              <h2 className="mb-3 text-3xl font-extrabold tracking-tight text-white lg:text-4xl">
                Ready to expand your agency's capabilities?
              </h2>
              <p className="text-lg text-sky-200">
                Partner with RemoteHero today and offer your clients access to high-quality global talent.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={VIEW}
              transition={{ duration: 0.55, delay: 0.1 }}
              className="shrink-0"
            >
              <a
                href={CALENDAR_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block rounded-xl border-2 border-white px-10 py-4 text-base font-bold text-white transition-all hover:bg-white hover:text-[#0f2447]"
              >
                Become a Partner
              </a>
            </motion.div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  )
}
