import { Chip, Card, Avatar, Button } from '@heroui/react'
import { Info } from 'lucide-react'
import { motion } from 'motion/react'

const checkItems = [
  'We helped one client scale from 1 to 40+ contractors',
  'We handle sourcing, vetting, and replacement so you scale without friction',
  'First candidates delivered in 2–4 weeks',
]

const candidates = [
  {
    initials: 'AG',
    name: 'Ana García',
    role: 'Senior Full-Stack Dev',
    country: '🇲🇽 Mexico',
    avatarClass: 'bg-indigo-500',
    floatY: [0, -10, 0] as number[],
    duration: 4,
    delay: 0,
    position: 'left-0 top-[16px] w-[76%]',
  },
  {
    initials: 'CR',
    name: 'Carlos Rivas',
    role: 'Product Manager',
    country: '🇦🇷 Argentina',
    avatarClass: 'bg-emerald-500',
    floatY: [0, -14, 0] as number[],
    duration: 3.5,
    delay: 0.7,
    position: 'right-0 top-[190px] w-[72%]',
  },
  {
    initials: 'SM',
    name: 'Sofía Mendez',
    role: 'UX / UI Designer',
    country: '🇨🇴 Colombia',
    avatarClass: 'bg-violet-500',
    floatY: [0, -8, 0] as number[],
    duration: 5,
    delay: 1.4,
    position: 'bottom-[72px] left-[6%] w-[70%]',
  },
]

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15, delayChildren: 0.35 } },
}

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  show: { opacity: 1, x: 0, transition: { duration: 0.45, ease: 'easeOut' } },
}

function FloatingCard({ c }: { c: (typeof candidates)[0] }) {
  return (
    <motion.div
      className={`absolute ${c.position}`}
      animate={{ y: c.floatY }}
      transition={{ duration: c.duration, repeat: Infinity, ease: 'easeInOut', delay: c.delay }}
    >
      <Card className="border border-slate-100 bg-white shadow-xl shadow-slate-200/70">
        <Card.Content className="flex flex-row items-center gap-3 p-4">
          <Avatar size="sm">
            <Avatar.Fallback className={`${c.avatarClass} text-[11px] font-bold text-white`}>
              {c.initials}
            </Avatar.Fallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-slate-900">{c.name}</p>
            <p className="truncate text-xs text-slate-500">{c.role}</p>
            <p className="mt-0.5 text-xs text-slate-400">
              {c.country}{' '}
              <span className="ml-1 text-amber-400">★★★★★</span>
            </p>
          </div>
          <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-[11px] text-emerald-600">
            ✓
          </span>
        </Card.Content>
      </Card>
    </motion.div>
  )
}

function DesktopVisual() {
  return (
    <div className="relative h-[500px] w-full">
      {candidates.map((c) => (
        <FloatingCard key={c.initials} c={c} />
      ))}

      {/* Floating stats badge */}
      <motion.div
        className="absolute bottom-0 right-0"
        animate={{ scale: [1, 1.04, 1] }}
        transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut', delay: 1.2 }}
      >
        <div className="rounded-2xl bg-[#0f2447] px-6 py-5 text-white shadow-2xl">
          <p className="text-3xl font-black">40+</p>
          <p className="text-xs text-blue-200">Teams Scaled</p>
          <p className="mt-1 text-[10px] text-blue-300/80">avg. 2–4 weeks</p>
        </div>
      </motion.div>

      {/* Decorative blob */}
      <div className="pointer-events-none absolute inset-0 -z-10 rounded-full bg-gradient-to-br from-sky-100/50 via-transparent to-indigo-100/40 blur-3xl" />
    </div>
  )
}

function MobileVisual() {
  return (
    <div className="mt-8 flex gap-3">
      {candidates.slice(0, 2).map((c) => (
        <Card key={c.initials} className="flex-1 border border-slate-100 bg-white shadow-md">
          <Card.Content className="p-3">
            <Avatar size="sm">
              <Avatar.Fallback className={`${c.avatarClass} text-[10px] font-bold text-white`}>
                {c.initials}
              </Avatar.Fallback>
            </Avatar>
            <div className="mt-2">
              <p className="text-xs font-semibold text-slate-900">{c.name}</p>
              <p className="text-[10px] text-slate-500">{c.role}</p>
              <p className="mt-1 text-[10px] text-amber-400">★★★★★</p>
            </div>
          </Card.Content>
        </Card>
      ))}
    </div>
  )
}

export function HeroSection() {
  return (
    <section className="relative overflow-hidden px-4 py-16 sm:px-6 lg:px-8 lg:py-28">
      {/* Background decoration */}
      <div
        aria-hidden
        className="pointer-events-none absolute right-0 top-0 -z-10 h-[65%] w-[55%] rounded-bl-[80px] bg-gradient-to-br from-sky-50/90 to-indigo-50/70"
      />

      <div className="mx-auto max-w-7xl">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left: text */}
          <div className="flex flex-col gap-6">
            <Chip className="w-fit border border-sky-200 bg-sky-100/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-sky-700">
              Nearshore Staffing — Latin America
            </Chip>

            <h1 className="text-4xl font-black leading-[1.1] tracking-tight text-[#0f2447] sm:text-5xl lg:text-[3.25rem]">
              Build your nearshore team{' '}
              <span className="text-sky-500">without the hiring headaches.</span>
            </h1>

            <p className="text-base leading-relaxed text-slate-500 sm:text-lg">
              From your first hire to your 20th, we help you source, vet, and retain
              high-performing remote talent — so you can scale faster without wasting
              months on bad hires.
            </p>

            {/* Staggered checkmarks */}
            <motion.ul
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="flex flex-col gap-3"
            >
              {checkItems.map((item) => (
                <motion.li key={item} variants={itemVariants} className="flex items-start gap-3">
                  <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-sky-500 text-[11px] font-bold text-white mt-0.5">
                    ✓
                  </span>
                  <span className="text-sm leading-snug text-slate-700 sm:text-[15px]">{item}</span>
                </motion.li>
              ))}
            </motion.ul>

            {/* CTAs */}
            <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button
                size="lg"
                className="w-full bg-[#0f2447] font-semibold text-white shadow-lg shadow-[#0f2447]/25 hover:opacity-90 sm:w-auto"
              >
                Book a Strategy Call
              </Button>
              <Button
                size="lg"
                variant="bordered"
                className="w-full border-slate-300 font-medium text-slate-700 hover:border-[#0f2447]/50 hover:text-[#0f2447] sm:w-auto"
              >
                Calculate Your Savings
              </Button>
            </div>
            <p className="flex items-center gap-1.5 text-xs text-slate-400">
              <Info className="size-3.5 shrink-0" />
              Best for companies hiring 3+ roles in the next 3–6 months
            </p>
          </div>

          {/* Right: visual */}
          <div>
            <div className="hidden lg:block">
              <DesktopVisual />
            </div>
            <div className="lg:hidden">
              <MobileVisual />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
