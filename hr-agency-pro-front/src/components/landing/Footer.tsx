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
      { label: 'For Employers', href: '#' },
      { label: 'For Talent', href: '#' },
      { label: 'For Agencies', href: '#' },
      { label: 'Enterprise', href: '#' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', href: '#' },
      { label: 'Blog', href: '#' },
      { label: 'Careers', href: '#' },
      { label: 'Contact', href: '#' },
      { label: 'Sign In', href: '#' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Guides', href: '#' },
      { label: 'Remote Work Tips', href: '#' },
      { label: 'Hiring Process', href: '#' },
      { label: 'FAQs', href: '#' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy', href: '#' },
      { label: 'Terms', href: '#' },
      { label: 'Cookies', href: '#' },
      { label: 'Accessibility', href: '#' },
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

        {/* Top grid — brand + 4 link columns */}
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-5">

          {/* Brand column */}
          <div className="md:col-span-2 lg:col-span-1">
            {/* Logo */}
            <p className="text-base font-black tracking-tight text-[#0f2447]">
              REMOTE <span className="text-sky-500">HERO</span>
            </p>

            {/* Tagline */}
            <p className="mt-4 text-base leading-relaxed text-slate-500">
              Your trusted partner for finding exceptional remote talent from Latin America,
              the Caribbean, the Philippines, and Europe at 50–70% lower cost.
            </p>

            {/* Social icons */}
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

          {/* Link columns */}
          {sections.map((section) => (
            <div key={section.title}>
              <p className="mb-6 text-xs font-bold uppercase tracking-wider text-[#0f2447]">
                {section.title}
              </p>
              <ul className="flex flex-col gap-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-base text-slate-600 transition-colors duration-200 hover:text-[#0f2447]"
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
        <div className="mt-12 border-t border-slate-200 pt-8">
          <p className="text-center text-sm font-medium text-slate-700">
            © 2026 Remote Hero LLC. All rights reserved.
          </p>
          <p className="mx-auto mt-2 max-w-4xl text-center text-xs leading-relaxed text-slate-400">
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
