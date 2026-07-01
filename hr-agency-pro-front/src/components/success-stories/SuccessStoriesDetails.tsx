import { Quote } from 'lucide-react'
import { motion } from 'motion/react'

export function SuccessStoriesDetails() {
  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-6">

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-4xl font-bold text-slate-900"
        >
          Local & Expensive to Global & Affordable
        </motion.h2>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">

          {/* Blue metric */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="h-full rounded-2xl bg-blue-50/50 p-8"
          >
            <p className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-500">
              Heros Hired
            </p>
            <p className="mb-6 text-6xl font-black text-blue-600">40</p>
            <p className="leading-relaxed text-slate-700">
              Our database consists of more than 15,000 top-quality candidates.
            </p>
          </motion.div>

          {/* Rose metric */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="h-full rounded-2xl bg-rose-50/50 p-8"
          >
            <p className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-500">
              Money Saved
            </p>
            <p className="mb-6 text-6xl font-black text-rose-600">$2.5M</p>
            <p className="leading-relaxed text-slate-700">
              Our customers save 50-70% vs hiring comparable US-based talent.
            </p>
          </motion.div>

          {/* Testimonial */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="h-full rounded-2xl bg-slate-50 p-8"
          >
            <Quote className="mb-4 h-8 w-8 text-[#0f2447]" />
            <p className="mb-6 italic leading-relaxed text-slate-700">
              We hired 40 team members who share core values: great attitude, desire to learn,
              initiative, and adaptability. RemoteHero's Team was responsive, helpful, and easy
              going which fostered a seamless hiring process. They integrated with all our
              departments to find the best fit.
            </p>
            <span className="block font-bold text-slate-900">Anonymous</span>
            <span className="text-sm text-slate-500">CEO, VC-backed tech startup</span>
          </motion.div>

        </div>
      </div>
    </section>
  )
}
