import { X, Mail, Phone } from 'lucide-react'

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  )
}

function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  )
}

const sections = [
  {
    title: 'Solutions',
    links: [
      { label: 'For Employers', href: '/for-employers' },
      { label: 'For Talent', href: '/for-talent' },
      { label: 'For Agencies', href: '/for-agencies' },
      { label: 'Enterprise', href: '/enterprise' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', href: '/about' },
      { label: 'Blog', href: '/blog' },
      { label: 'Careers', href: '/careers' },
      { label: 'Contact', href: '/contact' },
      { label: 'Sign In', href: 'https://form.typeform.com/to/aKI8I8lO' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Guides', href: '/guides' },
      { label: 'Remote Work Tips', href: '/remote-work-tips' },
      { label: 'Hiring Process', href: '/hiring-process' },
      { label: 'FAQs', href: '/faq' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy', href: '/privacy' },
      { label: 'Terms', href: '/terms' },
      { label: 'Cookies', href: '/cookies' },
      { label: 'Accessibility', href: '/accessibility' },
      { label: 'Communications', href: '#' },
    ],
  },
]

const socials = [
  { Icon: InstagramIcon, href: 'https://instagram.com/remotehero', label: 'Instagram' },
  { Icon: LinkedinIcon, href: 'https://linkedin.com/company/remotehero', label: 'LinkedIn' },
  { Icon: X, href: 'https://x.com/remotehero', label: 'X / Twitter' },
  { Icon: Mail, href: 'mailto:info@remotehero.us', label: 'Email' },
  { Icon: Phone, href: 'tel:+17862481067', label: 'Phone' },
]

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* Top grid — brand col (2 spans) + 4 link columns */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-6 lg:gap-12">

          {/* Brand column — 2 spans */}
          <div className="lg:col-span-2">
            <p className="text-base font-black tracking-tight text-[#0f2447]">
              REMOTE <span className="text-sky-500">HERO</span>
            </p>
            <p className="mt-4 text-base leading-relaxed text-slate-500">
              Your trusted partner for finding exceptional remote talent from Latin America,
              the Caribbean, the Philippines, and Europe at 50–70% lower cost.
            </p>
            <div className="mt-6 flex items-center gap-4">
              {socials.map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-400 transition-colors duration-200 hover:text-[#0f2447]"
                >
                  <Icon className="size-[18px]" />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns — 1 span each */}
          {sections.map((section) => (
            <div key={section.title}>
              <p className="mb-4 text-sm font-bold uppercase tracking-wider text-slate-900">
                {section.title}
              </p>
              <ul className="flex flex-col gap-2">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-base text-slate-500 transition-colors duration-200 hover:text-sky-600"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

        </div>

        {/* Bottom — copyright + disclaimer */}
        <div className="mt-12 border-t border-slate-200 pt-8 text-center">
          <p className="mb-4 text-sm font-semibold text-slate-900">
            © 2026 Remote Hero LLC. All rights reserved.
          </p>
          <p className="mx-auto max-w-4xl text-xs leading-relaxed text-slate-400">
            Remote Hero acts solely as a talent matching service and does not assume any
            liability for the actions, performance, or conduct of hired professionals. Clients
            are responsible for their own hiring decisions, onboarding, training, and
            performance management.
          </p>
        </div>

      </div>
    </footer>
  )
}
