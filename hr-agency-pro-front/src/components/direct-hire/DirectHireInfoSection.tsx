import { Card } from '@heroui/react'
import { CircleCheck } from 'lucide-react'
import { motion } from 'motion/react'

const benefits = [
  'Only pay when you hire (percentage of first year salary)',
  'Access to pre-vetted talent pool with proven skills',
  'Average 50-70% cost savings vs US-based hires',
  '30-day replacement guarantee',
  'Timezone-aligned professionals (US Eastern & Central)',
  'Option to source local talent for in-person roles',
]

export function DirectHireInfoSection() {
  return (
    <section className="bg-slate-50 px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-start gap-16 lg:grid-cols-2">

        {/* Left — Text */}
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, ease: 'easeOut' }}
          className="max-w-xl"
        >
          <h2 className="text-4xl font-bold leading-tight tracking-tight text-[#0f2447]">
            What is Direct Hire & Placement?
          </h2>

          <div className="mt-6 space-y-4 text-lg leading-relaxed text-slate-500">
            <p>
              Our Direct Hire & Placement service provides a straightforward solution for
              building your permanent team with top-tier global talent. We connect you with
              professionals from Latin America, the Caribbean, Philippines, Europe, and USA —
              and can also source talent in your local area for in-person roles. Unlike
              traditional staffing services, we only charge a percentage of the first
              year's salary once you've made a successful hire.
            </p>
            <p>
              This service is perfect for companies looking to build long-term teams with
              significant cost savings compared to US-based hiring, without sacrificing
              quality or cultural fit.
            </p>
          </div>
        </motion.div>

        {/* Right — Benefits Card */}
        <motion.div
          initial={{ opacity: 0, x: 24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, ease: 'easeOut', delay: 0.1 }}
        >
          <Card className="border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/60">
            <Card.Header className="p-0 pb-6">
              <Card.Title className="text-2xl font-bold text-slate-900">
                Key Benefits
              </Card.Title>
            </Card.Header>
            <Card.Content className="p-0">
              <ul className="flex flex-col gap-4">
                {benefits.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CircleCheck className="mt-0.5 size-5 shrink-0 text-emerald-500" />
                    <span className="text-base text-slate-700">{item}</span>
                  </li>
                ))}
              </ul>
            </Card.Content>
          </Card>
        </motion.div>

      </div>
    </section>
  )
}
