import { createFileRoute } from '@tanstack/react-router'
import { motion } from 'motion/react'
import { CheckCircle2 } from 'lucide-react'
import { PublicNavbar } from '../components/landing/PublicNavbar'
import { Footer } from '../components/landing/Footer'

export const Route = createFileRoute('/hiring-process')({
  component: HiringProcessPage,
})

const VIEW = { once: true, margin: '-100px' } as const
const AIRTABLE_URL = 'https://airtable.com/appOWPxckxVIjvMdu/pagnHiNvYtKCl8mqf/form'

const steps = [
  {
    n: 1,
    title: 'Apply',
    desc: "Submit your application through our simple online form. We'll gather information about your skills, experience, and career aspirations to help match you with the right opportunities.",
    tags: ['Online application form', 'Resume submission', 'Initial skills assessment'],
  },
  {
    n: 2,
    title: 'Schedule Screening Interview',
    desc: "If your profile aligns with our opportunities, our team will reach out to schedule an initial screening interview. This conversation helps us better understand your qualifications and what you're looking for in your next role.",
    tags: ['30-45 minute video call', 'Skills and experience verification', 'Cultural fit assessment'],
  },
  {
    n: 3,
    title: 'Background Check',
    desc: 'We conduct thorough background checks to verify your credentials and ensure a safe hiring environment. This includes reference checks, employment verification, and an assessment of relevant technical skills.',
    tags: ['Employment verification', 'Reference checks', 'Technical skills assessment'],
  },
  {
    n: 4,
    title: 'Interview with the Client',
    desc: "After passing our internal screening, we'll arrange interviews with potential clients who are looking for your skillset. We prepare you thoroughly for each interview to maximize your chances of success.",
    tags: ['Client-specific preparation', 'Video interview coordination', 'Feedback and follow-up'],
  },
  {
    n: 5,
    title: 'Onboard',
    desc: 'Congratulations! Once you receive and accept an offer, our team supports you through a smooth onboarding process. We handle administrative details and provide resources to ensure you start your new role confidently and successfully.',
    tags: ['Contract preparation', 'Administrative setup', 'Ongoing support resources'],
  },
]

function HiringProcessPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <PublicNavbar />
      <main className="flex-1">

        {/* Hero */}
        <section className="bg-gradient-to-b from-sky-200 to-white px-6 pb-20 pt-20 lg:pb-28 lg:pt-28">
          <div className="mx-auto max-w-3xl text-center">
            <motion.h1
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55 }}
              className="mb-5 text-4xl font-extrabold leading-tight tracking-tight text-[#0f2447] lg:text-6xl"
            >
              Our <span className="text-sky-600">Hiring Process</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-lg leading-relaxed text-[#0f2447]/65"
            >
              A streamlined approach to help you find the perfect talent match
            </motion.p>
          </div>
        </section>

        {/* Timeline */}
        <section className="bg-white px-6 pb-24 pt-8">
          <div className="mx-auto max-w-3xl">
            <div className="relative">

              {/* Vertical connector line */}
              <motion.div
                initial={{ scaleY: 0 }}
                whileInView={{ scaleY: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, ease: 'easeInOut' }}
                style={{ originY: 0 }}
                className="absolute left-[2.375rem] top-10 -z-0 hidden h-[calc(100%-5rem)] w-px bg-gradient-to-b from-sky-300 via-sky-400 to-[#0f2447] sm:block"
              />

              <div className="flex flex-col gap-12">
                {steps.map((step, i) => (
                  <div key={step.n} className="flex gap-6 sm:gap-10">

                    {/* Circle */}
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      viewport={VIEW}
                      transition={{ type: 'spring', stiffness: 200, damping: 18, delay: i * 0.1 }}
                      className="relative z-10 flex size-[4.75rem] shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-sky-400 to-[#0f2447] shadow-lg shadow-sky-200"
                    >
                      <span className="text-2xl font-black text-white">{step.n}</span>
                    </motion.div>

                    {/* Content */}
                    <motion.div
                      initial={{ opacity: 0, x: 40 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={VIEW}
                      transition={{ duration: 0.55, delay: i * 0.1 + 0.05 }}
                      className="flex-1 pb-2 pt-3"
                    >
                      <h3 className="mb-3 text-xl font-extrabold tracking-tight text-[#0f2447]">
                        {step.title}
                      </h3>
                      <p className="mb-5 text-base leading-relaxed text-[#0f2447]/60">
                        {step.desc}
                      </p>
                      <div className="flex flex-wrap gap-3">
                        {step.tags.map((tag) => (
                          <span
                            key={tag}
                            className="inline-flex items-center gap-1.5 rounded-full bg-sky-50 px-3.5 py-1.5 text-xs font-semibold text-sky-700"
                          >
                            <CheckCircle2 size={12} className="shrink-0" />
                            {tag}
                          </span>
                        ))}
                      </div>
                    </motion.div>

                  </div>
                ))}
              </div>

            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-sky-50 px-6 py-20">
          <div className="mx-auto max-w-2xl text-center">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={VIEW}
              transition={{ duration: 0.5 }}
              className="mb-8 text-3xl font-extrabold tracking-tight text-[#0f2447] lg:text-4xl"
            >
              Ready to Start Your Journey?
            </motion.h2>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={VIEW}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <a
                href={AIRTABLE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block rounded-xl bg-[#0f2447] px-12 py-4 text-base font-bold text-white shadow-lg shadow-[#0f2447]/20 transition-opacity hover:opacity-90"
              >
                Apply Now
              </a>
            </motion.div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  )
}
