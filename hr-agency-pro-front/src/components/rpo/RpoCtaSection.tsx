import { Button } from '@heroui/react'
import { motion } from 'motion/react'

export function RpoCtaSection() {
  return (
    <>
      {/* CTA Banner */}
      <section className="bg-[#0f2447] px-4 py-16 sm:px-6 lg:py-20 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-8 lg:flex-row"
        >
          {/* Text */}
          <div className="text-center lg:text-left">
            <p className="text-4xl font-bold leading-tight text-white lg:text-5xl">
              Ready to streamline your hiring?
            </p>
            <p className="text-4xl font-bold leading-tight text-sky-400 lg:text-5xl">
              Book a demo call today.
            </p>
          </div>

          {/* Button */}
          <div className="shrink-0">
            <a
              href="https://form.typeform.com/to/aKI8I8lO"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                size="lg"
                className="bg-white font-semibold text-[#0f2447] shadow-lg shadow-black/20 hover:bg-slate-100"
              >
                Book a Discovery Call
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
