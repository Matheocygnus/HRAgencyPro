import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { motion } from 'motion/react'
import { Users, Globe, Award, TrendingUp, Zap, Shield, Heart, Handshake, Star } from 'lucide-react'
import { PublicNavbar } from '../components/landing/PublicNavbar'
import { Footer } from '../components/landing/Footer'
import { GetStartedModal } from '../components/how-it-works/GetStartedModal'

export const Route = createFileRoute('/about')({
  component: AboutPage,
})

const stats = [
  { value: '300+', label: 'Companies Served', icon: Users },
  { value: '1,200+', label: 'Professionals Placed', icon: Star },
  { value: '20+', label: 'Countries of Talent', icon: Globe },
  { value: '96%', label: 'Client Satisfaction', icon: Award },
]

const values = [
  {
    icon: Star,
    title: 'Quality First',
    description: 'Every candidate passes a rigorous multi-stage vetting process. Only the top 3% of applicants make it to your shortlist.',
  },
  {
    icon: Zap,
    title: 'Speed & Efficiency',
    description: 'First shortlisted candidates delivered within 3–5 business days. We respect your time and your team\'s momentum.',
  },
  {
    icon: Shield,
    title: 'Radical Transparency',
    description: 'No hidden fees, honest timelines, and open communication at every step. You always know exactly where things stand.',
  },
  {
    icon: TrendingUp,
    title: 'Long-term Partnerships',
    description: 'We measure success by your team\'s performance and retention — not by the number of placements we close.',
  },
  {
    icon: Heart,
    title: 'Cultural Alignment',
    description: 'We match not just skills but work style, values, and communication approach. Culture fit is non-negotiable.',
  },
  {
    icon: Handshake,
    title: 'Continuous Support',
    description: '90-day replacement guarantee and ongoing post-placement support. Our relationship doesn\'t end at hire.',
  },
]

function AboutPage() {
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <div className="flex min-h-screen flex-col">
      <PublicNavbar />
      <main className="flex-1 bg-white">

        {/* ── Hero ─────────────────────────────────────────── */}
        <section className="bg-gradient-to-br from-slate-50 to-sky-50/40 px-6 py-24 lg:py-32">
          <div className="mx-auto max-w-4xl text-center">
            <motion.span
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              className="mb-6 inline-block rounded-full bg-sky-100 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-sky-700"
            >
              Our Mission
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.08 }}
              className="mb-6 text-4xl font-extrabold tracking-tight text-slate-900 lg:text-6xl"
            >
              Building the Future{' '}
              <span className="text-sky-600">of Global Work</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="mx-auto max-w-2xl text-lg leading-relaxed text-slate-500"
            >
              We connect US companies with top remote professionals from Latin America, the Caribbean,
              the Philippines, and Europe — delivering exceptional talent at 50–70% lower cost than
              equivalent US-based hires.
            </motion.p>
          </div>
        </section>

        {/* ── Stats ────────────────────────────────────────── */}
        <section className="border-b border-slate-100 px-6 py-16">
          <div className="mx-auto max-w-5xl">
            <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
              {stats.map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, delay: i * 0.1 }}
                  className="text-center"
                >
                  <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-2xl bg-sky-50 text-sky-600">
                    <s.icon size={22} />
                  </div>
                  <p className="text-3xl font-black text-[#0f2447] lg:text-4xl">{s.value}</p>
                  <p className="mt-1 text-sm font-medium text-slate-500">{s.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Our Story ────────────────────────────────────── */}
        <section className="px-6 py-24">
          <div className="mx-auto max-w-6xl">
            <div className="grid grid-cols-1 gap-16 lg:grid-cols-2 lg:items-center">

              {/* Left: text */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.55 }}
              >
                <span className="mb-4 inline-block rounded-full bg-sky-100 px-3 py-1 text-xs font-bold uppercase tracking-widest text-sky-700">
                  Our Story
                </span>
                <h2 className="mb-6 text-3xl font-bold text-slate-900 lg:text-4xl">
                  Why We Built Remote Hero
                </h2>
                <div className="space-y-4 text-slate-600 leading-relaxed">
                  <p>
                    Remote Hero was founded by a team of HR and technology professionals who experienced
                    firsthand the frustration of the talent gap. US companies were overpaying for talent
                    while exceptional professionals around the world were underemployed or underutilized.
                  </p>
                  <p>
                    We built Remote Hero to fix that mismatch. By combining a rigorous vetting process
                    with deep regional expertise, we're able to consistently deliver candidates that not
                    only have the technical skills, but also the communication, work ethic, and cultural
                    alignment that make remote teams thrive.
                  </p>
                  <p>
                    Today, we help companies of all sizes — from early-stage startups to established
                    enterprises — build high-performing remote teams that scale with their ambition.
                  </p>
                </div>
              </motion.div>

              {/* Right: decorative card */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.55, delay: 0.1 }}
                className="rounded-3xl bg-gradient-to-br from-[#0f2447] to-[#1a3a6e] p-10 text-white"
              >
                <p className="mb-8 text-sm font-bold uppercase tracking-widest text-sky-300">
                  Our Commitment
                </p>
                <div className="space-y-6">
                  {[
                    { num: '01', text: 'Rigorously vet every candidate before you see them' },
                    { num: '02', text: 'Deliver your first shortlist within 3–5 business days' },
                    { num: '03', text: 'Guarantee a 90-day replacement if the hire doesn\'t work out' },
                    { num: '04', text: 'Provide ongoing support long after placement' },
                  ].map((item) => (
                    <div key={item.num} className="flex gap-4">
                      <span className="shrink-0 text-2xl font-black text-sky-400">{item.num}</span>
                      <p className="text-base text-slate-200">{item.text}</p>
                    </div>
                  ))}
                </div>
              </motion.div>

            </div>
          </div>
        </section>

        {/* ── Values ───────────────────────────────────────── */}
        <section className="bg-slate-50 px-6 py-24">
          <div className="mx-auto max-w-6xl">
            <div className="mb-16 text-center">
              <span className="mb-4 inline-block rounded-full bg-sky-100 px-3 py-1 text-xs font-bold uppercase tracking-widest text-sky-700">
                What We Stand For
              </span>
              <h2 className="text-3xl font-bold text-slate-900 lg:text-4xl">Our Core Values</h2>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {values.map((v, i) => (
                <motion.div
                  key={v.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                  className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-md hover:border-sky-200"
                >
                  <div className="mb-4 flex size-11 items-center justify-center rounded-xl bg-sky-50 text-sky-600 transition-colors duration-300 group-hover:bg-sky-100">
                    <v.icon size={22} />
                  </div>
                  <h3 className="mb-2 text-base font-bold text-slate-900">{v.title}</h3>
                  <p className="text-sm leading-relaxed text-slate-500">{v.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA Banner ───────────────────────────────────── */}
        <section className="bg-[#0f2447] px-6 py-20">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-4 text-3xl font-bold text-white lg:text-4xl">
              Ready to build your remote team?
            </h2>
            <p className="mb-8 text-slate-300">
              Join 300+ companies that trust Remote Hero to find their next great hire.
            </p>
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <button
                onClick={() => setModalOpen(true)}
                className="rounded-xl bg-sky-500 px-8 py-3.5 text-base font-bold text-white transition-colors hover:bg-sky-400"
              >
                Get Started Today
              </button>
              <a
                href="/how-it-works"
                className="rounded-xl border border-white/30 px-8 py-3.5 text-base font-semibold text-white transition-colors hover:bg-white/10"
              >
                See How It Works
              </a>
            </div>
          </div>
        </section>

      </main>
      <Footer />
      <GetStartedModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  )
}
