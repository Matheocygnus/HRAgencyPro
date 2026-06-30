import { Button } from '@heroui/react'
import { Users } from 'lucide-react'
import { motion } from 'motion/react'

export function HowItWorksTeamCta() {
  return (
    <section className="bg-white py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mx-auto flex max-w-4xl flex-col items-center px-6 text-center"
      >
        <h2 className="mb-6 text-4xl font-bold text-slate-900">
          Want to build a whole team?
        </h2>

        <p className="mb-10 max-w-2xl text-xl leading-relaxed text-slate-500">
          Plan your remote team structure and get cost estimates with our interactive
          calculator. Build the perfect team within your budget.
        </p>

        <a href="/tools/team-building-calculator">
          <Button
            size="lg"
            className="bg-[#0f2447] font-semibold text-white shadow-lg shadow-[#0f2447]/20 hover:bg-[#162f5c]"
          >
            <Users size={18} className="mr-2" />
            Team Building Calculator
          </Button>
        </a>
      </motion.div>
    </section>
  )
}
