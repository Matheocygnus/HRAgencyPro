import { Button } from '@heroui/react'
import { motion } from 'motion/react'

export function DirectHireHeroSection() {
  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8 lg:py-32">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 lg:grid-cols-2">

        {/* Left — Text */}
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.55, ease: 'easeOut' }}
        >
          <h1 className="text-5xl font-bold leading-tight tracking-tight text-[#0f2447] lg:text-6xl">
            Direct Hire & Placement Services
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-500">
            Find exceptional permanent talent from Latin America, the Caribbean, Philippines,
            Europe, and USA. We can also find permanent employees in your local area for
            in-person work if needed. Our Direct Hire & Placement service helps you build
            your team with pre-vetted professionals that match your technical requirements and
            company culture, with significant cost savings from our international talent.
          </p>

          <div className="mt-8">
            <a
              href="https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ2Vts8_v7vuhCkkyAyi4-UA4HVpw6fXPtLXR_8I2yIgcAd2-8qJQ4XWvzq9CAf5A97beplaWtvk"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                size="lg"
                className="bg-[#0f2447] font-semibold text-white shadow-lg shadow-[#0f2447]/20 hover:bg-[#162f5c]"
              >
                Talk to a placement expert today
              </Button>
            </a>
          </div>
        </motion.div>

        {/* Right — Image */}
        <motion.div
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.55, ease: 'easeOut', delay: 0.1 }}
        >
          <img
            src="https://images.unsplash.com/photo-1573164713988-8665fc963095?q=80&w=1469&auto=format&fit=crop"
            alt="Professionals celebrating a successful hire"
            className="h-[400px] w-full rounded-2xl object-cover shadow-2xl shadow-slate-300/50 lg:h-[500px]"
          />
        </motion.div>

      </div>
    </section>
  )
}
