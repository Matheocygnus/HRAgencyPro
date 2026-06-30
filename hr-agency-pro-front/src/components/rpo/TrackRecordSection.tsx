import { Button } from '@heroui/react'
import { motion } from 'motion/react'

const stats = [
  {
    value: '$5M+',
    label: 'Saved in overhead costs across our clients in the last 12 months',
  },
  {
    value: '30+',
    label: 'Repeat customers in just 2 years',
  },
  {
    value: '300+',
    label: 'Placements made',
  },
]

export function TrackRecordSection() {
  return (
    <section className="bg-white px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">

        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-16 text-center text-3xl font-bold tracking-tight text-[#0f2447] lg:text-4xl"
        >
          RemoteHero's Track Record
        </motion.h2>

        {/* Stats grid */}
        <div className="grid grid-cols-1 gap-10 text-center md:grid-cols-3 md:gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.value}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="flex flex-col items-center"
            >
              <span className="text-5xl font-extrabold tracking-tight text-[#0f2447] lg:text-6xl">
                {stat.value}
              </span>
              <p className="mt-4 max-w-[200px] text-base leading-relaxed text-slate-500">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="mt-16 flex justify-center"
        >
          <a
            href="https://form.typeform.com/to/aKI8I8lO"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button
              size="lg"
              className="bg-[#0f2447] font-semibold text-white shadow-lg shadow-[#0f2447]/20 hover:bg-[#162f5c]"
            >
              Book a Discovery Call
            </Button>
          </a>
        </motion.div>

      </div>
    </section>
  )
}
