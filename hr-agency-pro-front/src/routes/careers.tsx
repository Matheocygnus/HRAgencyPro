import { createFileRoute } from '@tanstack/react-router'
import { motion } from 'motion/react'
import { Globe, Handshake, Eye, Wifi, TrendingUp, Gift, Rocket } from 'lucide-react'
import { PublicNavbar } from '../components/landing/PublicNavbar'
import { Footer } from '../components/landing/Footer'

export const Route = createFileRoute('/careers')({
  component: CareersPage,
})

const VIEW = { once: true, margin: '-80px' } as const
const AIRTABLE_URL = 'https://airtable.com/appOWPxckxVIjvMdu/pagnHiNvYtKCl8mqf/form'

const values = [
  {
    Icon: Globe,
    title: 'Global Perspective',
    desc: 'We embrace diversity and understand the unique strengths that professionals from different backgrounds bring to the table.',
  },
  {
    Icon: Handshake,
    title: 'Quality Connections',
    desc: "We're committed to making meaningful matches between talent and employers that create lasting professional relationships.",
  },
  {
    Icon: Eye,
    title: 'Transparent Approach',
    desc: 'We believe in honest communication and clear expectations for both clients and talent throughout the hiring process.',
  },
]

const perks = [
  {
    Icon: Wifi,
    title: 'Remote-First Culture',
    desc: 'We practice what we preach. Enjoy the flexibility and work-life balance of a fully remote position.',
  },
  {
    Icon: Rocket,
    title: 'Global Impact',
    desc: 'Help businesses grow while creating life-changing career opportunities for talented professionals worldwide.',
  },
  {
    Icon: TrendingUp,
    title: 'Growth Opportunities',
    desc: 'Develop your skills in a rapidly expanding company with plenty of room for advancement and specialization.',
  },
  {
    Icon: Gift,
    title: 'Competitive Benefits',
    desc: 'Enjoy competitive compensation, professional development opportunities, and a supportive team environment.',
  },
]

export function CareersPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <PublicNavbar />
      <main className="flex-1">

        {/* Hero */}
        <section className="bg-gradient-to-b from-sky-200 to-white px-6 pb-28 pt-20 lg:pb-36 lg:pt-28">
          <div className="mx-auto max-w-3xl text-center">
            <motion.h1
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55 }}
              className="mb-6 text-4xl font-extrabold leading-tight tracking-tight text-[#0f2447] lg:text-6xl"
            >
              Join Our
              <br />
              <span className="text-sky-600">Team</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mb-10 text-lg leading-relaxed text-[#0f2447]/70"
            >
              Looking to be part of a dynamic team that connects global talent with opportunities?
              Remote Hero is always seeking driven professionals to join our mission.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.2 }}
            >
              <a
                href={AIRTABLE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block rounded-xl bg-[#0f2447] px-10 py-4 text-base font-bold text-white shadow-lg shadow-[#0f2447]/20 transition-opacity hover:opacity-90"
              >
                Find a Job (Apply as a Remote Worker)
              </a>
            </motion.div>
          </div>
        </section>

        {/* Our Values */}
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
                Our Values
              </h2>
              <p className="text-lg text-[#0f2447]/60">
                The principles that guide{' '}
                <span className="text-sky-500">everything we do at Remote Hero</span>
              </p>
            </motion.div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              {values.map((v, i) => (
                <motion.div
                  key={v.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={VIEW}
                  transition={{ duration: 0.45, delay: i * 0.1 }}
                  whileHover={{ y: -4 }}
                  className="group rounded-2xl border border-sky-100 bg-sky-50 p-8 transition-all duration-300 hover:border-sky-200 hover:shadow-lg hover:shadow-sky-100"
                >
                  <div className="mb-5 flex size-12 items-center justify-center rounded-xl bg-sky-100 text-sky-600 transition-colors duration-300 group-hover:bg-sky-500 group-hover:text-white">
                    <v.Icon size={22} />
                  </div>
                  <h3 className="mb-3 text-lg font-extrabold text-[#0f2447]">{v.title}</h3>
                  <p className="text-sm leading-relaxed text-[#0f2447]/60">{v.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Why Join Remote Hero */}
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
                Why Join Remote Hero?
              </h2>
              <p className="text-lg text-[#0f2447]/60">
                Build a career that matters while{' '}
                <span className="text-sky-500">working alongside world-class talent</span>
              </p>
            </motion.div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {perks.map((p, i) => (
                <motion.div
                  key={p.title}
                  initial={{ opacity: 0, x: i % 2 === 0 ? -24 : 24 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={VIEW}
                  transition={{ duration: 0.5, delay: Math.floor(i / 2) * 0.1 }}
                  whileHover={{ y: -4 }}
                  className="group flex gap-5 rounded-2xl border border-sky-100 bg-white p-7 transition-all duration-300 hover:border-sky-200 hover:shadow-lg hover:shadow-sky-100"
                >
                  <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-sky-100 text-sky-600 transition-colors duration-300 group-hover:bg-sky-500 group-hover:text-white">
                    <p.Icon size={22} />
                  </div>
                  <div>
                    <h3 className="mb-2 text-base font-extrabold text-[#0f2447]">{p.title}</h3>
                    <p className="text-sm leading-relaxed text-[#0f2447]/60">{p.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={VIEW}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="mt-14 text-center"
            >
              <a
                href={AIRTABLE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block rounded-xl bg-[#0f2447] px-10 py-4 text-base font-bold text-white shadow-lg shadow-[#0f2447]/20 transition-opacity hover:opacity-90"
              >
                View Open Positions &amp; Apply
              </a>
            </motion.div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="bg-[#0f2447] px-6 py-20">
          <div className="mx-auto max-w-3xl text-center">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={VIEW}
              transition={{ duration: 0.5 }}
              className="mb-4 text-3xl font-extrabold tracking-tight text-white lg:text-4xl"
            >
              Ready to Make a Global Impact?
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={VIEW}
              transition={{ duration: 0.45, delay: 0.08 }}
              className="mb-10 text-lg text-sky-200"
            >
              Join the Remote Hero team and help us connect top global talent with the world's best companies.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={VIEW}
              transition={{ duration: 0.4, delay: 0.15 }}
            >
              <a
                href={AIRTABLE_URL}
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
