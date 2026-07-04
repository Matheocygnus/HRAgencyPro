import { createFileRoute } from '@tanstack/react-router'
import { motion } from 'motion/react'
import {
  Clock,
  Monitor,
  MessageSquare,
  Coffee,
  Users,
  BookOpen,
  Compass,
  BarChart2,
  Heart,
  Brain,
  Lightbulb,
  Zap,
  CheckCircle2,
} from 'lucide-react'
import { PublicNavbar } from '../components/landing/PublicNavbar'
import { Footer } from '../components/landing/Footer'

export const Route = createFileRoute('/remote-work-tips')({
  component: RemoteWorkTipsPage,
})

const VIEW = { once: true, margin: '-80px' } as const

const CALENDAR_URL =
  'https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ2UpOei0V8GAa6sYFiLO49OBQrFe2yiwB6JGXMGXUBIWB1zo2iunWj6GS5hJJBeP_h8G3AFT0hg'

const tips = [
  {
    Icon: Clock,
    title: 'Establish a Consistent Schedule',
    desc: 'Set regular working hours that align with your team and stick to them. A predictable routine helps maintain work-life boundaries and improves collaboration with colleagues in different time zones.',
  },
  {
    Icon: Monitor,
    title: 'Create a Dedicated Workspace',
    desc: 'Designate a specific area in your home exclusively for work. This helps mentally separate work from personal life and minimizes distractions, leading to better focus and productivity.',
  },
  {
    Icon: MessageSquare,
    title: 'Overcommunicate',
    desc: 'Without in-person cues, being extra clear in written and verbal communication is crucial. Proactively share updates, ask specific questions, and confirm understanding to avoid misinterpretations.',
  },
  {
    Icon: Coffee,
    title: 'Take Regular Breaks',
    desc: 'Schedule short breaks throughout your day using techniques like the Pomodoro method (25 minutes of work followed by a 5-minute break). This maintains energy levels and prevents burnout.',
  },
  {
    Icon: Users,
    title: 'Build Relationships Intentionally',
    desc: 'Without spontaneous office interactions, you need to deliberately foster connections. Schedule virtual coffee chats, participate in team-building activities, and make time for casual conversations.',
  },
  {
    Icon: BookOpen,
    title: 'Document Everything',
    desc: 'Maintain thorough documentation of processes, decisions, and project updates. This creates a knowledge repository that makes asynchronous work efficient and onboarding new team members easier.',
  },
  {
    Icon: Compass,
    title: 'Set Clear Expectations',
    desc: 'Define deliverables, timelines, and availability with your team and managers. Clear expectations reduce anxiety and help everyone work together more effectively across different locations.',
  },
  {
    Icon: BarChart2,
    title: 'Focus on Results, Not Hours',
    desc: 'Remote work shifts the focus from time spent to outcomes achieved. Track your productivity by completed tasks and goals rather than hours logged, and advocate for this approach with your team.',
  },
  {
    Icon: Heart,
    title: 'Prioritize Your Health',
    desc: 'Schedule time for physical activity, proper nutrition, and sufficient sleep. Remote work can blur work-life boundaries, making it crucial to deliberately care for your physical and mental wellbeing.',
  },
  {
    Icon: Brain,
    title: 'Embrace Asynchronous Work',
    desc: "Leverage the flexibility of remote work by designing workflows that don't require immediate responses. Use collaboration tools that allow team members to contribute on their own schedules.",
  },
  {
    Icon: Lightbulb,
    title: 'Continuous Learning',
    desc: 'Remote work requires ongoing skill development. Stay current with industry trends, improve your digital communication skills, and learn new collaboration tools to remain effective in a remote environment.',
  },
  {
    Icon: Zap,
    title: 'Optimize Your Technology',
    desc: 'Invest in reliable internet, proper ergonomic equipment, and useful productivity tools. The right tech setup eliminates frustration and significantly improves your remote work experience.',
  },
]

const cultureItems = [
  'Establish clear communication protocols and expectations for team members across time zones',
  'Invest in the right collaboration tools and ensure everyone knows how to use them effectively',
  'Create opportunities for social connection through virtual team-building activities',
  'Develop a results-oriented performance evaluation system rather than focusing on hours worked',
  'Provide stipends or allowances for home office setup and necessary equipment',
]

function RemoteWorkTipsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <PublicNavbar />
      <main className="flex-1">

        {/* Hero */}
        <section className="bg-gradient-to-b from-sky-200 to-white px-6 pb-20 pt-20 lg:pb-28 lg:pt-28">
          <div className="mx-auto max-w-3xl text-center">
            <motion.h1
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55 }}
              className="mb-5 text-4xl font-extrabold leading-tight tracking-tight text-[#0f2447] lg:text-6xl"
            >
              Remote Work <span className="text-sky-600">Tips</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-lg leading-relaxed text-[#0f2447]/65"
            >
              Master the art of working remotely with these practical strategies that boost
              productivity, maintain work-life balance, and foster meaningful connections
              with your team.
            </motion.p>
          </div>
        </section>

        {/* Tips grid */}
        <section className="bg-white px-6 pb-24 pt-4">
          <div className="mx-auto max-w-6xl">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {tips.map((tip, i) => (
                <motion.div
                  key={tip.title}
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={VIEW}
                  transition={{ duration: 0.45, delay: (i % 3) * 0.08 }}
                  whileHover={{ y: -5, boxShadow: '0 20px 40px -12px rgba(14,165,233,0.15)' }}
                  className="group flex flex-col rounded-2xl border border-slate-100 bg-white p-7 shadow-sm transition-all duration-300 hover:border-sky-200"
                >
                  <div className="mb-5 flex size-11 items-center justify-center rounded-xl bg-sky-50 text-sky-500 transition-colors duration-300 group-hover:bg-sky-500 group-hover:text-white">
                    <tip.Icon size={20} />
                  </div>
                  <h3 className="mb-3 text-base font-extrabold leading-snug text-[#0f2447]">
                    {tip.title}
                  </h3>
                  <p className="flex-1 text-sm leading-relaxed text-[#0f2447]/55">{tip.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Building a Remote Work Culture */}
        <section className="bg-sky-50 px-6 py-20">
          <div className="mx-auto max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={VIEW}
              transition={{ duration: 0.55 }}
              className="rounded-3xl border border-sky-100 bg-white p-10 shadow-sm shadow-sky-100 lg:p-14"
            >
              <h2 className="mb-4 text-2xl font-extrabold tracking-tight text-[#0f2447] lg:text-3xl">
                Building a Remote Work Culture at Your Company
              </h2>
              <p className="mb-8 text-base leading-relaxed text-[#0f2447]/60">
                At Remote Hero, we don't just connect businesses with remote talent—we help build
                successful remote work cultures. Here are some organization-level strategies to
                make remote work effective:
              </p>
              <ul className="space-y-4">
                {cultureItems.map((item, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={VIEW}
                    transition={{ duration: 0.4, delay: i * 0.07 }}
                    className="flex items-start gap-3 text-sm leading-relaxed text-[#0f2447]/70"
                  >
                    <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-sky-500" />
                    {item}
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="bg-white px-6 py-24">
          <div className="mx-auto max-w-3xl text-center">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={VIEW}
              transition={{ duration: 0.5 }}
              className="mb-4 text-3xl font-extrabold tracking-tight text-[#0f2447] lg:text-4xl"
            >
              Need Help Building Your Remote Team?
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={VIEW}
              transition={{ duration: 0.45, delay: 0.08 }}
              className="mb-10 text-lg leading-relaxed text-[#0f2447]/60"
            >
              Remote Hero connects businesses with exceptional remote talent from Latin America,
              the Caribbean, and the Philippines. Our professionals are vetted for both skills
              and remote work readiness.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={VIEW}
              transition={{ duration: 0.4, delay: 0.15 }}
              className="flex flex-col items-center justify-center gap-4 sm:flex-row"
            >
              <a
                href={CALENDAR_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl bg-[#0f2447] px-9 py-4 text-base font-bold text-white shadow-lg shadow-[#0f2447]/20 transition-opacity hover:opacity-90"
              >
                Schedule a Discovery Call
              </a>
              <a
                href="/services/rpo"
                className="rounded-xl border-2 border-slate-200 bg-slate-50 px-9 py-4 text-base font-bold text-[#0f2447] transition-all hover:border-[#0f2447] hover:bg-white"
              >
                Learn About Our Services
              </a>
            </motion.div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  )
}
