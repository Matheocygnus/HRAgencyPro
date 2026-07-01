import { motion } from 'motion/react'

const metrics = [
  { label: 'Heros Hired', value: '40' },
  { label: 'Money Saved', value: '$2.5M' },
  { label: 'Major Win', value: '100%' },
]

export function SuccessStoriesHero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#0a1a38] via-[#0f2447] to-[#162f5c] pb-32 pt-24">

      {/* Radial glows — depth without noise */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-[520px] w-[520px] rounded-full bg-sky-500/10 blur-3xl" />
        <div className="absolute -bottom-20 right-0 h-[400px] w-[400px] rounded-full bg-sky-800/20 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-5xl px-6">

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <span className="inline-block rounded-full border border-sky-400/30 bg-white/10 px-4 py-1.5 text-xs font-bold tracking-widest text-sky-300 backdrop-blur-sm">
            LATEST SUCCESS STORY
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-16 text-5xl font-extrabold leading-tight tracking-tight text-white lg:text-6xl"
        >
          How a CEO Saved $2.5M by Building an Entire Operations Team with Remote Hero
        </motion.h1>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {metrics.map((metric, i) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
              className="rounded-2xl bg-white p-8 shadow-xl shadow-black/25 transition-transform duration-300 hover:-translate-y-1"
            >
              <p className="mb-2 font-medium text-slate-500">{metric.label}</p>
              <p className="text-5xl font-black text-[#0f2447]">{metric.value}</p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  )
}
