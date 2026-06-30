import { Button } from '@heroui/react'
import { motion } from 'motion/react'

export function HowItWorksCta() {
  return (
    <section className="bg-[#0f2447] py-20 lg:py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mx-auto flex max-w-5xl flex-col items-center px-6 text-center"
      >
        <h2 className="mb-6 max-w-4xl text-4xl font-bold text-white lg:text-5xl">
          Ready to build your high-performing remote team?
        </h2>

        <p className="mb-10 max-w-3xl text-xl leading-relaxed text-white/70">
          Schedule a discovery call to discuss your talent needs and learn how we can help you build a high-performing remote team.
        </p>

        <a
          href="https://form.typeform.com/to/aKI8I8lO"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button
            size="lg"
            className="bg-white font-semibold text-[#0f2447] hover:bg-slate-100"
          >
            Book a Discovery Call
          </Button>
        </a>
      </motion.div>
    </section>
  )
}
