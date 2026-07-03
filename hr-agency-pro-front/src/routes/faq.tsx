import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { motion } from 'motion/react'
import { ChevronDown } from 'lucide-react'
import { PublicNavbar } from '../components/landing/PublicNavbar'
import { Footer } from '../components/landing/Footer'
import { GetStartedModal } from '../components/how-it-works/GetStartedModal'

export const Route = createFileRoute('/faq')({
  component: FaqPage,
})

type FaqItem = { q: string; a: string }

const sections: Array<{ title: string; items: FaqItem[] }> = [
  {
    title: 'General',
    items: [
      {
        q: 'What is Remote Hero?',
        a: 'Remote Hero is a talent matching platform that connects US companies with pre-vetted remote professionals from Latin America, the Caribbean, the Philippines, and Europe. We handle the entire sourcing, screening, and shortlisting process so you can focus on interviewing the best candidates.',
      },
      {
        q: 'What regions do your candidates come from?',
        a: 'Our talent network spans Latin America (Argentina, Colombia, Mexico, Brazil, Chile), the Caribbean, the Philippines, Eastern Europe, and select markets in Western Europe. All candidates are fluent in English and experienced working with US teams.',
      },
      {
        q: 'How long does the hiring process take?',
        a: 'We deliver your first shortlisted candidates within 3–5 business days of receiving your requirements. Most clients complete interviews and make an offer within 2–3 weeks. Time-to-hire depends on role complexity and how quickly your team can schedule interviews.',
      },
      {
        q: 'Are your candidates employees or contractors?',
        a: 'Candidates can be engaged as either full-time employees or independent contractors, depending on your needs and the region. We advise on the best structure for compliance and cost efficiency and can connect you with EOR partners when needed.',
      },
    ],
  },
  {
    title: 'For Employers',
    items: [
      {
        q: 'How do you vet candidates?',
        a: 'Every candidate goes through a multi-stage process: skills assessment, structured behavioral interviews, English proficiency evaluation, and reference checks. Only the top 3% of applicants make it to your shortlist. We also verify work history and professional references before presenting anyone to you.',
      },
      {
        q: 'What if the hire does not work out?',
        a: 'We offer a 90-day replacement guarantee. If the candidate leaves or does not meet expectations within the first 90 days, we will source and place a replacement at no additional charge. After that window, placements are covered by a reduced-rate replacement option.',
      },
      {
        q: 'What roles can you fill?',
        a: 'We cover a wide range of functions including Technology (Software Engineers, QA, DevOps, Data), Finance & Accounting, Marketing, HR, Customer Support, Operations, Administrative, Creative, Sales, and Research. See our Salary Guide for the full list of 98 vetted role types.',
      },
      {
        q: 'Do you handle payroll and compliance?',
        a: 'We are a talent matching service, not a PEO or EOR. However, we work closely with trusted payroll and compliance partners and can introduce you to the right provider based on your jurisdiction needs and headcount.',
      },
    ],
  },
  {
    title: 'For Talent',
    items: [
      {
        q: 'How do I apply to join the Remote Hero network?',
        a: 'You can submit your application through our Careers page. After a review of your profile, qualified candidates are invited to a skills assessment and interview. We actively place candidates who pass our vetting into open roles with US companies.',
      },
      {
        q: 'What types of roles are available?',
        a: 'We place professionals across Technology, Finance, Marketing, HR, Customer Support, Operations, Creative, Administrative, Sales, and Research functions. Roles range from junior to senior and lead levels, with most positions being full-time remote.',
      },
      {
        q: 'How does compensation work?',
        a: 'Compensation is negotiated directly between you and the hiring company. Remote Hero does not take a cut of your salary. Our Salary Guide shows typical ranges for each role so you can benchmark your expectations before interviews.',
      },
      {
        q: 'Is there a cost to join the network?',
        a: 'There is absolutely no cost to candidates. Remote Hero is fully funded by the hiring companies we serve. Our goal is to connect exceptional talent with great opportunities — not to charge the people looking for work.',
      },
    ],
  },
  {
    title: 'Pricing & Process',
    items: [
      {
        q: 'How much does Remote Hero charge employers?',
        a: 'Our pricing is based on a one-time placement fee tied to the annual salary of the hired professional. There are no monthly subscription fees or retainers. Contact us for a detailed quote based on your specific roles and volume.',
      },
      {
        q: 'Are there any hidden fees?',
        a: 'No. We believe in radical transparency. The fee we quote you before starting the search is the only fee you pay. No sourcing fees, no retainer deposits, and no surprise charges at any stage of the process.',
      },
      {
        q: 'What happens after I submit my requirements?',
        a: "After you submit your job requirements, a Remote Hero account manager will schedule a 30-minute discovery call to align on role details, culture fit, and timeline. We then activate your search immediately and deliver your first shortlist within 3–5 business days.",
      },
      {
        q: 'Do you offer volume discounts for multiple hires?',
        a: 'Yes. We offer preferential pricing for companies hiring 3 or more positions at once, and ongoing enterprise agreements for teams that plan to hire consistently. Reach out to discuss a custom arrangement that fits your roadmap.',
      },
    ],
  },
]

function AccordionItem({ item, isOpen, onToggle }: { item: FaqItem; isOpen: boolean; onToggle: () => void }) {
  return (
    <div className="border-b border-slate-100 last:border-b-0">
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-4 py-5 text-left"
      >
        <span className="text-base font-semibold text-slate-900">{item.q}</span>
        <ChevronDown
          size={18}
          className={`shrink-0 text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 pb-5 opacity-100' : 'max-h-0 opacity-0'}`}
      >
        <p className="text-base leading-relaxed text-slate-500">{item.a}</p>
      </div>
    </div>
  )
}

function FaqPage() {
  const [modalOpen, setModalOpen] = useState(false)
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({})

  const toggle = (key: string) => {
    setOpenItems((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  return (
    <div className="flex min-h-screen flex-col">
      <PublicNavbar />
      <main className="flex-1 bg-white">

        {/* ── Hero ─────────────────────────────────────────── */}
        <section className="bg-gradient-to-br from-slate-50 to-sky-50/40 px-6 py-24 lg:py-32">
          <div className="mx-auto max-w-3xl text-center">
            <motion.span
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              className="mb-6 inline-block rounded-full bg-sky-100 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-sky-700"
            >
              Help Center
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.08 }}
              className="mb-6 text-4xl font-extrabold tracking-tight text-slate-900 lg:text-5xl"
            >
              Frequently Asked Questions
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="text-lg leading-relaxed text-slate-500"
            >
              Everything you need to know about Remote Hero — how we work, what we cost,
              and how we can help you build your remote team.
            </motion.p>
          </div>
        </section>

        {/* ── FAQ Sections ─────────────────────────────────── */}
        <section className="px-6 py-20">
          <div className="mx-auto max-w-3xl">
            <div className="flex flex-col gap-12">
              {sections.map((section, si) => (
                <motion.div
                  key={section.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, delay: si * 0.08 }}
                >
                  <h2 className="mb-4 text-xl font-bold text-[#0f2447]">{section.title}</h2>
                  <div className="rounded-2xl border border-slate-200 bg-white px-6 shadow-sm">
                    {section.items.map((item, ii) => {
                      const key = `${si}-${ii}`
                      return (
                        <AccordionItem
                          key={key}
                          item={item}
                          isOpen={!!openItems[key]}
                          onToggle={() => toggle(key)}
                        />
                      )
                    })}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Still have questions ──────────────────────────── */}
        <section className="border-t border-slate-100 bg-slate-50 px-6 py-16">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="mb-3 text-2xl font-bold text-slate-900">Still have questions?</h2>
            <p className="mb-8 text-slate-500">
              Our team is happy to walk you through how Remote Hero works and answer anything specific to your situation.
            </p>
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <button
                onClick={() => setModalOpen(true)}
                className="rounded-xl bg-[#0f2447] px-8 py-3.5 text-base font-bold text-white transition-colors hover:bg-[#162f5c]"
              >
                Talk to Our Team
              </button>
              <a
                href="https://form.typeform.com/to/aKI8I8lO"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl border border-slate-300 px-8 py-3.5 text-base font-semibold text-slate-700 transition-colors hover:border-slate-400 hover:bg-slate-100"
              >
                Send a Message
              </a>
            </div>
          </div>
        </section>

        {/* ── CTA Banner ───────────────────────────────────── */}
        <section className="bg-[#0f2447] px-6 py-20">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-4 text-3xl font-bold text-white lg:text-4xl">
              Ready to hire smarter?
            </h2>
            <p className="mb-8 text-slate-300">
              Join 300+ companies building world-class remote teams with Remote Hero.
            </p>
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <button
                onClick={() => setModalOpen(true)}
                className="rounded-xl bg-sky-500 px-8 py-3.5 text-base font-bold text-white transition-colors hover:bg-sky-400"
              >
                Get Started Today
              </button>
              <a
                href="/about"
                className="rounded-xl border border-white/30 px-8 py-3.5 text-base font-semibold text-white transition-colors hover:bg-white/10"
              >
                Learn About Us
              </a>
            </div>
          </div>
        </section>

      </main>
      <Footer />
      <GetStartedModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  )
}
