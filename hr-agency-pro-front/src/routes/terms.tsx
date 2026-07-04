import { createFileRoute } from '@tanstack/react-router'
import { motion } from 'motion/react'
import { ArrowLeft, FileText } from 'lucide-react'
import { PublicNavbar } from '../components/landing/PublicNavbar'
import { Footer } from '../components/landing/Footer'

export const Route = createFileRoute('/terms')({
  component: TermsPage,
})

const VIEW = { once: true, margin: '-60px' } as const

const sections = [
  {
    n: '01',
    title: 'Scope of Services',
    body: 'Remote Hero provides a platform that connects independent contractors located in Latin America with companies based in the United States seeking remote, project-based services. Remote Hero does not employ contractors, nor does it guarantee employment, performance, or suitability of any particular engagement.',
    list: null,
  },
  {
    n: '02',
    title: 'Eligibility',
    body: 'By using the Site, you represent that you are at least 18 years of age and legally capable of entering into binding contracts under applicable law.',
    list: null,
  },
  {
    n: '03',
    title: 'Intellectual Property',
    body: 'All content, features, and functionality on the Site, including but not limited to text, graphics, logos, software, and the arrangement thereof, are the proprietary property of Remote Hero LLC and are protected by U.S. and international copyright, trademark, and intellectual property laws.',
    list: null,
  },
  {
    n: '04',
    title: 'User Conduct',
    body: 'You agree not to use the Site for any unlawful purpose or in any manner that could damage, disable, overburden, or impair the Site or interfere with any other user\'s use. Prohibited conduct includes, without limitation, attempting to gain unauthorized access to systems or data, submitting false information, or transmitting malicious software.',
    list: null,
  },
  {
    n: '05',
    title: 'Disclaimer of Warranties',
    body: 'The Site and all services are provided "as is" and "as available" without warranties of any kind, either express or implied, including but not limited to warranties of merchantability, fitness for a particular purpose, or non-infringement.',
    list: null,
  },
  {
    n: '06',
    title: 'Limitation of Liability',
    body: 'To the fullest extent permitted by law, Remote Hero LLC shall not be liable for any indirect, incidental, consequential, special, or punitive damages, or loss of profits or revenues, arising out of your access to or use of the Site or any content therein.',
    list: null,
  },
  {
    n: '07',
    title: 'Governing Law and Jurisdiction',
    body: 'These Terms shall be governed by and construed in accordance with the laws of the State of Florida, without regard to conflict of laws principles. Any legal action arising from these Terms shall be brought in the state or federal courts located in Miami-Dade County, Florida.',
    list: null,
  },
  {
    n: '08',
    title: 'Modifications to Terms',
    body: 'Remote Hero reserves the right to amend these Terms at any time without prior notice. The updated Terms will be posted on this page with a revised effective date. Continued use of the Site after such changes constitutes your acceptance of the revised Terms.',
    list: null,
  },
  {
    n: '09',
    title: 'Consent to Electronic Communications',
    body: 'By using the Site, you expressly consent to receive communications from us electronically, including SMS text messages, emails, and voice calls through platforms such as Dialpad and Google Voice. You may opt out at any time by following the instructions in each communication.',
    list: null,
  },
]

function TermsPage() {
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
              <FileText size={14} />
              Legal
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.05 }}
              className="mb-3 text-4xl font-extrabold tracking-tight text-[#0f2447] lg:text-5xl"
            >
              Terms and Conditions
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.1 }}
              className="mb-6 text-sm font-medium text-[#0f2447]/40"
            >
              Effective Date: January 1, 2024
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.15 }}
              className="flex flex-col gap-4"
            >
              <p className="text-base leading-relaxed text-[#0f2447]/60">
                Please read these Terms and Conditions ("Terms") carefully before accessing or using
                the website operated by Remote Hero LLC ("Remote Hero," "we," "us," or "our"). These
                Terms govern your use of the Site located at www.remotehero.us (the "Site") and any
                related services provided by us.
              </p>
              <p className="text-base leading-relaxed text-[#0f2447]/60">
                By accessing, browsing, or using the Site, you acknowledge that you have read,
                understood, and agree to be bound by these Terms and all applicable laws and
                regulations. If you do not agree to these Terms, you may not access or use the Site.
              </p>
            </motion.div>
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
