import { Search, ShieldCheck, FileText, CreditCard } from 'lucide-react'
import { motion } from 'motion/react'
import type { LucideIcon } from 'lucide-react'

type Feature = {
  icon: LucideIcon
  title: string
  description: string
}

const features: Feature[] = [
  {
    icon: Search,
    title: 'Streamlined Talent Sourcing',
    description:
      "We'll source and help you onboard top, English-speaking talent in just 21 days. Leverage our expertise to find remarkable talent that aligns with your culture and works in your time zone.",
  },
  {
    icon: ShieldCheck,
    title: 'Strict Screening, Background Checks & Fit Assessment Tests',
    description:
      'Eliminate the risk of a bad hire by interviewing candidates who are fully vetted for both skill and cultural fit. Ensure every interviewee meets the qualifications necessary for the role.',
  },
  {
    icon: FileText,
    title: 'Compliance',
    description:
      'Our experts help you choose the optimal hiring model compliant with local labor laws. We help you navigate and maintain compliance for all employment types, from contractors to full-time staff.',
  },
  {
    icon: CreditCard,
    title: 'Payroll',
    description:
      'We can handle everything from tax compliance to salary disbursements, ensuring your team is paid accurately and on time.',
  },
]

export function ComprehensiveOutsourcingSection() {
  return (
    <section className="bg-slate-50 px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">

        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-16 text-center text-3xl font-bold tracking-tight text-[#0f2447] lg:text-4xl"
        >
          Comprehensive Outsourcing & Remote Workforce Management
        </motion.h2>

        {/* Feature grid */}
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="flex gap-5"
            >
              {/* Icon bubble */}
              <div className="mt-1 flex size-11 shrink-0 items-center justify-center rounded-xl bg-sky-100 text-sky-600">
                <feature.icon className="size-5" />
              </div>

              <div>
                <h3 className="text-lg font-bold leading-snug text-[#0f2447]">
                  {feature.title}
                </h3>
                <p className="mt-2 text-base leading-relaxed text-slate-500">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  )
}
