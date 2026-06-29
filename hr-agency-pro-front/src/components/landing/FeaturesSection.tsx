import { Chip, Card } from '@heroui/react'
import { ShieldCheck, Zap, Globe, Shield, Headphones, DollarSign } from 'lucide-react'
import { motion } from 'motion/react'

const features = [
  {
    icon: ShieldCheck,
    title: 'Pre-vetted talent',
    description:
      'All our professionals undergo rigorous skill assessments, ensuring you get the quality you deserve.',
  },
  {
    icon: Zap,
    title: 'Quick matching',
    description:
      'Find the perfect match within days, not weeks, with our advanced nearshore matching process.',
  },
  {
    icon: Globe,
    title: 'Global talent pool',
    description:
      'Access professionals from Latin America and beyond, expanding your team with diverse perspectives.',
  },
  {
    icon: Shield,
    title: 'Risk-free trial',
    description:
      'Start with a trial period to ensure the match is perfect before making a long-term commitment.',
  },
  {
    icon: Headphones,
    title: 'Dedicated support',
    description:
      'Our team is available to help with any issues or questions throughout your hiring journey.',
  },
  {
    icon: DollarSign,
    title: 'Value-based pricing',
    description:
      'Pay only for successful placements with pricing tailored to your specific needs.',
  },
]

export function FeaturesSection() {
  return (
    <section className="bg-white px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">

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
              Features
            </Chip>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl font-black tracking-tight text-[#0f2447] lg:text-5xl"
          >
            Why choose RemoteHero?
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mx-auto mt-4 max-w-2xl text-base text-slate-500"
          >
            Our platform is designed to make remote hiring efficient, reliable, and stress-free.
          </motion.p>
        </div>

        {/* Feature grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, i) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.45, delay: i * 0.08, ease: 'easeOut' }}
              >
                <Card className="h-full border border-slate-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg">
                  <Card.Content className="flex flex-col p-6">
                    <div className="mb-3 flex items-center gap-3">
                      <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-sky-50">
                        <Icon className="size-5 text-sky-600" />
                      </div>
                      <p className="font-bold text-slate-900">{feature.title}</p>
                    </div>
                    <p className="text-sm leading-relaxed text-slate-500">
                      {feature.description}
                    </p>
                  </Card.Content>
                </Card>
              </motion.div>
            )
          })}
        </div>

      </div>
    </section>
  )
}
