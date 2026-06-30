import { useState } from 'react'
import { Button } from '@heroui/react'
import { ChevronRight } from 'lucide-react'
import { motion } from 'motion/react'
import { GetStartedModal } from '../how-it-works/GetStartedModal'

const industries = [
  {
    title: 'Marketing & Media',
    description: 'From social media managers to content creators and analysts, we provide creative professionals to power your marketing initiatives.',
    image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=800&q=80',
    href: '#',
  },
  {
    title: 'Startup',
    description: 'Scale your startup with flexible, cost-effective talent solutions. From technical roles to operations, we help founders build their dream teams without breaking the bank.',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
    href: '#',
  },
  {
    title: 'Wellness',
    description: 'Support your wellness business with remote professionals experienced in client management, scheduling, content creation, and program administration.',
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80',
    href: '#',
  },
  {
    title: 'Professional Services',
    description: 'Streamline your operations with virtual assistants, project coordinators, and client service professionals who understand the demands of service-based businesses.',
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80',
    href: '#',
  },
  {
    title: 'Technology',
    description: 'We help tech companies scale faster with skilled remote developers, product managers, and support teams—aligned with your workflows and time zones.',
    image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=800&q=80',
    href: '#',
  },
  {
    title: 'Financial Institutions',
    description: 'Enhance your operations with remote professionals trained in compliance, customer service, data entry, and financial analysis.',
    image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=800&q=80',
    href: '#',
  },
  {
    title: 'E-commerce',
    description: 'Boost your e-commerce business with remote talent skilled in customer support, inventory management, product listings, and marketing automation.',
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=800&q=80',
    href: '#',
  },
  {
    title: 'Healthcare',
    description: 'Support your healthcare operations with remote professionals experienced in scheduling, medical billing, patient communication, and admin support.',
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80',
    href: '#',
  },
  {
    title: 'Real Estate',
    description: 'Our virtual assistants streamline real estate operations with transaction coordination, property listings, client communication, and administrative support.',
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80',
    href: '#',
  },
  {
    title: 'Finance & Legal',
    description: 'Our vetted professionals support finance and legal teams with precision, compliance, and efficiency—ideal for bookkeeping, legal assistants, and admin roles.',
    image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80',
    href: '#',
  },
]

export function IndustriesGrid() {
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <section className="bg-white pb-24">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-6 md:grid-cols-2 lg:grid-cols-3">
        {industries.map((industry, i) => (
          <motion.a
            key={industry.title}
            href={industry.href}
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.06 }}
            className="group relative block h-[380px] w-full overflow-hidden rounded-2xl shadow-lg transition-all hover:shadow-xl"
          >
            <img
              src={industry.image}
              alt={industry.title}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/70 to-transparent" />
            <div className="absolute bottom-0 left-0 flex w-full flex-col justify-end p-8">
              <h3 className="mb-3 text-2xl font-bold text-white">{industry.title}</h3>
              <p className="mb-5 line-clamp-4 text-sm leading-relaxed text-slate-300">
                {industry.description}
              </p>
              <span className="flex items-center text-sm font-semibold text-sky-400 transition-colors group-hover:text-sky-300">
                Learn more
                <ChevronRight
                  size={16}
                  className="ml-1 transition-transform group-hover:translate-x-1"
                />
              </span>
            </div>
          </motion.a>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.45 }}
        className="mt-16 flex justify-center"
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
