import { Card } from '@heroui/react'
import { motion } from 'motion/react'

const steps = [
  {
    n: 1,
    title: 'Requirements Analysis',
    description:
      'We start by thoroughly understanding your requirements, company culture, and specific needs through a detailed consultation with our placement experts.',
  },
  {
    n: 2,
    title: 'Candidate Sourcing & Screening',
    description:
      'Our team sources and rigorously screens candidates from our extensive talent network, ensuring they meet both technical requirements and cultural fit.',
  },
  {
    n: 3,
    title: 'Client Interviews',
    description:
      'Only pre-vetted candidates are presented for your review. You conduct final interviews and select the talent that best matches your needs.',
  },
  {
    n: 4,
    title: 'Offer & Negotiation',
    description:
      'We handle offer details and negotiate compensation packages with the selected candidate, ensuring a smooth transition to your team.',
  },
  {
    n: 5,
    title: 'Onboarding Support',
    description:
      'We provide guidance for successful remote onboarding and integration of your new hire to ensure a productive start.',
  },
  {
    n: 6,
    title: 'Ongoing Support',
    description:
      'We follow up regularly during the first 30 days to ensure both employer and employee satisfaction, with our replacement guarantee if needed.',
  },
]

export function DirectHireProcessSection() {
  return (
    <section className="bg-white px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-16 text-center"
        >
          <h2 className="text-4xl font-bold tracking-tight text-[#0f2447]">
            Our Direct Hire Process
          </h2>
          <p className="mx-auto mt-4 max-w-3xl text-lg leading-relaxed text-slate-500">
            We've refined our direct hire process to be efficient, transparent, and highly
            effective at matching the right talent with your specific needs.
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {steps.map((step, i) => (
            <motion.div
              key={step.n}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.07 }}
            >
              <Card className="h-full border border-slate-100 bg-sky-50/50 p-8 shadow-none">
                {/* Step number */}
                <div className="mb-6 flex size-10 items-center justify-center rounded-full bg-[#0f2447] text-sm font-bold text-white">
                  {step.n}
                </div>
                <h3 className="mb-3 text-xl font-bold text-[#0f2447]">{step.title}</h3>
                <p className="text-base leading-relaxed text-slate-500">{step.description}</p>
              </Card>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  )
}
