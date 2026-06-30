import { Button } from '@heroui/react'
import { motion } from 'motion/react'

export function ResumeSourcingHeroSection() {
  return (
    <section className="bg-white px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
      <div className="mx-auto max-w-5xl text-center">

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: 'easeOut' }}
          className="mb-6 text-5xl font-bold tracking-tight text-[#0f2447] lg:text-6xl"
        >
          Resume Sourcing
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mx-auto mb-6 max-w-3xl text-xl font-medium text-slate-800 lg:text-2xl"
        >
          Get a consistent flow of qualified resumes every month — without the recruiting overhead.
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mx-auto mb-10 max-w-4xl text-lg leading-relaxed text-slate-500"
        >
          We source resumes for the exact roles you are hiring for and deliver them straight to you.
          Choose between a simple pipeline of resumes or a curated shortlist of top candidates
          — depending on how hands-on you want to be.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <a
            href="https://form.typeform.com/to/jAolt5bB"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button
              size="lg"
              variant="solid"
              className="bg-[#0f2447] font-semibold text-white hover:bg-[#162f5c]"
            >
              Get Started
            </Button>
          </a>

          <a
            href="https://calendar.app.google/Rn8aYVfrJS46H6dT9"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button
              size="lg"
              variant="bordered"
              className="border-2 border-[#0f2447] font-semibold text-[#0f2447] hover:bg-slate-50"
            >
              Book a Call
            </Button>
          </a>
        </motion.div>

      </div>
    </section>
  )
}
