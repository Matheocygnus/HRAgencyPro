import { createFileRoute } from '@tanstack/react-router'
import { motion } from 'motion/react'
import {
  DollarSign,
  Clock,
  Globe,
  Users,
  ShieldCheck,
  Zap,
  CheckCircle2,
} from 'lucide-react'
import { PopupButton } from '@typeform/embed-react'
import { PublicNavbar } from '../components/landing/PublicNavbar'
import { Footer } from '../components/landing/Footer'

export const Route = createFileRoute('/for-talent')({
  component: ForTalentPage,
})

const VIEW = { once: true, margin: '-80px' } as const
const TYPEFORM_ID = 'aKI8I8lO'

const benefits = [
  {
    Icon: DollarSign,
    title: 'Competitive Compensation',
    desc: "Earn significantly higher rates than local markets while working with established US and international companies. Our positions offer stable income with reliable payment processes.",
  },
  {
    Icon: Clock,
    title: 'Work-Life Balance',
    desc: "Enjoy the flexibility of remote work while maintaining time zone alignment with US companies. No commuting means more time for family, hobbies, and personal growth.",
  },
  {
    Icon: Globe,
    title: 'Global Experience',
    desc: "Build an international career and expand your professional network beyond local boundaries. Gain valuable experience working with diverse teams across different markets.",
  },
  {
    Icon: Users,
    title: 'Career Growth',
    desc: "Access opportunities with innovative companies, from startups to established organizations. Develop new skills and advance your career by working on challenging international projects.",
  },
  {
    Icon: ShieldCheck,
    title: 'Vetted Employers',
    desc: "We partner only with legitimate, verified companies committed to fair employment practices. Our team ensures safe, secure opportunities with reliable employers.",
  },
  {
    Icon: Zap,
    title: 'Ongoing Support',
    desc: "Receive guidance throughout the hiring process and continued support after placement. Our team helps you navigate contracts, communication, and career development.",
  },
]

const skills = [
  {
    category: 'Software Development',
    items: ['JavaScript / TypeScript', 'React / Angular / Vue', 'Node.js / Python / Ruby', 'AWS / Azure / GCP', 'Mobile Development'],
  },
  {
    category: 'Marketing & Design',
    items: ['Digital Marketing', 'UI/UX Design', 'Content Marketing', 'Social Media', 'SEO/SEM'],
  },
  {
    category: 'Administrative Support',
    items: ['Virtual Assistance', 'Customer Support', 'Executive Assistance', 'Project Coordination', 'Data Entry'],
  },
  {
    category: 'Sales & Finance',
    items: ['Sales Development', 'Account Management', 'Bookkeeping', 'Accounting', 'Financial Analysis'],
  },
]

const steps = [
  {
    n: 1,
    title: 'Apply & Skills Assessment',
    desc: "Submit your application and basic information about your skills and experience. Complete a brief skills assessment to showcase your abilities.",
  },
  {
    n: 2,
    title: 'Initial Screening',
    desc: "If your profile matches our current openings, our recruitment team will schedule an initial screening call to learn more about your experience and career goals.",
  },
  {
    n: 3,
    title: 'Technical & Culture Assessment',
    desc: "Complete our comprehensive assessment process, which includes technical evaluations, English proficiency test, and culture fit interview.",
  },
  {
    n: 4,
    title: 'Client Matching & Interview',
    desc: "Once vetted, we match you with companies whose needs align with your skills. We'll prepare you for interviews with potential employers.",
  },
  {
    n: 5,
    title: 'Offer & Onboarding',
    desc: "Upon receiving an offer, we help negotiate terms and support you through the onboarding process with your new employer. Our team remains available for ongoing support.",
  },
]

function ForTalentPage() {
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
              Work with Top Global
              <br />
              <span className="text-sky-600">Companies Remotely</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mb-10 text-lg leading-relaxed text-[#0f2447]/70"
            >
              Join thousands of Remote Hero professionals from around the globe who have found
              rewarding remote opportunities with US and global companies through our platform.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.2 }}
            >
              <PopupButton
                id={TYPEFORM_ID}
                size={70}
                className="cursor-pointer rounded-xl bg-[#0f2447] px-10 py-4 text-base font-bold text-white shadow-lg shadow-[#0f2447]/20 transition-opacity hover:opacity-90"
              >
                Apply As Talent
              </PopupButton>
            </motion.div>
          </div>
        </section>

        {/* ── Benefits ─────────────────────────────────────────────────── */}
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
                Benefits of Working Through RemoteHero
              </h2>
              <p className="text-lg text-[#0f2447]/60">
                Join our talent network and{' '}
                <span className="text-sky-500">unlock exceptional remote opportunities</span>
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

        {/* ── Most In-Demand Skills ─────────────────────────────────────── */}
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
                Most In-Demand Skills
              </h2>
              <p className="text-lg text-[#0f2447]/60">
                Our clients are actively looking for professionals with these skills
              </p>
            </motion.div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {skills.map((s, i) => (
                <motion.div
                  key={s.category}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={VIEW}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                  className="rounded-2xl border border-sky-100 bg-white p-6"
                >
                  <h3 className="mb-3 text-sm font-bold text-[#0f2447]">{s.category}</h3>
                  <div className="mb-4 h-px bg-sky-100" />
                  <ul className="space-y-2.5">
                    {s.items.map((item) => (
                      <li key={item} className="flex items-center gap-2.5 text-sm text-[#0f2447]/70">
                        <CheckCircle2 size={14} className="shrink-0 text-sky-500" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── How It Works For Talent ───────────────────────────────────── */}
        <section className="bg-white px-6 py-24">
          <div className="mx-auto max-w-5xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={VIEW}
              transition={{ duration: 0.5 }}
              className="mb-20 text-center"
            >
              <h2 className="mb-3 text-3xl font-extrabold tracking-tight text-[#0f2447] lg:text-4xl">
                How It Works For Talent
              </h2>
              <p className="text-lg text-[#0f2447]/60">
                Our streamlined process helps you{' '}
                <span className="text-sky-500">find your perfect remote opportunity</span>
              </p>
            </motion.div>

            <div className="relative">
              {/* Vertical gradient line — desktop only */}
              <div className="absolute left-1/2 top-7 hidden h-[calc(100%-3.5rem)] w-0.5 -translate-x-1/2 bg-gradient-to-b from-sky-300 via-sky-200 to-sky-300 lg:block" />

              <div className="space-y-10">
                {steps.map((step, i) => (
                  <motion.div
                    key={step.n}
                    initial={{ opacity: 0, x: i % 2 === 0 ? -40 : 40 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={VIEW}
                    transition={{ duration: 0.55, delay: i * 0.08 }}
                    className="flex items-center gap-5 lg:gap-0"
                  >
                    {/* Left slot: desktop even = card, odd = empty */}
                    <div className="hidden flex-1 lg:block lg:pr-10">
                      {i % 2 === 0 && (
                        <div className="rounded-2xl border border-sky-100 bg-sky-50 p-6 text-right shadow-sm transition-shadow hover:shadow-md hover:shadow-sky-100">
                          <p className="mb-1 text-xs font-bold uppercase tracking-widest text-sky-500">Step {step.n}</p>
                          <h3 className="mb-2 text-lg font-extrabold text-[#0f2447]">{step.title}</h3>
                          <p className="text-sm leading-relaxed text-[#0f2447]/60">{step.desc}</p>
                        </div>
                      )}
                    </div>

                    {/* Number circle */}
                    <div className="relative z-10 flex size-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-sky-400 to-[#0f2447] text-xl font-extrabold text-white shadow-lg shadow-[#0f2447]/20 ring-4 ring-white">
                      {step.n}
                    </div>

                    {/* Right slot + mobile fallback */}
                    <div className="flex-1 lg:pl-10">
                      {/* Mobile: always visible */}
                      <div className="rounded-2xl border border-sky-100 bg-sky-50 p-6 shadow-sm transition-shadow hover:shadow-md hover:shadow-sky-100 lg:hidden">
                        <p className="mb-1 text-xs font-bold uppercase tracking-widest text-sky-500">Step {step.n}</p>
                        <h3 className="mb-2 text-lg font-extrabold text-[#0f2447]">{step.title}</h3>
                        <p className="text-sm leading-relaxed text-[#0f2447]/60">{step.desc}</p>
                      </div>
                      {/* Desktop: odd steps only */}
                      {i % 2 !== 0 && (
                        <div className="hidden rounded-2xl border border-sky-100 bg-sky-50 p-6 shadow-sm transition-shadow hover:shadow-md hover:shadow-sky-100 lg:block">
                          <p className="mb-1 text-xs font-bold uppercase tracking-widest text-sky-500">Step {step.n}</p>
                          <h3 className="mb-2 text-lg font-extrabold text-[#0f2447]">{step.title}</h3>
                          <p className="text-sm leading-relaxed text-[#0f2447]/60">{step.desc}</p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
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
              Ready to Start Your Remote Career?
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={VIEW}
              transition={{ duration: 0.45, delay: 0.08 }}
              className="mb-10 text-lg text-sky-200"
            >
              Join our talent network today and get matched with exciting remote opportunities.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={VIEW}
              transition={{ duration: 0.4, delay: 0.15 }}
            >
              <a
                href="https://airtable.com/appOWPxckxVIjvMdu/pagnHiNvYtKCl8mqf/form"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block rounded-xl bg-sky-500 px-10 py-4 text-base font-bold text-white shadow-lg shadow-sky-500/30 transition-opacity hover:opacity-90"
              >
                Apply Now
              </a>
            </motion.div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  )
}
