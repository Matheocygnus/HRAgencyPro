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

const VIEW = { once: true, margin: '-60px' } as const

const faqs: Array<{ q: string; a: string }> = [
  {
    q: 'What is nearshore staffing?',
    a: 'Nearshore staffing is the practice of hiring remote professionals from nearby countries that share your time zone — typically Latin America for US companies. Unlike offshore outsourcing (e.g., India or the Philippines), nearshore talent works in the same or similar working hours as your team, making real-time collaboration seamless. Remote Hero specializes in nearshore staffing from Latin America, connecting US businesses with pre-vetted English-fluent professionals at 50–70% less than domestic hiring costs.',
  },
  {
    q: 'Why choose Latin America for nearshore hiring?',
    a: 'Latin America offers the ideal combination of time zone alignment, English proficiency, cultural compatibility, and cost savings for US companies. Countries like Colombia, Mexico, Argentina, Chile, and Costa Rica produce highly skilled professionals across tech, marketing, operations, and customer support — all working in US business hours. Remote Hero\'s nearshore model means no 12-hour time difference, no overnight delays, and no cultural friction.',
  },
  {
    q: 'How is nearshore staffing different from a traditional recruiter?',
    a: 'A traditional recruiter finds candidates for local, in-house roles. A nearshore staffing agency like Remote Hero finds and places pre-vetted remote professionals from Latin America, handles sourcing and screening, and often supports ongoing compliance with international employment. We deliver first candidates in 2 weeks and offer a 60-day replacement guarantee — something traditional recruiters rarely provide for remote international hires.',
  },
  {
    q: 'What is Remote Hero?',
    a: 'Remote Hero is a talent matching platform that connects businesses with top-tier remote professionals from Latin America, the Caribbean, and the Philippines. We specialize in providing high-quality talent at 50–70% lower costs compared to US-based hires.',
  },
  {
    q: 'What regions do you source talent from?',
    a: 'We source talent primarily from Latin America (Colombia, Mexico, Argentina, Chile, Costa Rica, and more), the Caribbean, and the Philippines. All candidates are pre-vetted for English proficiency, technical skills, and cultural alignment with US business environments.',
  },
  {
    q: 'What types of roles do you support?',
    a: 'We support a wide range of roles including software development, design, marketing, customer support, virtual assistance, project management, finance, and more. Whether you need technical or non-technical professionals, we can find the right match for your requirements.',
  },
  {
    q: 'How does your talent vetting process work?',
    a: 'We have a rigorous vetting process that includes skills assessment, English proficiency evaluation, background checks, and cultural fit interviews. Only the top candidates make it to our talent pool, ensuring quality and reliability for our clients.',
  },
  {
    q: 'What are your different service models?',
    a: 'We offer two primary service models: Recruitment Process Outsourcing (RPO) and Direct Hire & Placement. RPO is a monthly subscription where we handle the entire recruitment process and payroll. Direct Hire involves a one-time fee of 20–25% of the first-year annual salary with a 60-day replacement guarantee.',
  },
  {
    q: 'How much can I save by hiring through Remote Hero?',
    a: 'Businesses typically save 50–70% on employment costs when hiring through Remote Hero compared to US-based talent. The exact savings depend on the role, experience level, and region. We offer transparent pricing and cost calculators to help you understand potential savings.',
  },
  {
    q: 'How quickly can I find a match?',
    a: 'Most clients find suitable matches within 1–2 weeks. For more specialized roles, it might take up to 3–4 weeks. We prioritize quality matches over speed to ensure long-term success.',
  },
  {
    q: 'How does your pricing work?',
    a: 'For RPO services, you pay a monthly fee that covers the talent\'s salary plus our service fee. For Direct Hire & Placement, you pay a one-time fee of 20–25% of the first-year annual salary. All pricing is transparent with no hidden fees.',
  },
  {
    q: 'What happens if the talent doesn\'t work out?',
    a: 'We offer a replacement guarantee for both service models. For RPO, we provide replacements as needed. For Direct Hire & Placement, we offer a 60-day replacement guarantee if the placement doesn\'t work out.',
  },
  {
    q: 'Do you offer part-time or project-based talent?',
    a: 'Yes, we can accommodate various working arrangements including full-time, part-time, and project-based work. We\'ll match you with talent that fits your specific requirements and schedule needs.',
  },
  {
    q: 'How are payments handled?',
    a: 'For RPO services, we invoice monthly for the talent\'s salary plus our service fee. For Direct Hire, payment is due upon successful placement. We accept various payment methods and provide detailed invoices for all transactions.',
  },
  {
    q: 'What industries do you serve?',
    a: 'We serve a wide range of industries including technology, healthcare, finance, education, e-commerce, and more. Our talent pool is diverse, allowing us to match professionals across various sectors and specializations.',
  },
  {
    q: 'How do I get started with Remote Hero?',
    a: 'Getting started is easy! You can schedule a discovery call with our team, fill out our contact form, or reach out via email or phone. We\'ll discuss your requirements, provide recommendations, and guide you through our process.',
  },
]

function AccordionItem({
  item,
  index,
  isOpen,
  onToggle,
}: {
  item: { q: string; a: string }
  index: number
  isOpen: boolean
  onToggle: () => void
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={VIEW}
      transition={{ duration: 0.4, delay: (index % 6) * 0.05 }}
      className="border-b border-slate-100 last:border-b-0"
    >
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-6 py-5 text-left"
      >
        <span className="text-base font-semibold text-slate-900">{item.q}</span>
        <ChevronDown
          size={18}
          className={`shrink-0 text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180 text-sky-500' : ''}`}
        />
      </button>

      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-96 pb-5 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <p className="text-base leading-relaxed text-slate-500">{item.a}</p>
      </div>
    </motion.div>
  )
}

function FaqPage() {
  const [modalOpen, setModalOpen] = useState(false)
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggle = (i: number) => setOpenIndex(openIndex === i ? null : i)

  return (
    <div className="flex min-h-screen flex-col">
      <PublicNavbar />
      <main className="flex-1 bg-white">

        {/* ── Hero ─────────────────────────────────────────────────────── */}
        <section className="bg-gradient-to-br from-slate-50 to-sky-50/40 px-6 py-24 lg:py-32">
          <div className="mx-auto max-w-3xl text-center">
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
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
              Find answers to the most common questions about Remote Hero's services,
              talent matching process, and how we can help your business save costs
              while accessing top-tier remote talent.
            </motion.p>
          </div>
        </section>

        {/* ── FAQ List ─────────────────────────────────────────────────── */}
        <section className="px-6 py-20">
          <div className="mx-auto max-w-3xl">
            <div className="rounded-2xl border border-slate-200 bg-white px-8 shadow-sm">
              {faqs.map((item, i) => (
                <AccordionItem
                  key={i}
                  item={item}
                  index={i}
                  isOpen={openIndex === i}
                  onToggle={() => toggle(i)}
                />
              ))}
            </div>
          </div>
        </section>

        {/* ── Bottom CTA ───────────────────────────────────────────────── */}
        <section className="border-t border-slate-100 bg-slate-50 px-6 py-16">
          <div className="mx-auto max-w-xl text-center">
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={VIEW}
              transition={{ duration: 0.45 }}
              className="mb-6 text-lg font-semibold text-slate-700"
            >
              Have more questions? We're here to help!
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={VIEW}
              transition={{ duration: 0.4, delay: 0.08 }}
              className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
            >
              <a
                href="https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ2UpOei0V8GAa6sYFiLO49OBQrFe2yiwB6JGXMGXUBIWB1zo2iunWj6GS5hJJBeP_h8G3AFT0hg"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl bg-[#0f2447] px-8 py-3.5 text-base font-bold text-white shadow-md shadow-[#0f2447]/20 transition-opacity hover:opacity-90"
              >
                Schedule a Discovery Call
              </a>
              <a
                href="mailto:info@remotehero.us"
                className="rounded-xl border border-slate-300 bg-white px-8 py-3.5 text-base font-semibold text-slate-700 transition-colors hover:border-slate-400 hover:bg-slate-100"
              >
                Email Us
              </a>
            </motion.div>
          </div>
        </section>

      </main>
      <Footer />
      <GetStartedModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  )
}
