import { Button } from '@heroui/react'
import { motion } from 'motion/react'

export function ResumeSourcingCta() {
  return (
    <>
      {/* CTA Banner */}
      <section className="bg-[#0f2447] px-6 py-20 lg:py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mx-auto flex max-w-4xl flex-col items-center text-center"
        >
          <h2 className="mb-6 max-w-4xl text-4xl font-bold leading-tight text-white lg:text-5xl">
            Ready for a steady pipeline of candidates?
          </h2>

          <p className="mb-10 max-w-3xl text-xl leading-relaxed text-sky-100/80">
            Tell us what roles you need and how many resumes you want per month.
            We will start sourcing immediately.
          </p>

          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <a
              href="https://form.typeform.com/to/jAolt5bB"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                size="lg"
                className="bg-white font-semibold text-[#0f2447] shadow-lg shadow-black/20 hover:bg-slate-100"
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
                className="border-white font-semibold text-white hover:bg-white/10"
              >
                Book a Call
              </Button>
            </a>
          </div>
        </motion.div>
      </section>

      {/* Legal Disclaimer */}
      <div className="bg-white px-6 py-8">
        <p className="mx-auto max-w-5xl text-center text-xs leading-relaxed text-slate-400">
          <span className="font-semibold text-slate-500">Disclaimer:</span>{' '}
          Remote Hero acts as a talent matching service and does not assume any liability for
          the actions, performance, or conduct of hired professionals. Clients are solely
          responsible for their hiring decisions, onboarding, training, and management of
          personnel.
        </p>
      </div>
    </>
  )
}
