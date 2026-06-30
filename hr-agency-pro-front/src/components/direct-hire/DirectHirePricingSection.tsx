import { Card } from '@heroui/react'
import { CircleCheck } from 'lucide-react'
import { motion } from 'motion/react'

const features = [
  'Simple, transparent fee structure',
  'No hidden costs or additional charges',
  'Includes our 30-day replacement guarantee',
  'Comprehensive screening and vetting process',
]

export function DirectHirePricingSection() {
  return (
    <section className="bg-slate-50 px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h2 className="text-4xl font-bold tracking-tight text-[#0f2447]">
            Transparent Placement Fees
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-slate-500">
            We only charge when you successfully hire a candidate. Our placement fee is a
            percentage of the first year's salary based on the role's complexity and
            seniority level.
          </p>
        </motion.div>

        {/* Pricing Card */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, delay: 0.15 }}
          className="mx-auto mt-16 max-w-2xl"
        >
          <Card className="rounded-3xl border border-slate-200 bg-white p-10 shadow-2xl shadow-slate-200/60 lg:p-14">

            {/* Card title */}
            <Card.Header className="flex-col items-center p-0 pb-8 text-center">
              <Card.Title className="text-2xl font-bold text-slate-900">
                Transparent Placement Fee
              </Card.Title>
            </Card.Header>

            <Card.Content className="p-0">
              {/* Price */}
              <div className="mb-6 flex items-baseline justify-center gap-3">
                <span className="text-6xl font-extrabold tracking-tight text-[#0f2447] lg:text-7xl">
                  25%
                </span>
                <span className="text-lg text-slate-500">of first year salary</span>
              </div>

              {/* Description */}
              <p className="mb-8 text-center text-base leading-relaxed text-slate-500">
                Our placement fee applies to all roles regardless of seniority level and is
                calculated as a percentage of the candidate's first-year annual salary.
              </p>

              {/* Divider */}
              <div className="mb-8 border-t border-slate-100" />

              {/* Feature list */}
              <ul className="flex flex-col gap-4">
                {features.map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <CircleCheck className="size-5 shrink-0 text-emerald-500" />
                    <span className="text-base text-slate-700">{item}</span>
                  </li>
                ))}
              </ul>
            </Card.Content>

          </Card>

          {/* Footer note */}
          <p className="mt-6 text-center text-sm text-slate-400">
            All placement fees include our 30-day replacement guarantee.
          </p>
        </motion.div>

      </div>
    </section>
  )
}
