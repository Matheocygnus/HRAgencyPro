import { Accordion, Chip } from '@heroui/react'
import { ChevronDown } from 'lucide-react'
import { motion } from 'motion/react'

const faqs = [
  {
    id: 'vetting',
    question: 'How does your talent vetting process work?',
    answer:
      "We have a multi-step screening process that includes technical skill assessment, soft skills evaluation, language proficiency tests, and background verification. Only the top 5% of applicants make it to our talent pool.",
  },
  {
    id: 'speed',
    question: 'How quickly can I find a match?',
    answer:
      'Most clients find suitable matches within 1-2 weeks. For more specialized roles, it might take up to 3 weeks. We prioritize quality matches over speed to ensure long-term success.',
  },
  {
    id: 'expectations',
    question: "What if the talent doesn't meet my expectations?",
    answer:
      "We offer a 14-day trial period for all placements. If you're not satisfied, we'll find a replacement at no additional cost. Our goal is your complete satisfaction.",
  },
  {
    id: 'part-time',
    question: 'Do you offer part-time talent?',
    answer:
      'Yes, we have both full-time and part-time professionals available. You can specify your preferred working arrangement, and we\'ll match you accordingly.',
  },
  {
    id: 'pricing',
    question: 'How is your pricing structured?',
    answer:
      "For RPO services, we charge a fixed monthly rate which covers all costs including legal and compliance. We handle the entire process from search to payment. For Direct Hire, our fee is 25% of the first-year salary, which is 50-70% lower than US rates. Custom enterprise pricing is available for larger volume needs.",
  },
]

export function FAQSection() {
  return (
    <section className="bg-slate-50/60 px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">

        {/* Header */}
        <div className="mb-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Chip
              variant="flat"
              className="mb-4 border border-sky-200 bg-sky-100/80 text-xs font-bold uppercase tracking-widest text-sky-700"
            >
              FAQ
            </Chip>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl font-black tracking-tight text-[#0f2447] lg:text-5xl"
          >
            Frequently asked questions
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mx-auto mt-4 max-w-xl text-base text-slate-500"
          >
            Everything you need to know before making your first hire with RemoteHero.
          </motion.p>
        </div>

        {/* Accordion */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.55, delay: 0.25, ease: 'easeOut' }}
        >
          <Accordion className="w-full divide-y divide-slate-100 rounded-2xl bg-white px-2 shadow-sm shadow-slate-200/60">
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
