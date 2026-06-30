import { Card } from '@heroui/react'
import { FileText, Users, Clock, Zap } from 'lucide-react'
import { motion } from 'motion/react'

const steps = [
  {
    icon: FileText,
    title: 'Step 1: Share Requirements',
    description: 'You tell us the roles, must-have requirements, and volume you want.',
  },
  {
    icon: Users,
    title: 'Step 2: We Source Talent',
    description: 'We source talent from our networks and outbound channels.',
  },
  {
    icon: Clock,
    title: 'Step 3: Ongoing Delivery',
    description: 'You receive resumes on a rolling basis throughout the month.',
  },
  {
    icon: Zap,
    title: 'Step 4: You Take Action',
    description: 'You review and move forward with anyone you like.',
  },
]

export function ResumeSourcingHowItWorks() {
  return (
    <section className="bg-slate-50 py-24">
      <div className="mx-auto max-w-7xl px-6">

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-16 text-center text-3xl font-bold text-slate-900 lg:text-4xl"
        >
          How Resume Sourcing Works
        </motion.h2>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => {
            const Icon = step.icon
            return (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <Card className="h-full border border-slate-200 bg-white p-8 shadow-lg transition-shadow hover:shadow-xl">
                  <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-sky-50 text-sky-600">
                    <Icon size={22} strokeWidth={1.75} />
                  </div>
                  <p className="mb-3 text-lg font-bold text-slate-900">{step.title}</p>
                  <p className="leading-relaxed text-slate-600">{step.description}</p>
                </Card>
              </motion.div>
            )
          })}
        </div>

      </div>
    </section>
  )
}
