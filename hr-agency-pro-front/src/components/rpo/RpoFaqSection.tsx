import { Accordion } from '@heroui/react'
import { ChevronDown } from 'lucide-react'
import { motion } from 'motion/react'

const faqs = [
  {
    id: 'pricing',
    question: 'How does the RPO pricing work?',
    answer:
      "Our pricing is role-based. You only pay when we successfully place a candidate, and it's a monthly fee of the agreed salary whether the role is part time or full time contractor.",
  },
  {
    id: 'speed',
    question: 'How quickly can you find candidates?',
    answer:
      'On average, we present the first batch of pre-vetted candidates within 2 weeks of engagement. Complete placement typically happens within 3-4 weeks, depending on your interview process.',
  },
  {
    id: 'guarantee',
    question: "What happens if a hire doesn't work out?",
    answer: 'We offer a replacement guarantee.',
  },
  {
    id: 'regions',
    question: 'What regions do you source talent from?',
    answer:
      'We specialize in Latin American talent and the Caribbean, but can source from other regions upon request like the Philippines and more. Latin America offers excellent English skills, timezone alignment with the US, and significant cost savings.',
  },
]

export function RpoFaqSection() {
  return (
    <section className="bg-white px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center text-3xl font-bold tracking-tight text-[#0f2447] lg:text-4xl"
        >
          Frequently Asked Questions
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, delay: 0.15 }}
        >
          <Accordion className="w-full divide-y divide-slate-100 rounded-2xl bg-white px-2 shadow-sm shadow-slate-200/60 ring-1 ring-slate-100">
            {faqs.map((faq) => (
              <Accordion.Item key={faq.id} id={faq.id}>
                <Accordion.Heading>
                  <Accordion.Trigger className="w-full py-5 text-left text-base font-semibold text-slate-800 transition-colors hover:text-[#0f2447]">
                    {faq.question}
                    <Accordion.Indicator className="ml-auto shrink-0 text-slate-400 transition-transform">
                      <ChevronDown className="size-4" />
                    </Accordion.Indicator>
                  </Accordion.Trigger>
                </Accordion.Heading>
                <Accordion.Panel>
                  <Accordion.Body className="pb-5 text-sm leading-relaxed text-slate-500">
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
