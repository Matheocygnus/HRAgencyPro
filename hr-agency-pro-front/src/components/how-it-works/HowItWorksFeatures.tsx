import { CircleCheck, Target, Globe, ShieldCheck, Headphones, DollarSign } from 'lucide-react'
import { motion } from 'motion/react'

const features = [
  {
    icon: CircleCheck,
    title: 'Pre-vetted talent',
    description: 'All our professionals undergo rigorous skill assessments, ensuring you get the quality you deserve.',
  },
  {
    icon: Target,
    title: 'Quick matching',
    description: 'Find the perfect match within days, not weeks, with our advanced matching algorithm.',
  },
  {
    icon: Globe,
    title: 'Global talent pool',
    description: 'Access professionals from around the world, expanding your team with diverse perspectives.',
  },
  {
    icon: ShieldCheck,
    title: 'Risk-free trial',
    description: 'Start with a trial period to ensure the match is perfect before making a long-term commitment.',
  },
  {
    icon: Headphones,
    title: 'Dedicated support',
    description: 'Our team is available to help with any issues or questions throughout your hiring journey.',
  },
  {
    icon: DollarSign,
    title: 'Value-based pricing',
    description: 'Pay only for successful placements with pricing tailored to your specific needs.',
  },
]

export function HowItWorksFeatures() {
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
          <p className="mb-4 text-sm font-bold uppercase tracking-widest text-sky-600">
            Features
          </p>
          <h2 className="mb-4 text-4xl font-bold text-slate-900 lg:text-5xl">
            Why choose RemoteHero?
          </h2>
          <p className="mx-auto max-w-2xl text-xl leading-relaxed text-slate-500">
            Our platform is designed to make remote hiring efficient, reliable, and stress-free.
          </p>
        </motion.div>

        {/* Features grid */}
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, i) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="flex items-start gap-6"
              >
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-sky-50 text-sky-600">
                  <Icon className="h-7 w-7" strokeWidth={1.75} />
                </div>
                <div>
                  <p className="mb-2 text-xl font-bold text-slate-900">{feature.title}</p>
                  <p className="leading-relaxed text-slate-500">{feature.description}</p>
                </div>
              </motion.div>
            )
          })}
        </div>

      </div>
    </section>
  )
}
