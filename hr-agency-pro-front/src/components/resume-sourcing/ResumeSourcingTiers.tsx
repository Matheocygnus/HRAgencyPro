import { CircleCheck } from 'lucide-react'
import { motion } from 'motion/react'

const tier1Features = [
  'We gather and send resumes for your target roles.',
  'No screening or filtering — you review all candidates.',
  'Fastest, most cost-effective way to build a pipeline.',
]

const tier2Features = [
  'Everything in Tier 1, plus screening.',
  'We review resumes against your criteria.',
  'You get a shortlist of top matches each month.',
]

export function ResumeSourcingTiers() {
  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-5xl px-6">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-16 text-center"
        >
          <h2 className="text-4xl font-bold text-slate-900">Two Simple Tiers</h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-slate-500">
            Choose the level of involvement that fits your team.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">

          {/* Tier 1 */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-md">

              {/* Header strip */}
              <div className="bg-slate-100 px-8 py-6">
                <p className="mb-1 text-xs font-bold uppercase tracking-widest text-slate-400">Tier 1</p>
                <p className="text-2xl font-bold text-[#0f2447]">Resume Pipeline</p>
                <p className="mt-2 text-sm text-slate-500">Flat monthly rate for ongoing resume delivery.</p>
              </div>

              {/* Body */}
              <div className="flex flex-1 flex-col px-8 py-6">
                <ul className="flex flex-col gap-4">
                  {tier1Features.map((f) => (
                    <li key={f} className="flex items-start gap-3">
                      <CircleCheck size={18} className="mt-0.5 shrink-0 text-emerald-500" />
                      <span className="text-slate-700">{f}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-8 rounded-xl border-l-4 border-sky-300 bg-sky-50 px-5 py-4">
                  <p className="text-sm font-bold text-slate-700">Best for</p>
                  <p className="mt-1 text-sm leading-relaxed text-slate-500">
                    Teams that want maximum volume and prefer to screen internally.
                  </p>
                </div>
              </div>

            </div>
          </motion.div>

          {/* Tier 2 — Featured */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.12 }}
            className="relative"
          >
            {/* Popular badge */}
            <div className="absolute -right-3 -top-3 z-10 rounded-full bg-[#0f2447] px-4 py-1.5 text-xs font-bold tracking-wider text-white shadow-lg">
              POPULAR
            </div>

            <div className="flex h-full flex-col overflow-hidden rounded-2xl border-2 border-[#0f2447] bg-white shadow-xl">

              {/* Header strip — navy gradient */}
              <div className="bg-gradient-to-r from-[#0f2447] to-[#1a3a6e] px-8 py-6">
                <p className="mb-1 text-xs font-bold uppercase tracking-widest text-sky-300">Tier 2</p>
                <p className="text-2xl font-bold text-white">Curated Shortlist</p>
                <p className="mt-2 text-sm text-sky-100/80">We filter and send you the best-fit candidates.</p>
              </div>

              {/* Body */}
              <div className="flex flex-1 flex-col px-8 py-6">
                <ul className="flex flex-col gap-4">
                  {tier2Features.map((f) => (
                    <li key={f} className="flex items-start gap-3">
                      <CircleCheck size={18} className="mt-0.5 shrink-0 text-emerald-500" />
                      <span className="text-slate-700">{f}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-8 rounded-xl border-l-4 border-[#0f2447] bg-[#0f2447]/5 px-5 py-4">
                  <p className="text-sm font-bold text-slate-700">Best for</p>
                  <p className="mt-1 text-sm leading-relaxed text-slate-500">
                    Teams that want speed + quality without spending time sorting resumes.
                  </p>
                </div>
              </div>

            </div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}
