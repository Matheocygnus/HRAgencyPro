import { Button } from '@heroui/react'
import { motion } from 'motion/react'

export function DirectHireCtaSection() {
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
          <h2 className="mb-6 text-4xl font-bold leading-tight text-white lg:text-5xl">
            Ready to build your team with top global talent?
          </h2>
          <p className="mb-10 max-w-3xl text-xl leading-relaxed text-sky-100/80">
            Schedule a consultation with our placement experts to discuss your hiring needs
            and see how much you can save.
          </p>
          <a
            href="https://form.typeform.com/to/aKI8I8lO"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button
              size="lg"
              className="bg-white font-semibold text-[#0f2447] shadow-lg shadow-black/20 hover:bg-slate-100"
            >
              Talk to a Placement Expert
            </Button>
          </a>
        </motion.div>
      </section>

      {/* Legal Disclaimer */}
      <div className="bg-white px-6 py-8">
        <p className="mx-auto max-w-5xl text-center text-xs leading-relaxed text-slate-400">
          <span className="font-semibold text-slate-500">Disclaimer:</span>{' '}
          Remote Hero acts as a talent matching service and does not assume any liability for
          the actions, performance, or conduct of hired professionals. While we offer a 30-day
          replacement guarantee, clients remain solely responsible for their hiring decisions,
          onboarding, training, and management of personnel.
        </p>
      </div>
    </>
  )
}
