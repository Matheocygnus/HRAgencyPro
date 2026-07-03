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
  ArrowRight,
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
    n: '01',
    title: 'Apply & Skills Assessment',
    desc: "Submit your application and basic information about your skills and experience. Complete a brief skills assessment to showcase your abilities.",
  },
  {
    n: '02',
    title: 'Profile Review & Matching',
    desc: "Our talent specialists review your profile and match you with opportunities that align with your skills, experience, and career goals.",
  },
  {
    n: '03',
    title: 'Interviews & Placement',
    desc: "Get introduced to vetted employers and complete the interview process. Our team supports you through every step, from preparation to offer.",
  },
  {
    n: '04',
    title: 'Start Working Remotely',
    desc: "Begin your remote career with ongoing support from our team. We help you navigate contracts, communication, and career development every step of the way.",
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
        <section className="bg-white px-6 py-20">
          <div className="mx-auto max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={VIEW}
              transition={{ duration: 0.5 }}
              className="mb-16 text-center"
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
              {/* Vertical connector line */}
              <div className="absolute left-8 top-8 hidden h-[calc(100%-4rem)] w-px bg-sky-100 lg:left-1/2 lg:block" />

              <div className="space-y-10">
                {steps.map((step, i) => (
                  <motion.div
                    key={step.n}
                    initial={{ opacity: 0, y: 28 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={VIEW}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    className={`relative flex items-start gap-6 lg:gap-0 ${
                      i % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
                    }`}
                  >
                    {/* Text side */}
                    <div
                      className={`flex-1 rounded-2xl border border-sky-100 bg-sky-50 p-6 ${
                        i % 2 === 0 ? 'lg:mr-16 lg:text-right' : 'lg:ml-16 lg:text-left'
                      }`}
                    >
                      <p className="mb-1 text-xs font-bold uppercase tracking-widest text-sky-500">
                        Step {step.n}
                      </p>
                      <h3 className="mb-2 text-lg font-extrabold text-[#0f2447]">{step.title}</h3>
                      <p className="text-sm leading-relaxed text-[#0f2447]/60">{step.desc}</p>
                    </div>

                    {/* Number circle — center on desktop, left on mobile */}
                    <div className="relative z-10 flex size-16 shrink-0 items-center justify-center rounded-full bg-[#0f2447] text-xl font-extrabold text-white shadow-lg shadow-[#0f2447]/20 lg:absolute lg:left-1/2 lg:-translate-x-1/2">
                      {step.n}
                    </div>

                    {/* Empty spacer for the other side (desktop) */}
                    <div className="hidden flex-1 lg:block" />
                  </motion.div>
                ))}
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={VIEW}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="mt-14 text-center"
            >
              <PopupButton
                id={TYPEFORM_ID}
                size={70}
                className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-[#0f2447] px-8 py-3.5 text-sm font-bold text-white shadow-md shadow-[#0f2447]/20 transition-opacity hover:opacity-90"
              >
                Start Your Application <ArrowRight size={15} />
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
              Ready to Start Your Remote Career?
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={VIEW}
              transition={{ duration: 0.45, delay: 0.08 }}
              className="mb-10 text-lg text-sky-200"
            >
              Join thousands of professionals who have already found rewarding remote opportunities through RemoteHero.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={VIEW}
              transition={{ duration: 0.4, delay: 0.15 }}
            >
              <PopupButton
                id={TYPEFORM_ID}
                size={70}
                className="cursor-pointer rounded-xl bg-sky-500 px-10 py-4 text-base font-bold text-white shadow-lg shadow-sky-500/30 transition-opacity hover:opacity-90"
              >
                Apply As Talent
              </PopupButton>
            </motion.div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  )
}
