import { Chip, Card, Button } from '@heroui/react'
import { ArrowRight } from 'lucide-react'
import { motion } from 'motion/react'

const steps = [
  {
    title: 'Tell us what you need',
    description: 'Share your requirements, skills needed, and preferred experience level.',
  },
  {
    title: 'We match you with talent',
    description: 'Our team identifies top candidates from our pre-vetted nearshore talent pool.',
  },
  {
    title: 'Review your matches',
    description: 'Evaluate recommended candidates and select the right fit for your team.',
  },
  {
    title: 'Start working together',
    description: 'Begin collaborating with your new team member with our ongoing support.',
  },
]

export function HowItWorksSection() {
  return (
    <section className="bg-slate-50 px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Chip
              variant="flat"
              className="mb-4 border border-sky-200 bg-sky-100/80 text-xs font-bold uppercase tracking-widest text-sky-700"
            >
              How It Works
            </Chip>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl font-black tracking-tight text-[#0f2447] lg:text-5xl"
          >
            Remote talent acquisition simplified
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mx-auto mt-4 max-w-2xl text-base text-slate-500"
          >
            We've streamlined the hiring process to save you time and connect you with the
            best nearshore talent.
          </motion.p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: i * 0.12, ease: 'easeOut' }}
            >
              <Card className="relative h-full overflow-hidden bg-white shadow-sm">
                <Card.Content className="relative flex flex-col gap-4 overflow-hidden p-6">
                  {/* Top accent bar */}
                  <div className="absolute left-0 right-0 top-0 h-1 bg-gradient-to-r from-[#0f2447] to-sky-500" />

                  {/* Ghost number — decorative background */}
                  <span className="pointer-events-none absolute -bottom-3 -right-1 select-none text-[5.5rem] font-black leading-none text-slate-100">
                    {i + 1}
                  </span>

                  {/* Step badge */}
                  <div className="relative flex size-9 items-center justify-center rounded-lg bg-[#0f2447] text-sm font-bold text-white">
                    {String(i + 1).padStart(2, '0')}
                  </div>

                  {/* Content */}
                  <div className="relative">
                    <p className="font-bold text-slate-900">{step.title}</p>
                    <p className="mt-1.5 text-sm leading-relaxed text-slate-500">
                      {step.description}
                    </p>
                  </div>
                </Card.Content>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.5, delay: 0.5, ease: 'easeOut' }}
          className="mt-14 flex justify-center"
        >
          <Button
            size="lg"
            className="bg-[#0f2447] px-8 font-semibold text-white shadow-lg shadow-[#0f2447]/25 hover:opacity-90"
          >
            Get Started Now
            <ArrowRight className="size-4" />
          </Button>
        </motion.div>

      </div>
    </section>
  )
}
