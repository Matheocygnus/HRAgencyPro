import { motion } from 'motion/react'

export function IndustriesHero() {
  return (
    <section className="bg-white pb-12 pt-12 lg:pb-16 lg:pt-16">
      <div className="mx-auto max-w-4xl px-6 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: 'easeOut' }}
          className="mb-6 text-5xl font-bold tracking-tight text-slate-900 lg:text-6xl"
        >
          Industries we serve
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-xl leading-relaxed text-slate-500"
        >
          From startups to established enterprises, we help businesses in diverse
          industries build world-class remote teams. Our vetted professionals bring
          the skills and flexibility your industry needs to grow—efficiently and
          cost-effectively.
        </motion.p>
      </div>
    </section>
  )
}
