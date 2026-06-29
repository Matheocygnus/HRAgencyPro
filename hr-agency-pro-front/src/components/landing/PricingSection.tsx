import { Chip, Card, Button } from '@heroui/react'
import { Check } from 'lucide-react'
import { motion } from 'motion/react'

const plans = [
  {
    name: 'Recruitment Process Outsourcing',
    headline: 'No Upfront Cost',
    description:
      'We handle the search, screening, placement, and payment for your contractors.',
    features: [
      'Only for hiring contractors',
      'Fixed monthly rate',
      'We cover legal and compliance',
      'Full recruitment lifecycle management',
      'Typical 50–70% savings vs US hiring',
    ],
    cta: 'Explore RPO Services',
    featured: true,
  },
  {
    name: 'Direct Hire & Placement',
    headline: 'No Upfront Cost',
    description:
      'We search, screen and place permanent employees on your team, including local options for in-person work.',
    features: [
      'Pre-vetted global and local talent',
      '25% of first-year annual salary',
      'LATAM salaries 50–70% below US rates',
      '60-day replacement guarantee',
      'Guided hiring process',
    ],
    cta: 'See Pricing Details',
    featured: false,
  },
  {
    name: 'Custom Enterprise Solutions',
    headline: 'No Upfront Cost',
    description:
      'Tailored recruitment solutions for companies with specialized needs.',
    features: [
      'Custom pricing models',
      'Volume-based discounts',
      'Dedicated account executive',
      'Custom skill assessments',
      'Bespoke hiring solutions',
    ],
    cta: 'Contact Sales',
    featured: false,
  },
]

export function PricingSection() {
  return (
    <section className="bg-white px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">

        {/* Header */}
        <div className="mb-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Chip
              variant="flat"
              className="mb-4 border border-sky-200 bg-sky-100/80 text-xs font-bold uppercase tracking-widest text-sky-700"
            >
              Pricing
            </Chip>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl font-black tracking-tight text-[#0f2447] lg:text-5xl"
          >
            Role-Based Pricing Structure
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mx-auto mt-4 max-w-2xl text-base text-slate-500"
          >
            Our pricing varies based on the role you're hiring for and the expertise level
            required.
          </motion.p>
        </div>

        {/* Pricing grid */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {plans.map((plan, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: i * 0.1, ease: 'easeOut' }}
              className="relative"
            >
              {/* Popular badge */}
              {plan.featured && (
                <div className="absolute -top-3.5 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-full bg-[#0f2447] px-4 py-1 text-[10px] font-bold uppercase tracking-widest text-white shadow-sm">
                  Popular
                </div>
              )}

              <Card
                className={`flex h-full flex-col bg-white ${
                  plan.featured
                    ? 'border-2 border-[#0f2447] shadow-xl shadow-[#0f2447]/10'
                    : 'border border-slate-100 shadow-sm'
                }`}
              >
                <Card.Content className="flex flex-1 flex-col p-6">

                  {/* Plan name */}
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    {plan.name}
                  </p>

                  {/* Headline */}
                  <p className="mt-2 text-2xl font-black text-[#0f2447]">
                    {plan.headline}
                  </p>

                  {/* Description */}
                  <p className="mt-3 text-sm leading-relaxed text-slate-500">
                    {plan.description}
                  </p>

                  {/* Divider */}
                  <div className="my-5 h-px bg-slate-100" />

                  {/* Features */}
                  <ul className="flex flex-1 flex-col gap-2.5">
                    {plan.features.map((feat) => (
                      <li key={feat} className="flex items-start gap-2.5">
                        <Check className="mt-0.5 size-4 shrink-0 text-emerald-500" />
                        <span className="text-sm text-slate-700">{feat}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA — anchored to bottom */}
                  <div className="mt-8">
                    {plan.featured ? (
                      <Button
                        size="lg"
                        className="w-full bg-[#0f2447] font-semibold text-white shadow-md shadow-[#0f2447]/20 hover:opacity-90"
                      >
                        {plan.cta}
                      </Button>
                    ) : (
                      <Button
                        size="lg"
                        variant="bordered"
                        className="w-full border-slate-200 font-medium text-[#0f2447] hover:border-[#0f2447]/40 hover:bg-slate-50"
                      >
                        {plan.cta}
                      </Button>
                    )}
                  </div>

                </Card.Content>
              </Card>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  )
}
