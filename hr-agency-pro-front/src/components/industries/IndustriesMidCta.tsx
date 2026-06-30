import { useState } from 'react'
import { Button } from '@heroui/react'
import { motion } from 'motion/react'
import { GetStartedModal } from '../how-it-works/GetStartedModal'

export function IndustriesMidCta() {
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <section className="bg-white pb-12 pt-4 lg:pb-16 lg:pt-6">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.45 }}
        className="flex justify-center"
      >
        <Button
          size="lg"
          className="bg-[#0f2447] font-semibold text-white shadow-lg shadow-[#0f2447]/20 hover:bg-[#162f5c]"
          onPress={() => setModalOpen(true)}
        >
          Hire a Hero
        </Button>
      </motion.div>

      <GetStartedModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </section>
  )
}
