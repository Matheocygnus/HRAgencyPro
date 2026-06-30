import { Search, PhoneCall, UserCheck } from 'lucide-react'
import { motion } from 'motion/react'

const steps = [
  {
    icon: Search,
    title: 'Discovery Session',
    description: "We delve into your hiring goals, whether it's building a remote team, high-volume hiring, executive search, etc. Together, we outline role requirements, discuss talent markets, and compensation ranges.",
  },
  {
    icon: PhoneCall,
    title: 'Kick-Off Call',
    description: "Meet your dedicated recruiter to fine-tune the candidate profile and create an effective hiring journey. We focus on a streamlined process to secure top talent that meets your objectives.",
  },
  {
    icon: UserCheck,
    title: 'Interviews and Hiring',
    description: "Within just 3 days, receive profiles of handpicked candidates. Conduct interviews to find the best fit. Given our pool of high-quality candidates, your toughest decision will be choosing who to hire.",
  },
]

export function IndustriesProcess() {
  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-6">

        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mx-auto mb-16 max-w-4xl text-center text-4xl font-bold text-slate-900 lg:text-5xl"
        >
          How RemoteHero's Proven Hiring Process Works
        </motion.h2>

        {/* Steps grid */}
        <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
          {steps.map((step, i) => {
            const Icon = step.icon
            return (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-sky-50 text-sky-600">
                  <Icon size={22} strokeWidth={1.75} />
                </div>
                <h3 className="mb-3 text-xl font-bold text-[#0f2447]">{step.title}</h3>
                <p className="leading-relaxed text-slate-500">{step.description}</p>
              </motion.div>
            )
          })}
        </div>

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, delay: 0.3 }}
          className="mt-12 flex justify-center"
        >
          <span className="inline-block rounded-full bg-sky-50 px-6 py-3 text-sm font-bold tracking-widest text-sky-700">
            21 DAYS TO FILL OPEN POSITIONS
          </span>
        </motion.div>

      </div>
    </section>
  )
}
