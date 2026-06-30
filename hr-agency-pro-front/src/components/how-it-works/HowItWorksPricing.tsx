import { useState } from 'react'
import { Button } from '@heroui/react'
import { Check } from 'lucide-react'
import { motion } from 'motion/react'
import { GetStartedModal } from './GetStartedModal'

const plans = [
  {
    popular: true,
    title: 'Recruitment Process Outsourcing',
    price: 'No Upfront Cost',
    description: 'We handle the search, screening, placement, and payment for your contractors.',
    features: [
      'Only for hiring contractors',
      'Fixed monthly rate',
      'We cover legal and compliance',
      'Full recruitment lifecycle management',
      'Typical 50-70% savings vs US hiring',
    ],
    cta: 'Explore RPO Services',
    href: '/services/rpo',
    external: false,
  },
  {
    popular: false,
    title: 'Direct Hire & Placement',
    price: 'No Upfront Cost',
    description: 'We search, screen and place permanent employees on your team, including local options for in-person work.',
    features: [
      'Pre-vetted global and local talent',
      '25% of first-year annual salary',
      'LATAM salaries 50-70% below US rates',
      '60-day replacement guarantee',
      'Guided hiring process',
    ],
    cta: 'See Pricing Details',
    href: '/services/direct-hire',
    external: false,
  },
  {
    popular: false,
    title: 'Custom Enterprise Solutions',
    price: 'No Upfront Cost',
    description: 'Tailored recruitment solutions for companies with specialized needs.',
    features: [
      'Custom pricing models',
      'Volume-based discounts',
      'Dedicated account executive',
      'Custom skill assessments',
      'Bespoke hiring solutions',
    ],
    cta: 'Contact Sales',
    href: '',
    external: false,
    modal: true,
  },
]

export function HowItWorksPricing() {
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <section className="bg-slate-50 py-24">
      <div className="mx-auto max-w-7xl px-6">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-16 text-center"
        >
          <span className="mb-6 inline-block rounded-full bg-sky-50 px-4 py-1 text-sm font-bold tracking-wider text-sky-700">
            PRICING
          </span>
          <h2 className="mb-6 text-4xl font-bold text-slate-900 lg:text-5xl">
            Role-Based Pricing Structure
          </h2>
          <p className="mx-auto max-w-2xl text-lg leading-relaxed text-slate-500">
            Our pricing varies based on the role you're hiring for and the expertise level required.
          </p>
        </motion.div>

        {/* Pricing grid */}
        <div className="grid grid-cols-1 items-stretch gap-8 md:grid-cols-3">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.title}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="relative"
            >
              {plan.popular && (
                <div className="absolute -top-3 left-6 z-10 rounded-full bg-sky-100 px-3 py-1 text-xs font-bold text-sky-700">
                  POPULAR
                </div>
              )}

              <div
                className={`flex h-full flex-col rounded-2xl bg-white p-8 ${
                  plan.popular
                    ? 'border-2 border-[#0f2447] shadow-xl'
                    : 'border border-slate-200 shadow-md'
                }`}
              >
                <p className="mb-4 text-xl font-bold text-slate-900">{plan.title}</p>
                <p className="mb-4 text-2xl font-bold text-[#0f2447]">{plan.price}</p>
                <p className="mb-6 leading-relaxed text-slate-500">{plan.description}</p>

                <ul className="mb-8 flex flex-col gap-3">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-3">
                      <Check size={16} className="mt-0.5 shrink-0 text-emerald-500" strokeWidth={2.5} />
                      <span className="text-slate-600">{f}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-auto">
                  {plan.modal ? (
                    <Button
                      size="lg"
                      className="w-full bg-[#0f2447] font-semibold text-white hover:bg-[#162f5c]"
                      onPress={() => setModalOpen(true)}
                    >
                      {plan.cta}
                    </Button>
                  ) : (
                    <a href={plan.href}>
                      <Button
                        size="lg"
                        className="w-full bg-[#0f2447] font-semibold text-white hover:bg-[#162f5c]"
                      >
                        {plan.cta}
                      </Button>
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>

      <GetStartedModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />

    </section>
  )
}
