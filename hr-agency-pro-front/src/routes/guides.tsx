import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import {
  Building2,
  User,
  Briefcase,
  Users,
  GraduationCap,
  Clock,
  Heart,
  DollarSign,
  Globe,
  ShieldCheck,
  Laptop,
  Wifi,
  TrendingUp,
  CreditCard,
  Star,
  MapPin,
} from 'lucide-react'
import { PopupButton } from '@typeform/embed-react'
import { PublicNavbar } from '../components/landing/PublicNavbar'
import { Footer } from '../components/landing/Footer'

export const Route = createFileRoute('/guides')({
  component: GuidesPage,
})

const VIEW = { once: true, margin: '-80px' } as const
const TYPEFORM_ID = 'aKI8I8lO'

const employerGuides = [
  {
    Icon: Building2,
    title: 'The Complete Guide to Hiring Remote Talent for Companies',
    desc: 'Learn how established businesses can build and manage global remote teams, from recruitment strategies to compliance considerations.',
  },
  {
    Icon: User,
    title: 'Remote Hiring Guide for Entrepreneurs',
    desc: 'Discover how startup founders and entrepreneurs can leverage remote talent to scale efficiently while maintaining lean operations.',
  },
  {
    Icon: Briefcase,
    title: "Solopreneur's Playbook for Remote Assistance",
    desc: 'Find out how individual business owners can delegate effectively to remote assistants and specialists to multiply productivity.',
  },
  {
    Icon: Users,
    title: 'Small Business Guide to Building Remote Teams',
    desc: 'Practical steps for small businesses transitioning to remote work models or expanding their team with international talent.',
  },
  {
    Icon: GraduationCap,
    title: 'Effective Onboarding for Remote Employees',
    desc: 'Best practices for creating a comprehensive onboarding process that integrates remote workers into your team culture and workflow.',
  },
  {
    Icon: Clock,
    title: 'Managing Teams Across Multiple Time Zones',
    desc: 'Strategies for coordinating work, meetings, and collaboration when your team spans different time zones around the world.',
  },
  {
    Icon: Heart,
    title: 'Building Company Culture with Distributed Teams',
    desc: 'How to foster a strong, cohesive company culture when your workforce is distributed across different locations and backgrounds.',
  },
  {
    Icon: DollarSign,
    title: 'Global Compensation Strategies for Remote Workers',
    desc: 'Navigate the complexities of compensating international remote workers fairly while remaining competitive and cost-effective.',
  },
  {
    Icon: Globe,
    title: 'International Compliance for Remote Employers',
    desc: 'Essential legal and tax considerations when hiring remote workers from different countries and jurisdictions.',
  },
  {
    Icon: ShieldCheck,
    title: 'Security Best Practices for Remote Teams',
    desc: 'How to maintain robust data security and protect sensitive information when your team works remotely across various locations.',
  },
]

const workerGuides = [
  {
    Icon: Star,
    title: 'How to Land Your First Remote Job',
    desc: 'A step-by-step roadmap for breaking into remote work — from crafting the perfect application to acing a video interview.',
  },
  {
    Icon: Laptop,
    title: 'Building Your Remote Work Setup',
    desc: 'Everything you need to create an ergonomic, productive home office that keeps you focused and professional on camera.',
  },
  {
    Icon: TrendingUp,
    title: 'Remote Work Productivity Mastery',
    desc: 'Proven frameworks and habits for staying deeply productive when your home is also your office — without burning out.',
  },
  {
    Icon: Wifi,
    title: 'Negotiating Remote Work Arrangements',
    desc: 'How to confidently negotiate salary, benefits, and flexibility with international employers for the compensation you deserve.',
  },
  {
    Icon: MapPin,
    title: 'Building Your Personal Brand Online',
    desc: 'Practical tactics for showcasing your skills on LinkedIn and beyond so top remote employers find you before you find them.',
  },
  {
    Icon: CreditCard,
    title: 'Managing Finances as a Remote Worker',
    desc: 'Smart financial strategies for managing multiple currencies, tax obligations, and savings goals as an international remote professional.',
  },
]

const tabs = ['For Employers', 'For Remote Workers'] as const
type Tab = (typeof tabs)[number]

function GuideCard({ Icon, title, desc, i }: { Icon: React.ElementType; title: string; desc: string; i: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={VIEW}
      transition={{ duration: 0.45, delay: (i % 3) * 0.08 }}
      whileHover={{ y: -5 }}
      className="group flex flex-col rounded-2xl border border-slate-100 bg-white p-7 shadow-sm transition-all duration-300 hover:border-sky-200 hover:shadow-xl hover:shadow-sky-50"
    >
      <div className="mb-5 flex size-12 items-center justify-center rounded-xl bg-sky-50 text-sky-500 transition-colors duration-300 group-hover:bg-sky-500 group-hover:text-white">
        <Icon size={22} />
      </div>
      <h3 className="mb-3 text-base font-extrabold leading-snug text-[#0f2447]">{title}</h3>
      <p className="mb-6 flex-1 text-sm leading-relaxed text-[#0f2447]/55">{desc}</p>
      <span className="inline-flex w-fit items-center rounded-full bg-slate-100 px-4 py-1.5 text-xs font-semibold text-slate-500">
        Coming Soon
      </span>
    </motion.div>
  )
}

function GuidesPage() {
  const [activeTab, setActiveTab] = useState<Tab>('For Employers')
  const guides = activeTab === 'For Employers' ? employerGuides : workerGuides

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <PublicNavbar />
      <main className="flex-1">

        {/* Hero */}
        <section className="bg-gradient-to-b from-sky-200 to-white px-6 pb-20 pt-20 lg:pb-28 lg:pt-28">
          <div className="mx-auto max-w-3xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="mb-4 inline-flex items-center gap-2 rounded-full bg-sky-100 px-4 py-1.5 text-sm font-semibold text-sky-700"
            >
              <GraduationCap size={14} />
              Resource Library
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.05 }}
              className="mb-5 text-4xl font-extrabold leading-tight tracking-tight text-[#0f2447] lg:text-6xl"
            >
              Remote Work{' '}
              <span className="text-sky-600">Guides</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.12 }}
              className="text-lg leading-relaxed text-[#0f2447]/65"
            >
              Comprehensive resources to help you navigate the world of remote work,
              whether you're hiring talent or building your remote career.
            </motion.p>
          </div>
        </section>

        {/* Tab + Cards */}
        <section className="bg-white px-6 pb-24 pt-4">
          <div className="mx-auto max-w-6xl">

            {/* Tab switcher */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="mb-12 flex justify-center"
            >
              <div className="relative flex rounded-2xl border border-slate-200 bg-slate-50 p-1.5">
                {tabs.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`relative z-10 rounded-xl px-7 py-2.5 text-sm font-bold transition-colors duration-200 ${
                      activeTab === tab ? 'text-white' : 'text-slate-500 hover:text-[#0f2447]'
                    }`}
                  >
                    {activeTab === tab && (
                      <motion.span
                        layoutId="tab-bg"
                        className="absolute inset-0 rounded-xl bg-[#0f2447]"
                        transition={{ type: 'spring', bounce: 0.2, duration: 0.45 }}
                      />
                    )}
                    <span className="relative">{tab}</span>
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Cards grid */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
              >
                {guides.map((g, i) => (
                  <GuideCard key={g.title} {...g} i={i} />
                ))}
              </motion.div>
            </AnimatePresence>

          </div>
        </section>

        {/* CTA */}
        <section className="bg-sky-50 px-6 py-20">
          <div className="mx-auto max-w-2xl text-center">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={VIEW}
              transition={{ duration: 0.5 }}
              className="mb-4 text-3xl font-extrabold tracking-tight text-[#0f2447] lg:text-4xl"
            >
              Need personalized guidance?
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={VIEW}
              transition={{ duration: 0.45, delay: 0.08 }}
              className="mb-10 text-lg leading-relaxed text-[#0f2447]/60"
            >
              Our team of remote work experts can provide customized advice for your specific
              situation, whether you're looking to hire remote talent or advance your remote career.
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
                className="cursor-pointer rounded-xl bg-[#0f2447] px-9 py-4 text-base font-bold text-white shadow-lg shadow-[#0f2447]/20 transition-opacity hover:opacity-90"
              >
                Schedule a Consultation
              </PopupButton>
              <a
                href="/contact"
                className="rounded-xl border-2 border-[#0f2447] px-9 py-4 text-base font-bold text-[#0f2447] transition-all hover:bg-[#0f2447] hover:text-white"
              >
                Contact Us
              </a>
            </motion.div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  )
}
