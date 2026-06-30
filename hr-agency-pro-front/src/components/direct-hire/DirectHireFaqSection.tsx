import { Accordion } from '@heroui/react'
import { ChevronDown } from 'lucide-react'
import { motion } from 'motion/react'

const faqs = [
  {
    id: 'vs-rpo',
    question: 'How is direct hire different from RPO?',
    answer:
      'Direct Hire focuses on permanent, full-time placements with a one-time fee based on first-year salary. RPO (Recruitment Process Outsourcing) is a more comprehensive solution where we manage the entire recruitment process for multiple roles on an ongoing basis.',
  },
  {
    id: 'guarantee',
    question: "What happens if a candidate doesn't work out?",
    answer:
      "Our 30-day replacement guarantee means that if a placed candidate leaves or doesn't meet expectations within the first 30 days, we'll find a replacement at no additional cost.",
  },
  {
    id: 'payment',
    question: 'How do I pay the placed candidates?',
    answer:
      "You can choose to pay candidates directly through your own entity, use our employer of record services, or work with our recommended payroll partners. We provide guidance on the best employment structure based on your needs and the candidate's country of residence.",
  },
  {
    id: 'timeline',
    question: 'How long does the direct hire process take?',
    answer:
      'Typically, we present pre-vetted candidates within 1-2 weeks and most placements are completed within 3-5 weeks from the initial consultation. Timeline may vary based on role complexity and your interview process.',
  },
]

export function DirectHireFaqSection() {
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
