import { motion } from 'motion/react'
import { Mail, Phone } from 'lucide-react'
import { Widget } from '@typeform/embed-react'

const TYPEFORM_ID = 'aKI8I8lO'
const VIEW = { once: true, margin: '-80px' } as const

export function ReadyToBuildCTA() {
  return (
    <section className="relative overflow-hidden bg-[#07172e] px-6 py-20 lg:px-8 lg:py-28">

      {/* Background layers */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#0f2447] via-[#07172e] to-[#030c1c]" />

      {/* Dot grid texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: 'radial-gradient(circle, #93c5fd 1px, transparent 1px)',
          backgroundSize: '36px 36px',
        }}
      />

      {/* Sky glow top-right */}
      <div className="pointer-events-none absolute -right-40 -top-40 size-[600px] rounded-full bg-sky-500/10 blur-[120px]" />
      {/* Navy glow bottom-left */}
      <div className="pointer-events-none absolute -bottom-40 -left-40 size-[500px] rounded-full bg-sky-800/20 blur-[100px]" />

      <div className="relative mx-auto max-w-7xl">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-20">

          {/* Left: copy + contact */}
          <motion.div
            initial={{ opacity: 0, x: -32 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={VIEW}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            {/* Accent line */}
            <div className="mb-6 h-1 w-14 rounded-full bg-sky-400" />

            <h2 className="mb-5 text-4xl font-extrabold leading-tight tracking-tight text-white lg:text-5xl">
              Ready to Build a{' '}
              <span className="text-sky-400">High-Performing</span>{' '}
              Remote Team?
            </h2>

            <p className="mb-10 text-lg leading-relaxed text-white/55">
              Let's talk about your needs and how we can help you find the
              perfect talent for your team.
            </p>

            <div className="flex flex-col gap-4">
              <a
                href="mailto:info@remotehero.us"
                className="group flex items-center gap-3 text-white/70 transition-colors duration-200 hover:text-sky-400"
              >
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 transition-colors duration-200 group-hover:border-sky-400/30 group-hover:bg-sky-400/10">
                  <Mail size={18} />
                </span>
                <span className="text-base font-medium">info@remotehero.us</span>
              </a>

              <a
                href="tel:+17862481067"
                className="group flex items-center gap-3 text-white/70 transition-colors duration-200 hover:text-sky-400"
              >
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 transition-colors duration-200 group-hover:border-sky-400/30 group-hover:bg-sky-400/10">
                  <Phone size={18} />
                </span>
                <span className="text-base font-medium">(786) 248-1067</span>
              </a>
            </div>
          </motion.div>

          {/* Right: Typeform widget */}
          <motion.div
            initial={{ opacity: 0, x: 32 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={VIEW}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
            className="overflow-hidden rounded-2xl border border-white/10 shadow-2xl"
            style={{ height: '480px' }}
          >
            <Widget
              id={TYPEFORM_ID}
              style={{ width: '100%', height: '100%' }}
            />
          </motion.div>

        </div>
      </div>
    </section>
  )
}
