import { Card } from '@heroui/react'
import { CircleCheck } from 'lucide-react'
import { motion } from 'motion/react'

const benefits = [
  {
    title: 'Rapid talent acquisition',
    description: 'Get pre-vetted virtual assistants and remote professionals in just 2 weeks',
  },
  {
    title: 'Offshore staffing cost efficiency',
    description: 'Save 50-70% compared to traditional US-based hiring',
  },
  {
    title: 'Risk-free hiring',
    description: 'Comprehensive replacement guarantee ensures your long-term staffing success',
  },
  {
    title: 'Global talent pool',
    description: 'Access elite virtual assistants and specialized remote professionals from Latin America, the Caribbean, and beyond',
  },
]

export function WhatIsRpoSection() {
  return (
    <section className="bg-white px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">

          {/* Left — Text */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, ease: 'easeOut' }}
            className="max-w-xl"
          >
            <h2 className="text-4xl font-bold leading-tight tracking-tight text-[#0f2447]">
              What is Recruitment Process Outsourcing (RPO)?
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-slate-500">
              Our specialized remote talent acquisition team handles the entire recruitment
              process — from sourcing virtual assistants and specialized professionals to
              screening, interviewing, and background verification. When you outsource your
              talent search to RemoteHero, you gain access to pre-vetted offshore talent who
              perfectly match your requirements at 50–70% lower costs than traditional hiring,
              all while maintaining exceptional quality.
            </p>
          </motion.div>

          {/* Right — Card */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, ease: 'easeOut', delay: 0.1 }}
          >
            <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-[#0f2447] to-[#1a3a6e] shadow-2xl shadow-[#0f2447]/30">
              {/* Subtle grid overlay */}
              <div className="pointer-events-none absolute inset-0 [background-image:linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:40px_40px]" />
              {/* Sky accent bar */}
              <div className="absolute left-0 right-0 top-0 h-[3px] bg-gradient-to-r from-sky-400 via-sky-500 to-sky-400" />

              <Card.Header className="relative pt-8">
                <Card.Title className="text-2xl font-bold text-white">
                  Pay only when you hire
                </Card.Title>
                <Card.Description className="mt-1 text-base text-sky-100/70">
                  Unlike traditional recruitment firms, you only pay when you successfully hire
                  a candidate.
                </Card.Description>
              </Card.Header>

              <Card.Content className="relative">
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  {benefits.map((item) => (
                    <div key={item.title} className="flex gap-3">
                      <CircleCheck className="mt-0.5 size-5 shrink-0 text-emerald-400" />
                      <div>
                        <p className="text-sm font-semibold text-white">{item.title}</p>
                        <p className="mt-1 text-sm leading-relaxed text-slate-300">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card.Content>
            </Card>
          </motion.div>

        </div>
      </div>
    </section>
  )
}
