import { Card } from '@heroui/react'
import { CalendarCheck, Users, Clock, Briefcase, ShieldCheck, TrendingUp } from 'lucide-react'
import { motion } from 'motion/react'

const benefits = [
  {
    icon: CalendarCheck,
    title: 'Predictable Monthly Cost',
    description: "Know exactly what you'll spend each month with our flat-rate pricing.",
  },
  {
    icon: Users,
    title: 'Consistent Candidate Flow',
    description: 'Never run out of candidates with our ongoing delivery model.',
  },
  {
    icon: Clock,
    title: 'Saves Internal Time',
    description: 'Free up your team to focus on interviews and core business tasks.',
  },
  {
    icon: Briefcase,
    title: 'Flexible Hiring',
    description: 'Works great for single roles or multi-role hiring campaigns.',
  },
  {
    icon: ShieldCheck,
    title: 'Low Commitment',
    description: 'Perfect before committing to full RPO or Direct Hire services.',
  },
  {
    icon: TrendingUp,
    title: 'Scale as You Grow',
    description: 'Easily adjust volume up or down based on your hiring needs.',
  },
]

export function ResumeSourcingBenefits() {
  return (
    <section className="bg-slate-50 py-24">
      <div className="mx-auto max-w-7xl px-6">

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-16 text-center text-4xl font-bold text-slate-900"
        >
          Why Resume Sourcing
        </motion.h2>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {benefits.map((benefit, i) => {
            const Icon = benefit.icon
            return (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
              >
                <Card className="h-full bg-white p-8 shadow-sm">
                  <div className="mb-4 flex items-center gap-3">
                    <Icon size={20} className="shrink-0 text-sky-600" strokeWidth={1.75} />
                    <p className="font-bold text-slate-900">{benefit.title}</p>
                  </div>
                  <p className="leading-relaxed text-slate-500">{benefit.description}</p>
                </Card>
              </motion.div>
            )
          })}
        </div>

      </div>
    </section>
  )
}
