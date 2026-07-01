import { Button } from '@heroui/react'
import { motion } from 'motion/react'

export function SuccessStoriesCta() {
  return (
    <section className="bg-[#0f2447] py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center px-6 text-center"
      >
        <h2 className="mb-6 text-4xl font-bold text-white lg:text-5xl">
          Ready to build your remote team?
        </h2>
        <p className="mb-10 max-w-2xl text-xl text-slate-300">
          Join hundreds of companies saving millions while building world-class teams.
        </p>
        <a
          href="https://calendar.app.google/Rn8aYVfrJS46H6dT9"
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
