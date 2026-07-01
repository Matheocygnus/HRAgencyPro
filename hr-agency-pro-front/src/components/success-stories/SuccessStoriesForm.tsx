import { motion } from 'motion/react'

export function SuccessStoriesForm() {
  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-5xl px-6">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <h2 className="mb-4 text-4xl font-bold text-slate-900">
            Build a high-performing team for 70% less
          </h2>
          <p className="text-sm font-bold uppercase tracking-widest text-slate-500">
            Trusted by 30+ top US companies
          </p>
        </motion.div>

        {/* Typeform embedded inline — the dark navy "Let's get started!" screen is Typeform's own welcome screen */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mx-auto max-w-4xl overflow-hidden rounded-3xl shadow-2xl"
        >
          <iframe
            src="https://form.typeform.com/to/aKI8I8lO"
            style={{ width: '100%', height: '600px', border: 'none' }}
            title="Get Started Form"
          />
        </motion.div>

      </div>
    </section>
  )
}
