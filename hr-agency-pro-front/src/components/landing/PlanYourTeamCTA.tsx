import { Button } from '@heroui/react'
import { Calculator, ArrowRight } from 'lucide-react'
import { motion } from 'motion/react'

export function PlanYourTeamCTA() {
  return (
    <section className="relative overflow-hidden bg-[#0f2447] px-4 py-20 sm:px-6 lg:px-8">
      {/* Subtle background grid */}
      <div className="absolute inset-0 [background-image:linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] [background-size:48px_48px]" />

      {/* Ambient glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-sky-500/5 blur-3xl" />

      <div className="relative mx-auto max-w-4xl text-center">

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
          className="mb-6 flex justify-center"
        >
          <span className="inline-block rounded-full border border-sky-400/30 bg-sky-400/10 px-4 py-1 text-xs font-bold uppercase tracking-widest text-sky-300">
            Plan Your Team
          </span>
        </motion.div>

        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-4xl font-bold tracking-tight text-white lg:text-5xl"
        >
          Know exactly what your team will cost
          <br className="hidden sm:block" />
          before you commit.
        </motion.h2>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mx-auto mt-5 max-w-2xl text-base text-slate-300"
        >
          Use our interactive calculator to model your team structure, compare roles, and see
          your savings vs. US hiring — in under 2 minutes.
        </motion.p>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <Button
            size="lg"
            className="bg-white font-semibold text-[#0f2447] shadow-lg shadow-black/20 hover:bg-slate-100"
          >
            <Calculator className="size-4" />
            Build Your Team Cost Model
          </Button>
          <Button
            size="lg"
            variant="bordered"
            className="border-white/40 font-medium text-white hover:border-white/70 hover:bg-white/5"
          >
            Book a Strategy Call
            <ArrowRight className="size-4" />
          </Button>
        </motion.div>

        {/* Footer note */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-8 text-xs text-slate-400/70"
        >
          Repeat hiring made simple. Long-term teams built for operational leverage.
        </motion.p>

      </div>
    </section>
  )
}
