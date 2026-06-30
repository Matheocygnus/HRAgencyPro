import { useState } from 'react'
import { Card, Avatar } from '@heroui/react'
import { Star, ChevronLeft, ChevronRight } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'

export type Testimonial = {
  id: number
  name: string
  initials: string
  role: string
  company: string
  avatarColor: string
  text: string
}

const defaultTestimonials: Testimonial[] = [
  {
    id: 1,
    name: 'Jay A.',
    initials: 'JA',
    role: 'Operations Director',
    company: 'TechFlow Inc.',
    avatarColor: 'bg-sky-500',
    text: 'Remote Hero completely transformed how we scale our ops team. Within 3 weeks we had two senior coordinators onboarded and running. The quality of candidates was exceptional — they pre-screened everything and saved us months of headaches. Best hiring decision we made this year.',
  },
  {
    id: 2,
    name: 'Camila M.',
    initials: 'CM',
    role: 'CEO & Founder',
    company: 'Bloom Digital',
    avatarColor: 'bg-violet-500',
    text: 'I was skeptical at first, but Remote Hero delivered beyond expectations. Our executive assistant from Colombia is incredibly professional and proactive — she has genuinely become a core part of our team. The 70% cost savings are real. I checked the numbers myself.',
  },
  {
    id: 3,
    name: 'Marcus R.',
    initials: 'MR',
    role: 'VP of Sales',
    company: 'Nexus Ventures',
    avatarColor: 'bg-emerald-500',
    text: 'We hired 4 SDRs through Remote Hero over 6 months. Retention has been outstanding — all 4 are still with us and two have already been promoted internally. The agency genuinely cares about long-term fit, not just getting a placement done.',
  },
]

const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? '35%' : '-35%', opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? '-35%' : '35%', opacity: 0 }),
}

function Stars() {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className="size-3.5 fill-amber-400 text-amber-400" />
      ))}
    </div>
  )
}

function GoogleBadge() {
  return (
    <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-slate-200">
      <span
        className="text-sm font-extrabold leading-none"
        style={{
          background: 'linear-gradient(135deg, #4285F4 30%, #EA4335 55%, #FBBC04 75%, #34A853)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}
      >
        G
      </span>
    </div>
  )
}

function TestimonialCard({ t }: { t: Testimonial }) {
  return (
    <Card className="flex h-full flex-col bg-white shadow-md shadow-slate-200/70">
      <Card.Header className="flex items-center gap-3 pb-2">
        <Avatar size="md">
          <Avatar.Fallback className={`${t.avatarColor} text-sm font-bold text-white`}>
            {t.initials}
          </Avatar.Fallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-slate-900">{t.name}</p>
          <p className="truncate text-xs text-slate-400">
            {t.role} · {t.company}
          </p>
          <Stars />
        </div>
        <GoogleBadge />
      </Card.Header>

      <Card.Content className="flex-1 pt-0">
        <p className="line-clamp-6 text-sm leading-relaxed text-slate-600">
          "{t.text}"
        </p>
      </Card.Content>

      <Card.Footer className="pt-2">
        <p className="text-xs text-slate-400">Posted on Google</p>
      </Card.Footer>
    </Card>
  )
}

const NavButton = ({
  onClick,
  label,
  children,
}: {
  onClick: () => void
  label: string
  children: React.ReactNode
}) => (
  <button
    onClick={onClick}
    aria-label={label}
    className="hidden size-10 shrink-0 items-center justify-center rounded-full bg-white shadow-md shadow-slate-200/80 ring-1 ring-slate-200/60 transition-all duration-200 hover:scale-105 hover:shadow-lg active:scale-95 sm:flex"
  >
    {children}
  </button>
)

export function TestimonialsSection({ testimonials = defaultTestimonials }: { testimonials?: Testimonial[] }) {
  const [current, setCurrent] = useState(0)
  const [direction, setDirection] = useState(1)
  const count = testimonials.length

  const goNext = () => {
    setDirection(1)
    setCurrent((v) => (v + 1) % count)
  }

  const goPrev = () => {
    setDirection(-1)
    setCurrent((v) => (v - 1 + count) % count)
  }

  const goTo = (i: number) => {
    setDirection(i > current ? 1 : -1)
    setCurrent(i)
  }

  const second = (current + 1) % count

  return (
    <section className="bg-[#f8fafc] px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-12 text-center">
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-sky-500">
            Reviews
          </p>
          <h2 className="text-4xl font-black tracking-tight text-[#0f2447] lg:text-5xl">
            What Our Clients Say
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base text-slate-500">
            Real feedback from businesses we've helped scale their nearshore teams.
          </p>
        </div>

        {/* Carousel row: [arrow] [cards] [arrow] */}
        <div className="flex items-center justify-center gap-5">
          <NavButton onClick={goPrev} label="Previous testimonial">
            <ChevronLeft className="size-5 text-slate-600" />
          </NavButton>

          {/* Cards — overflow-hidden clips the slide animation */}
          <div className="min-w-0 flex-1 overflow-hidden">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={current}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="grid grid-cols-1 items-stretch gap-6 md:grid-cols-2"
              >
                {/* Mobile: 1 card. Desktop col 1. */}
                <TestimonialCard t={testimonials[current]} />
                {/* Desktop col 2 only */}
                <div className="hidden h-full md:flex md:flex-col">
                  <TestimonialCard t={testimonials[second]} />
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <NavButton onClick={goNext} label="Next testimonial">
            <ChevronRight className="size-5 text-slate-600" />
          </NavButton>
        </div>

        {/* Dots — one per testimonial, work on every breakpoint */}
        <div className="mt-8 flex items-center justify-center gap-2">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`Go to testimonial ${i + 1}`}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === current ? 'w-6 bg-sky-500' : 'w-2 bg-slate-300 hover:bg-slate-400'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
