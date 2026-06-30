import { useState } from 'react'
import { Button } from '@heroui/react'
import { motion } from 'motion/react'
import { GetStartedModal } from '../how-it-works/GetStartedModal'

const cards = [
  {
    title: 'Onboard, pay, retain',
    description: "We support you through the onboarding process and advise on strategies to pay and retain your top remote talent, setting up both you and your new hire for success.",
  },
  {
    title: 'Ongoing support & team expansion',
    description: "Get continuous support after you make a hire. As your business grows, we're ready to assist with team expansion, including high-volume hiring, executive search, and more.",
  },
]

export function IndustriesAfterHire() {
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <section className="bg-slate-50 py-24">
      <div className="mx-auto max-w-5xl px-6">

        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-8 text-center text-4xl font-bold text-slate-900"
        >
          After You Hire
        </motion.h2>

        {/* Cards grid */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {cards.map((card, i) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="rounded-2xl bg-slate-50 p-8 lg:p-10"
            >
              <h3 className="mb-4 text-xl font-bold text-slate-900">{card.title}</h3>
              <p className="leading-relaxed text-slate-500">{card.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Final CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-16 flex flex-col items-center px-6 text-center"
        >
          <Button
            size="lg"
            className="bg-[#0f2447] font-semibold text-white shadow-lg shadow-[#0f2447]/20 hover:bg-[#162f5c]"
            onPress={() => setModalOpen(true)}
          >
            Interview for Free
          </Button>
          <p className="mt-6 text-sm text-slate-400">
            {"Zero-risk hiring. If you don't make a hire, you don't pay anything."}
          </p>
        </motion.div>

      </div>

      <GetStartedModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </section>
  )
}
