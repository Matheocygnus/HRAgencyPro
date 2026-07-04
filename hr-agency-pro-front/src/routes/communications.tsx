import { createFileRoute } from '@tanstack/react-router'
import { motion } from 'motion/react'
import { ArrowLeft, MessageCircle } from 'lucide-react'
import { PublicNavbar } from '../components/landing/PublicNavbar'
import { Footer } from '../components/landing/Footer'

export const Route = createFileRoute('/communications')({
  component: CommunicationsPage,
})

const VIEW = { once: true, margin: '-60px' } as const

const sections = [
  {
    n: '01',
    title: 'Scope of Communications',
    body: 'We may contact users by:',
    list: [
      'SMS messages (via Dialpad, Google Voice, or similar platforms);',
      'Email communications;',
      'Voice calls or voicemail drops;',
      'Platform notifications.',
    ],
    note: null,
  },
  {
    n: '02',
    title: 'Purpose of Communications',
    body: 'Communications may include:',
    list: [
      'Account-related updates and transactional information;',
      'Job opportunities or applicant communications;',
      'Service announcements or feature updates;',
      'Marketing or promotional materials.',
    ],
    note: null,
  },
  {
    n: '03',
    title: 'Legal Basis for Communications',
    body: 'We rely on the following legal grounds:',
    list: [
      'Consent (under TCPA, CAN-SPAM, GDPR);',
      'Contract performance;',
      'Compliance with legal obligations;',
      'Legitimate interest in improving user experience.',
    ],
    note: null,
  },
  {
    n: '04',
    title: 'Opt-Out Options',
    body: 'You may withdraw consent at any time by:',
    list: [
      'Replying "STOP" to any SMS;',
      'Clicking "Unsubscribe" in any marketing email;',
    ],
    listEmail: true,
    note: 'Please note that opting out of certain communications may limit your ability to receive important service-related updates.',
  },
  {
    n: '05',
    title: 'Message/Data Rates',
    body: 'Message and data rates may apply for SMS or voice communications. Users are responsible for any charges incurred.',
    list: null,
    note: null,
  },
  {
    n: '06',
    title: 'International Users',
    body: 'If you access the Site from outside the United States, you consent to the transfer of your information to the United States. We take reasonable measures to comply with international privacy laws such as GDPR.',
    list: null,
    note: null,
  },
  {
    n: '07',
    title: 'Updates to This Policy',
    body: 'We may update this Communications Policy periodically. Continued use of our services following such changes constitutes your acknowledgment and acceptance.',
    list: null,
    note: null,
  },
]

function CommunicationsPage() {
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
              <MessageCircle size={14} />
              Legal
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.05 }}
              className="mb-3 text-4xl font-extrabold tracking-tight text-[#0f2447] lg:text-5xl"
            >
              Communications Policy
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
              This Communications Policy governs how Remote Hero LLC uses electronic
              communications to contact users and outlines your rights under applicable laws.
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

                  {s.body && (
                    <p className="mb-3 text-sm leading-relaxed text-[#0f2447]/60">{s.body}</p>
                  )}

                  {s.list && (
                    <ul className="space-y-2">
                      {s.list.map((item) => (
                        <li key={item} className="flex items-start gap-2 text-sm leading-relaxed text-[#0f2447]/60">
                          <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-sky-400" />
                          {item}
                        </li>
                      ))}
                      {'listEmail' in s && s.listEmail && (
                        <li className="flex items-start gap-2 text-sm leading-relaxed text-[#0f2447]/60">
                          <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-sky-400" />
                          Emailing{' '}
                          <a href="mailto:info@remotehero.us" className="font-semibold text-sky-600 hover:underline">
                            info@remotehero.us
                          </a>
                          .
                        </li>
                      )}
                    </ul>
                  )}

                  {s.note && (
                    <p className="mt-4 text-sm leading-relaxed text-[#0f2447]/60">{s.note}</p>
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
