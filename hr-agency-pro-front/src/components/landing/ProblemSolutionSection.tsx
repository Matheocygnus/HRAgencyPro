import { Chip, Card } from '@heroui/react'
import { XCircle, Users, RefreshCw, ClipboardList, TrendingUp } from 'lucide-react'
import { motion } from 'motion/react'

const problems = [
  'Poor role definition before hiring begins',
  "Weak vetting — candidates aren't truly assessed",
  "No replacement pipeline when someone doesn't work out",
]

const solutions = [
  {
    icon: Users,
    title: 'Pre-vetted candidates',
    description: 'Every hire goes through a structured multi-step vetting process.',
  },
  {
    icon: RefreshCw,
    title: 'Fast replacements',
    description: "If a hire isn't working, we replace them — no extra cost, no wasted time.",
  },
  {
    icon: ClipboardList,
    title: 'Structured hiring process',
    description: 'We define roles with you, not just fill them. You get the right fit, faster.',
  },
  {
    icon: TrendingUp,
    title: 'Built for repeat hiring',
    description: 'Our system is designed for companies scaling from 1 hire to 20+.',
  },
]

const up = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 } as object,
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.5, delay, ease: 'easeOut' },
})

export function ProblemSolutionSection() {
  return (
    <section className="bg-white px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-16 lg:grid-cols-2 lg:gap-20">

          {/* ── Left: The Problem ── */}
          <div className="flex flex-col gap-6">
            <motion.div {...up(0)}>
              <Chip
                color="danger"
                variant="flat"
                className="text-xs font-bold uppercase tracking-widest"
              >
                The Problem
              </Chip>
            </motion.div>

            <motion.h2
              {...up(0.1)}
              className="text-4xl font-black tracking-tight text-[#0f2447] lg:text-5xl"
            >
              Why most offshore hires fail
            </motion.h2>

            <motion.p {...up(0.2)} className="text-base leading-relaxed text-slate-500">
              Most companies don't fail because of talent. They fail because hiring is treated
              like a one-off decision instead of a system.
            </motion.p>

            <div className="mt-2 flex flex-col gap-4">
              {problems.map((problem, i) => (
                <motion.div
                  key={i}
                  {...up(0.3 + i * 0.1)}
                  className="flex items-start gap-3"
                >
                  <XCircle className="mt-0.5 size-5 shrink-0 text-red-500" />
                  <span className="text-slate-700">{problem}</span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* ── Right: How We're Different ── */}
          <div className="flex flex-col gap-6">
            <motion.div {...up(0)}>
              <Chip
                color="success"
                variant="flat"
                className="text-xs font-bold uppercase tracking-widest"
              >
                How We're Different
              </Chip>
            </motion.div>

            <motion.h2
              {...up(0.1)}
              className="text-4xl font-black tracking-tight text-[#0f2447] lg:text-5xl"
            >
              We don't just place contractors — we build your team.
            </motion.h2>

            <div className="mt-2 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {solutions.map((item, i) => {
                const Icon = item.icon
                return (
                  <motion.div key={i} {...up(0.2 + i * 0.1)}>
                    <Card className="h-full border border-slate-100 bg-white shadow-sm transition-shadow duration-200 hover:shadow-md">
                      <Card.Content className="flex flex-col gap-3 p-5">
                        <div className="flex size-10 items-center justify-center rounded-xl bg-[#0f2447]">
                          <Icon className="size-5 text-white" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{item.title}</p>
                          <p className="mt-1 text-sm leading-relaxed text-slate-500">
                            {item.description}
                          </p>
                        </div>
                      </Card.Content>
                    </Card>
                  </motion.div>
                )
              })}
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
