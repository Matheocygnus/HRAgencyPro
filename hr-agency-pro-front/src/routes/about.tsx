import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { motion } from 'motion/react'
import {
  Users, Globe, Award, TrendingUp, ArrowRight, CheckCircle2,
  MapPin, DollarSign, BadgeCheck, Bot, LayoutList, Plug, ShieldCheck,
} from 'lucide-react'
import { PublicNavbar } from '../components/landing/PublicNavbar'
import { Footer } from '../components/landing/Footer'
import { GetStartedModal } from '../components/how-it-works/GetStartedModal'

export const Route = createFileRoute('/about')({
  component: AboutPage,
})

const VIEW = { once: true, margin: '-80px' } as const

function AboutPage() {
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <div className="flex min-h-screen flex-col">
      <PublicNavbar />
      <main className="flex-1 bg-white">

        {/* ── Hero ─────────────────────────────────────────────────────── */}
        <section className="overflow-hidden bg-gradient-to-br from-slate-50 to-sky-50/40 px-6 py-20 lg:py-28">
          <div className="mx-auto max-w-7xl">
            <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">

              {/* Left: copy — animate on mount (above fold) */}
              <div>
                <motion.span
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="mb-5 inline-block rounded-full bg-sky-100 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-sky-700"
                >
                  Your Talent Acquisition Experts
                </motion.span>

                <motion.h1
                  initial={{ opacity: 0, y: 22 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.55, delay: 0.08 }}
                  className="mb-6 text-4xl font-extrabold leading-tight tracking-tight text-slate-900 lg:text-5xl"
                >
                  About Remote Hero —{' '}
                  <span className="text-sky-600">Your Remote Talent Acquisition Experts</span>
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.16 }}
                  className="mb-8 text-lg leading-relaxed text-slate-500"
                >
                  We simplify global hiring for companies across the US and Canada by providing
                  elite virtual assistants and remote professionals with the perfect skill sets for
                  your business needs. Our services include recruitment process outsourcing (RPO)
                  and direct hire &amp; placement, making your talent acquisition process seamless
                  and stress-free.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, delay: 0.24 }}
                >
                  <a
                    href="/services/rpo"
                    className="inline-flex items-center gap-2 rounded-xl bg-[#0f2447] px-7 py-3.5 text-base font-bold text-white shadow-md shadow-[#0f2447]/20 transition-opacity hover:opacity-90"
                  >
                    Explore Our Services <ArrowRight size={17} />
                  </a>
                </motion.div>
              </div>

              {/* Right: brand card */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.12 }}
                className="relative flex items-center justify-center"
              >
                <div className="absolute -right-12 -top-12 size-72 rounded-full bg-sky-100/60 blur-3xl" />
                <div className="absolute -bottom-8 -left-8 size-56 rounded-full bg-[#0f2447]/8 blur-3xl" />

                <div className="relative w-full max-w-sm rounded-3xl bg-gradient-to-br from-[#0f2447] to-[#1e3f7a] p-10 text-white shadow-2xl shadow-[#0f2447]/30">
                  <div className="mb-8 flex items-center gap-3">
                    <div className="flex size-12 items-center justify-center rounded-2xl bg-white/15">
                      <span className="text-2xl font-black tracking-tight">RH</span>
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-sky-300">Remote</p>
                      <p className="text-xl font-black tracking-tight">HERO</p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-4">
                    {[
                      { icon: CheckCircle2, text: 'RPO & Direct Hire Placement' },
                      { icon: Globe, text: 'Latin America & Caribbean Talent' },
                      { icon: TrendingUp, text: '50–70% Cost Savings vs US Hiring' },
                      { icon: Award, text: 'Top 5% Pre-Vetted Professionals' },
                      { icon: Users, text: 'US & Canada Businesses Served' },
                    ].map((item, i) => (
                      <motion.div
                        key={item.text}
                        initial={{ opacity: 0, x: 12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.35, delay: 0.4 + i * 0.08 }}
                        className="flex items-center gap-3"
                      >
                        <item.icon size={16} className="shrink-0 text-sky-400" />
                        <span className="text-sm text-slate-200">{item.text}</span>
                      </motion.div>
                    ))}
                  </div>

                  <div className="mt-8 rounded-xl bg-white/10 px-4 py-3">
                    <p className="text-xs font-semibold text-sky-300">Strategically based in</p>
                    <p className="text-base font-bold">Miami, Florida</p>
                  </div>
                </div>
              </motion.div>

            </div>
          </div>
        </section>

        {/* ── Mission ──────────────────────────────────────────────────── */}
        <section className="px-6 py-24">
          <div className="mx-auto max-w-6xl">

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={VIEW}
              transition={{ duration: 0.5 }}
              className="mb-16 text-center"
            >
              <h2 className="mb-6 text-3xl font-bold text-slate-900 lg:text-4xl">
                Our Mission: Revolutionizing{' '}
                <span className="text-sky-600">Remote Talent Acquisition</span>
              </h2>
              <p className="mx-auto max-w-3xl text-lg leading-relaxed text-slate-500">
                Remote Hero was founded with a clear mission: to connect US and Canadian businesses
                with exceptional virtual assistants and remote professionals while delivering
                50–70% cost savings. We specialize in sourcing top Latin American and Caribbean
                talent, leveraging their favorable time zones, strong English proficiency, and
                cultural compatibility to create the perfect outsourcing solution for businesses
                of all sizes.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  icon: MapPin,
                  title: 'The Remote Hero Bridge',
                  description:
                    'Strategically based in Miami, Florida, we serve as the perfect bridge between Latin America, the Caribbean, and the US — providing seamless connectivity and cultural alignment for businesses seeking global talent.',
                },
                {
                  icon: Globe,
                  title: 'Elite Offshore Talent Pool',
                  description:
                    'We source the top 5% of virtual assistants and remote professionals from Latin America and the Caribbean, offering perfect time zone alignment, cultural compatibility, and strong English proficiency.',
                },
                {
                  icon: DollarSign,
                  title: 'Significant Cost Savings',
                  description:
                    'Our remote staffing solutions deliver 50–70% savings on hiring costs. Access the same quality developers, virtual assistants, and customer service reps at a fraction of US-based talent costs.',
                },
                {
                  icon: BadgeCheck,
                  title: 'Pre-Vetted Talent Excellence',
                  description:
                    'Our rigorous vetting process ensures only the top 5% join our network. Every candidate undergoes skills assessment, language proficiency evaluation, and background verification.',
                },
              ].map((card, i) => (
                <motion.div
                  key={card.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={VIEW}
                  transition={{ duration: 0.45, delay: i * 0.1 }}
                  className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:border-sky-200 hover:shadow-lg"
                >
                  <div className="mb-5 flex size-12 items-center justify-center rounded-xl bg-[#0f2447] text-white transition-transform duration-300 group-hover:scale-110">
                    <card.icon size={22} />
                  </div>
                  <h3 className="mb-3 text-base font-bold text-slate-900">{card.title}</h3>
                  <p className="text-sm leading-relaxed text-slate-500">{card.description}</p>
                </motion.div>
              ))}
            </div>

          </div>
        </section>

        {/* ── Why Choose ───────────────────────────────────────────────── */}
        <section className="bg-slate-50 px-6 py-24">
          <div className="mx-auto max-w-6xl">

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={VIEW}
              transition={{ duration: 0.5 }}
              className="mb-16 text-center"
            >
              <h2 className="mb-6 text-3xl font-bold text-slate-900 lg:text-4xl">
                Why Choose Remote Hero For Your{' '}
                <span className="text-sky-600">Offshore Staffing Needs</span>
              </h2>
              <p className="mx-auto max-w-3xl text-lg leading-relaxed text-slate-500">
                {"We're not just another talent marketplace. We're your strategic partner in building high-performing remote teams of virtual assistants and specialized professionals from Latin America and beyond, creating the perfect global talent acquisition solution for your business."}
              </p>
            </motion.div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {[
                {
                  icon: Bot,
                  title: 'AI-Powered Talent Matching',
                  description:
                    'Our specialized matching technology identifies the perfect virtual assistants and remote professionals based on your specific requirements, ensuring optimal skill alignment, cultural fit, and long-term success with your offshore team.',
                },
                {
                  icon: LayoutList,
                  title: 'End-to-End Outsourcing Management',
                  description:
                    'Our comprehensive remote workforce management covers every aspect from talent screening to onboarding, payroll administration, and performance monitoring. We handle all the complexities of global hiring so you can focus on your core business.',
                },
                {
                  icon: Plug,
                  title: 'Seamless Integration',
                  description:
                    'Our talents are experienced in remote work and can integrate quickly with your existing teams and workflows, minimizing disruption and accelerating time-to-productivity.',
                },
                {
                  icon: ShieldCheck,
                  title: 'Risk-Free Guarantee',
                  description:
                    'We stand behind our talent with a replacement guarantee to ensure your complete satisfaction. If a placement does not work out within the guarantee window, we find you the right fit — at no additional cost.',
                },
              ].map((feat, i) => (
                <motion.div
                  key={feat.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={VIEW}
                  transition={{ duration: 0.45, delay: i * 0.08 }}
                  className="group flex gap-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:border-sky-200 hover:shadow-lg"
                >
                  <div className="shrink-0">
                    <div className="flex size-12 items-center justify-center rounded-xl bg-[#0f2447] text-white transition-transform duration-300 group-hover:scale-110">
                      <feat.icon size={22} />
                    </div>
                  </div>
                  <div>
                    <h3 className="mb-2 text-base font-bold text-slate-900">{feat.title}</h3>
                    <p className="text-sm leading-relaxed text-slate-500">{feat.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>

          </div>
        </section>

        {/* ── CTA Banner ───────────────────────────────────────────────── */}
        <section className="bg-[#0f2447] px-6 py-20">
          <div className="mx-auto max-w-3xl text-center">
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={VIEW}
              transition={{ duration: 0.5 }}
              className="mb-4 text-3xl font-bold text-white lg:text-4xl"
            >
              Ready to Hire Elite Virtual Assistants &amp; Remote Talent?
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={VIEW}
              transition={{ duration: 0.45, delay: 0.1 }}
              className="mb-8 text-lg leading-relaxed text-slate-300"
            >
              Schedule a discovery call to discuss your talent needs and learn how our offshore
              staffing solutions can help you build a high-performing remote team while saving
              50–70% on hiring costs.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={VIEW}
              transition={{ duration: 0.4, delay: 0.18 }}
              className="flex justify-center"
            >
              <a
                href="https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ3rsj860PQZ_X3IlSZEGb7BlVGKLseUeK8CKuBFA4YTvcgxDThlsxfoD0irpGZdv02GLrGENtw2"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl bg-sky-500 px-8 py-3.5 text-base font-bold text-white transition-colors hover:bg-sky-400"
              >
                Find Your Perfect Remote Talent
              </a>
            </motion.div>
          </div>
        </section>

      </main>
      <Footer />
      <GetStartedModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  )
}
