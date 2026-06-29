import { Card, Button, Chip } from '@heroui/react'
import { CalendarDays, CheckCircle2 } from 'lucide-react'
import { motion } from 'motion/react'

const criteria = [
  'Hiring 3+ roles over the next 3–6 months',
  'Looking to build long-term, retained teams',
  'Tired of inconsistent hiring results',
]

export function HeroCTACard() {
  return (
    <section className="px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <Card className="overflow-hidden border border-sky-100 bg-sky-50/60 shadow-xl shadow-sky-100/40">
            <Card.Content className="p-8 sm:p-10">
              <Chip
                color="warning"
                variant="flat"
                className="mb-6 text-xs font-bold uppercase tracking-widest"
              >
                Is This a Fit?
              </Chip>

              <div className="grid gap-8 lg:grid-cols-2 lg:gap-0">
                {/* Left: qualification criteria */}
                <div>
                  <h2 className="text-2xl font-black text-[#0f2447]">
                    We work best with companies:
                  </h2>
                  <ul className="mt-5 flex flex-col gap-3">
                    {criteria.map((c) => (
                      <li key={c} className="flex items-start gap-2.5">
                        <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-sky-500" />
                        <span className="text-slate-700">{c}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Right: CTA */}
                <div className="flex flex-col justify-center gap-4 lg:border-l lg:border-sky-200 lg:pl-12">
                  <p className="text-base leading-relaxed text-slate-500">
                    If you're planning to scale your team this year, let's map it out together.
                  </p>
                  <Button
                    size="lg"
                    className="w-fit bg-[#0f2447] font-semibold text-white shadow-lg shadow-[#0f2447]/25 hover:opacity-90"
                  >
                    <CalendarDays className="size-5" />
                    Book a Team Strategy Call
                  </Button>
                </div>
              </div>
            </Card.Content>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}
