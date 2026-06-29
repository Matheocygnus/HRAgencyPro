import { Chip } from '@heroui/react'
import { motion } from 'motion/react'

const stats = [
  { number: '40+', label: 'Contractors scaled for a single client' },
  { number: '2–4 wks', label: 'Average placement timeframe' },
  { number: '70%', label: 'Cost savings vs. US domestic hiring' },
]

const roles = [
  'Sales',
  'Operations',
  'Support',
  'Marketing',
  'Data Entry',
  'Chief of Staff',
  'Executive Assistants',
  'Video Editors',
  'Recruiters',
  'Engineers',
  'Developers',
  'Account Managers',
  'Project Managers',
]

export function StatsBanner() {
  return (
    <section className="bg-[#0f2447] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-0 lg:divide-x lg:divide-white/20">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.number}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, delay: index * 0.15, ease: 'easeOut' }}
              className="flex flex-col items-center text-center lg:px-12"
            >
              <span className="text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-5xl">
                {stat.number}
              </span>
              <p className="mt-3 max-w-[200px] text-sm leading-snug text-blue-200/80 sm:text-base">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Roles We Place */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.6, delay: 0.3, ease: 'easeOut' }}
          className="mt-6 border-t border-white/10 pt-5"
        >
          <p className="mb-4 text-center text-xs uppercase tracking-[0.2em] text-white/60">
            Roles We Place
          </p>
          <div className="mx-auto flex max-w-4xl flex-wrap justify-center gap-2">
            {roles.map((role) => (
              <Chip
                key={role}
                variant="flat"
                className="border border-white/20 bg-white/10 text-sm text-white/80 backdrop-blur-sm"
              >
                {role}
              </Chip>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
