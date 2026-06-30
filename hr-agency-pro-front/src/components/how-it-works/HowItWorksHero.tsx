import { useState } from 'react'
import { Button } from '@heroui/react'
import { motion } from 'motion/react'
import { GetStartedModal } from './GetStartedModal'

const steps = [
  {
    number: 1,
    title: 'Tell us what you need',
    description: 'Share your requirements, skills needed, and preferred experience level.',
  },
  {
    number: 2,
    title: 'We match you with talent',
    description: 'Our algorithm identifies top candidates from our pre-vetted talent pool.',
  },
  {
    number: 3,
    title: 'Review your matches',
    description: 'Evaluate recommended candidates and select your preferred talent.',
  },
  {
    number: 4,
    title: 'Start working together',
    description: 'Begin collaborating with your new team member with our ongoing support.',
  },
]

export function HowItWorksHero() {
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <section className="bg-white py-24 lg:py-32">

      {/* Header */}
      <div className="mx-auto mb-16 flex max-w-3xl flex-col items-center px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-6 rounded-full bg-sky-50 px-4 py-1 text-sm font-bold tracking-wider text-sky-700"
        >
          HOW IT WORKS
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: 'easeOut', delay: 0.05 }}
          className="mb-6 text-5xl font-bold tracking-tight text-[#0f2447] lg:text-6xl"
        >
          Remote talent acquisition simplified
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="text-xl leading-relaxed text-slate-500"
        >
          We've streamlined the hiring process to save you time and connect
          you with the best talent.
        </motion.p>
      </div>

      {/* Steps grid */}
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 gap-10 text-left md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
            >
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-[#0f2447] text-xl font-bold text-white shadow-md">
                {step.number}
              </div>
              <p className="mb-3 text-xl font-bold text-slate-900">{step.title}</p>
              <p className="leading-relaxed text-slate-500">{step.description}</p>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.65 }}
          className="mt-16 flex justify-center"
        >
          <Button
            size="lg"
            className="bg-[#0f2447] font-semibold text-white shadow-lg shadow-[#0f2447]/20 hover:bg-[#162f5c]"
            onPress={() => setModalOpen(true)}
          >
            Get Started Now
          </Button>
          <GetStartedModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
        </motion.div>
      </div>

    </section>
  )
}
