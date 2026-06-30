import { Button } from '@heroui/react'
import { motion } from 'motion/react'

const trustedLogos = [
  'Pearl Benefits',
  'Chai Mazel',
  'Kanvasroom',
  "Pearl's Nutritionals",
]

export function RpoHeroSection() {
  return (
    <section className="bg-gradient-to-b from-slate-50 to-white px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
      <div className="mx-auto max-w-5xl text-center">

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: 'easeOut' }}
          className="text-5xl font-bold tracking-tight text-[#0f2447] lg:text-6xl"
        >
          Make Your Work Life Easier with{' '}
          <span className="mt-2 block">
            Recruitment Process Outsourcing (RPO)
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="mx-auto mt-6 max-w-3xl text-lg leading-relaxed text-slate-500"
        >
          With RemoteHero's Recruitment Process Outsourcing (RPO) services, you can access
          Latin America's elite virtual assistants and remote professionals to build a
          high-performing offshore team while saving 50–70% on hiring costs — with placement in as
          little as 3 weeks. Our outsourced recruiting services handle everything from talent
          sourcing to screening, allowing you to focus on your core business functions.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="mt-8"
        >
          <a
            href="https://form.typeform.com/to/aKI8I8lO"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button
              size="lg"
              className="bg-[#0f2447] font-semibold text-white shadow-lg shadow-[#0f2447]/20 hover:bg-[#162f5c]"
            >
              Talk to an RPO expert today
            </Button>
          </a>
        </motion.div>

        {/* Trusted By */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-20"
        >
          <p className="mb-6 text-sm font-semibold uppercase tracking-wider text-slate-400">
            Trusted by innovative companies worldwide
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 lg:gap-12">
            {trustedLogos.map((name) => (
              <span
                key={name}
                className="text-xl font-bold text-slate-300 opacity-70"
              >
                {name}
              </span>
            ))}
          </div>
        </motion.div>

      </div>
    </section>
  )
}
