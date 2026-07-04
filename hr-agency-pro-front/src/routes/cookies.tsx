import { createFileRoute } from '@tanstack/react-router'
import { motion } from 'motion/react'
import { ArrowLeft, Cookie } from 'lucide-react'
import { PublicNavbar } from '../components/landing/PublicNavbar'
import { Footer } from '../components/landing/Footer'

export const Route = createFileRoute('/cookies')({
  component: CookiesPage,
})

const VIEW = { once: true, margin: '-60px' } as const

const sections = [
  {
    n: '01',
    title: 'What Are Cookies?',
    body: 'Cookies are small data files stored on your device when you visit a website. They help us understand how users interact with the Site and improve functionality.',
    list: null,
  },
  {
    n: '02',
    title: 'Types of Cookies We Use',
    body: null,
    list: [
      'Essential Cookies: Necessary for basic site functionality;',
      'Performance Cookies: Measure traffic and improve performance;',
      'Functionality Cookies: Remember your preferences.',
    ],
  },
  {
    n: '03',
    title: 'Managing Cookies',
    body: 'Most browsers allow you to control cookies through settings. Disabling cookies may impact certain site features.',
    list: null,
  },
]

function CookiesPage() {
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
              <Cookie size={14} />
              Legal
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.05 }}
              className="mb-3 text-4xl font-extrabold tracking-tight text-[#0f2447] lg:text-5xl"
            >
              Cookie Policy
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.1 }}
              className="mb-4 text-sm font-medium text-[#0f2447]/40"
            >
              Effective Date: January 1, 2024
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.15 }}
              className="text-base leading-relaxed text-[#0f2447]/60"
            >
              This Cookie Policy describes how Remote Hero uses cookies and similar technologies.
            </motion.p>
          </div>
        </section>

        {/* Content */}
        <section className="px-6 pb-20 pt-4">
          <div className="mx-auto max-w-3xl">
            <div className="flex flex-col gap-8">
              {sections.map((s, i) => (
                <motion.div
                  key={s.n}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={VIEW}
                  transition={{ duration: 0.45, delay: i * 0.06 }}
                  className="rounded-2xl border border-slate-100 bg-white p-8 shadow-sm"
                >
                  <div className="mb-4 flex items-center gap-3">
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-sm font-black text-sky-600">
                      {s.n}
                    </span>
                    <h2 className="text-lg font-extrabold text-[#0f2447]">{s.title}</h2>
                  </div>

                  {s.body && (
                    <p className="text-sm leading-relaxed text-[#0f2447]/60">{s.body}</p>
                  )}

                  {s.list && (
                    <ul className="space-y-2">
                      {s.list.map((item) => (
                        <li key={item} className="flex items-start gap-2 text-sm leading-relaxed text-[#0f2447]/60">
                          <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-sky-400" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  )}
                </motion.div>
              ))}
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
