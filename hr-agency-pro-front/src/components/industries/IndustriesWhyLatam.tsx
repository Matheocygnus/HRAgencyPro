import { Clock, MessageCircle, Users, TrendingDown } from 'lucide-react'
import { motion } from 'motion/react'

const benefits = [
  {
    icon: Clock,
    title: 'US Time Zones',
    description: 'Hire teammates, not offshore resources. RemoteHero candidates work in US time zones, helping improve collaboration.',
  },
  {
    icon: MessageCircle,
    title: 'Strong English',
    description: 'Access candidates with certified English proficiency. Plus we screen the best talent for your roles, helping you save time.',
  },
  {
    icon: Users,
    title: 'Seamless Work Culture',
    description: 'Our proven hiring process ensures you get candidates who are a strong cultural and professional fit, helping increase retention.',
  },
  {
    icon: TrendingDown,
    title: 'Lower Operational Costs',
    description: "Latam salaries are 50-70% below US market. Hire the top 1% while keeping your hiring budget in check. It's a win-win situation.",
  },
]

export function IndustriesWhyLatam() {
  return (
    <section className="bg-slate-50 py-24">
      <div className="mx-auto max-w-6xl px-6">

        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-16 text-center text-4xl font-bold text-slate-900"
        >
          Why Latam?
        </motion.h2>

        {/* 2x2 grid */}
        <div className="grid grid-cols-1 gap-x-16 gap-y-12 md:grid-cols-2">
          {benefits.map((benefit, i) => {
            const Icon = benefit.icon
            return (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
              >
                <div className="mb-3 flex items-center gap-3">
                  <Icon size={18} className="shrink-0 text-sky-600" strokeWidth={2} />
                  <h3 className="text-xl font-bold text-[#0f2447]">{benefit.title}</h3>
                </div>
                <p className="leading-relaxed text-slate-500">{benefit.description}</p>
              </motion.div>
            )
          })}
        </div>

      </div>
    </section>
  )
}
