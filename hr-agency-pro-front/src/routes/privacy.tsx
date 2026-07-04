import { createFileRoute } from '@tanstack/react-router'
import { motion } from 'motion/react'
import { ArrowLeft, Shield } from 'lucide-react'
import { PublicNavbar } from '../components/landing/PublicNavbar'
import { Footer } from '../components/landing/Footer'

export const Route = createFileRoute('/privacy')({
  component: PrivacyPage,
})

const VIEW = { once: true, margin: '-60px' } as const

const sections = [
  {
    n: '01',
    title: 'Information Collected',
    body: 'We collect personal information that you voluntarily provide, such as your name, email, phone number, resume, professional background, and communications. We also collect data through cookies, IP addresses, browser types, and interactions with the Site.',
    list: null,
  },
  {
    n: '02',
    title: 'Use of Information',
    body: 'We use collected information to:',
    list: [
      'Provide and improve our services;',
      'Match contractors with relevant opportunities;',
      'Communicate with users;',
      'Comply with legal obligations;',
      'Analyze usage trends and security risks.',
    ],
  },
  {
    n: '03',
    title: 'Disclosure of Information',
    body: 'We do not sell personal information. We may share information with:',
    list: [
      'Service providers who assist in operating our platform;',
      'Law enforcement or regulatory authorities, when required;',
      'Third parties in connection with a merger, acquisition, or asset sale.',
    ],
  },
  {
    n: '04',
    title: 'Your Rights',
    body: 'Depending on your location, you may have rights under applicable law, including:',
    list: [
      'The right to access and correct your information;',
      'The right to request deletion;',
      'The right to object to processing or withdraw consent;',
      'The right to data portability.',
    ],
    footer: 'To exercise any rights, contact info@remotehero.us.',
  },
  {
    n: '05',
    title: 'Data Security',
    body: 'We implement technical and organizational safeguards to protect personal data from unauthorized access, disclosure, or destruction.',
    list: null,
  },
  {
    n: '06',
    title: 'Communications Consent',
    body: 'By submitting your contact information, you agree to receive communications via SMS, email, and voice calls through platforms such as Dialpad or Google Voice. Standard messaging rates may apply. You may opt out at any time by replying "STOP" to SMS messages or clicking "Unsubscribe" in emails.',
    list: null,
  },
]

function PrivacyPage() {
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
              <Shield size={14} />
              Legal
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.05 }}
              className="mb-3 text-4xl font-extrabold tracking-tight text-[#0f2447] lg:text-5xl"
            >
              Privacy Policy
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.1 }}
              className="mb-2 text-sm font-medium text-[#0f2447]/40"
            >
              Effective Date: January 1, 2024
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.15 }}
              className="text-base leading-relaxed text-[#0f2447]/60"
            >
              Remote Hero LLC respects the privacy of its users. This Privacy Policy outlines how
              we collect, use, disclose, and protect your personal information.
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
                  transition={{ duration: 0.45, delay: i * 0.04 }}
                  className="rounded-2xl border border-slate-100 bg-white p-8 shadow-sm"
                >
                  <div className="mb-4 flex items-center gap-3">
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-sm font-black text-sky-600">
                      {s.n}
                    </span>
                    <h2 className="text-lg font-extrabold text-[#0f2447]">{s.title}</h2>
                  </div>

                  <p className="text-sm leading-relaxed text-[#0f2447]/60">{s.body}</p>

                  {s.list && (
                    <ul className="mt-4 space-y-2">
                      {s.list.map((item) => (
                        <li key={item} className="flex items-start gap-2 text-sm leading-relaxed text-[#0f2447]/60">
                          <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-sky-400" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  )}

                  {'footer' in s && s.footer && (
                    <p className="mt-4 text-sm text-[#0f2447]/60">{s.footer}</p>
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
