import { createFileRoute } from '@tanstack/react-router'
import { motion } from 'motion/react'
import { ArrowLeft, Accessibility } from 'lucide-react'
import { PublicNavbar } from '../components/landing/PublicNavbar'
import { Footer } from '../components/landing/Footer'

export const Route = createFileRoute('/accessibility')({
  component: AccessibilityPage,
})

const VIEW = { once: true, margin: '-60px' } as const

function AccessibilityPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <PublicNavbar />
      <main className="flex-1">

        {/* Hero */}
        <section className="bg-gradient-to-b from-sky-100 to-white px-6 pb-16 pt-20 lg:pt-28">
          <div className="mx-auto max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="mb-4 inline-flex items-center gap-2 rounded-full bg-sky-100 px-4 py-1.5 text-sm font-semibold text-sky-700"
            >
              <Accessibility size={14} />
              Legal
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.05 }}
              className="mb-3 text-4xl font-extrabold tracking-tight text-[#0f2447] lg:text-5xl"
            >
              Accessibility Statement
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.1 }}
              className="mb-4 text-sm font-medium text-[#0f2447]/40"
            >
              Effective Date: January 1, 2025
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.15 }}
              className="text-base leading-relaxed text-[#0f2447]/60"
            >
              Remote Hero is committed to ensuring digital accessibility for individuals with
              disabilities. We are continually working to improve the user experience and apply
              the relevant accessibility standards under the WCAG 2.1 Level AA guidelines.
            </motion.p>
          </div>
        </section>

        {/* Content */}
        <section className="px-6 pb-20 pt-4">
          <div className="mx-auto max-w-3xl">
            <div className="flex flex-col gap-8">

              {/* Measures Taken */}
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={VIEW}
                transition={{ duration: 0.45 }}
                className="rounded-2xl border border-slate-100 bg-white p-8 shadow-sm"
              >
                <div className="mb-4 flex items-center gap-3">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-sm font-black text-sky-600">
                    01
                  </span>
                  <h2 className="text-lg font-extrabold text-[#0f2447]">Measures Taken</h2>
                </div>
                <ul className="space-y-2">
                  {[
                    'Text alternatives for non-text content;',
                    'Keyboard navigation functionality;',
                    'Sufficient color contrast and scalable fonts.',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm leading-relaxed text-[#0f2447]/60">
                      <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-sky-400" />
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* Accessibility Feedback */}
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={VIEW}
                transition={{ duration: 0.45, delay: 0.06 }}
                className="rounded-2xl border border-slate-100 bg-white p-8 shadow-sm"
              >
                <div className="mb-4 flex items-center gap-3">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-sm font-black text-sky-600">
                    02
                  </span>
                  <h2 className="text-lg font-extrabold text-[#0f2447]">Accessibility Feedback</h2>
                </div>
                <p className="text-sm leading-relaxed text-[#0f2447]/60">
                  If you encounter any accessibility barriers while using the Site, please contact
                  us at{' '}
                  <a
                    href="mailto:info@remotehero.us"
                    className="font-semibold text-sky-600 hover:underline"
                  >
                    info@remotehero.us
                  </a>{' '}
                  and we will make reasonable efforts to accommodate your request.
                </p>
              </motion.div>

            </div>

            {/* Back link */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={VIEW}
              transition={{ duration: 0.4 }}
              className="mt-10"
            >
              <a
                href="/"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-6 py-3 text-sm font-semibold text-[#0f2447] transition-all hover:border-[#0f2447] hover:bg-[#0f2447] hover:text-white"
              >
                <ArrowLeft size={16} />
                Back to home
              </a>
            </motion.div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  )
}
