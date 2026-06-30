import { Accordion } from '@heroui/react'
import { ChevronDown } from 'lucide-react'
import { motion } from 'motion/react'

const faqs = [
  {
    id: 'vetting',
    question: 'How does your talent vetting process work?',
    answer: "Our multi-step vetting process includes rigorous skill assessments, technical interviews, and cultural fit evaluations to ensure you only meet top-tier professionals.",
  },
  {
    id: 'speed',
    question: 'How quickly can I find a match?',
    answer: "Depending on the role's complexity, we typically present pre-vetted candidates within 3 to 5 business days from our initial consultation.",
  },
  {
    id: 'expectations',
    question: "What if the talent doesn't meet my expectations?",
    answer: "We offer a risk-free trial and a strict replacement guarantee. If a placed candidate leaves or doesn't meet expectations within the first 30 days, we'll find a replacement at no additional cost.",
  },
  {
    id: 'parttime',
    question: 'Do you offer part-time talent?',
    answer: "While our primary focus is on full-time permanent placements, we do offer flexible solutions and part-time talent depending on your specific needs and the chosen pricing tier.",
  },
  {
    id: 'payments',
    question: 'How are payments handled?',
    answer: "Payments are handled securely through our platform. For contractors and RPO, we use a fixed monthly rate. For Direct Hire, it is a one-time percentage of the candidate's first-year salary.",
  },
]

export function HowItWorksFaq() {
  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-4xl px-6">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-16 text-center"
        >
          <span className="mb-6 inline-block rounded-full bg-sky-50 px-4 py-1 text-sm font-bold tracking-wider text-sky-700">
            FAQ
          </span>
          <h2 className="mb-6 text-4xl font-bold text-slate-900 lg:text-5xl">
            Frequently asked questions
          </h2>
          <p className="mx-auto max-w-2xl text-xl text-slate-500">
            Get answers to the most common questions about our platform.
          </p>
        </motion.div>

        {/* Accordion */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, delay: 0.1 }}
          className="mx-auto max-w-3xl"
        >
          <Accordion className="w-full divide-y divide-slate-100 rounded-2xl bg-white px-2 shadow-sm shadow-slate-200/60 ring-1 ring-slate-100">
            {faqs.map((faq) => (
              <Accordion.Item key={faq.id} id={faq.id}>
                <Accordion.Heading>
                  <Accordion.Trigger className="w-full py-5 text-left text-lg font-semibold text-slate-900 transition-colors hover:text-[#0f2447]">
                    {faq.question}
                    <Accordion.Indicator className="ml-auto shrink-0 text-slate-400 transition-transform">
                      <ChevronDown className="size-5" />
                    </Accordion.Indicator>
                  </Accordion.Trigger>
                </Accordion.Heading>
                <Accordion.Panel>
                  <Accordion.Body className="pb-5 leading-relaxed text-slate-500">
                    {faq.answer}
                  </Accordion.Body>
                </Accordion.Panel>
              </Accordion.Item>
            ))}
          </Accordion>
        </motion.div>

      </div>
    </section>
  )
}
