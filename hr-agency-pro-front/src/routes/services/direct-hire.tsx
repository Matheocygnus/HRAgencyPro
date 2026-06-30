import { createFileRoute } from '@tanstack/react-router'
import { PublicNavbar } from '../../components/landing/PublicNavbar'
import { Footer } from '../../components/landing/Footer'
import { DirectHireHeroSection } from '../../components/direct-hire/DirectHireHeroSection'
import { DirectHireInfoSection } from '../../components/direct-hire/DirectHireInfoSection'
import { DirectHireProcessSection } from '../../components/direct-hire/DirectHireProcessSection'
import { DirectHirePricingSection } from '../../components/direct-hire/DirectHirePricingSection'
import { TestimonialsSection } from '../../components/landing/TestimonialsSection'
import { DirectHireFaqSection } from '../../components/direct-hire/DirectHireFaqSection'
import { DirectHireCtaSection } from '../../components/direct-hire/DirectHireCtaSection'

const directHireTestimonials = [
  {
    id: 1,
    name: 'Perla Tapiero',
    initials: 'PT',
    role: 'CEO',
    company: 'Chai Mazel',
    avatarColor: 'bg-violet-500',
    text: "RemoteHero's direct hire service connected us with top-tier global developers who have completely transformed our engineering team. The quality of talent exceeded our expectations, and we're saving over 45% on salary costs compared to local hires.",
  },
  {
    id: 2,
    name: 'Jay Abramowitz',
    initials: 'JA',
    role: 'CEO',
    company: 'Pearl Benefits Group',
    avatarColor: 'bg-sky-500',
    text: "The 30-day replacement guarantee gave us confidence to try RemoteHero's service, but we haven't needed to use it. Their thorough vetting process ensured we only interviewed candidates who were perfect fits for our team and culture from day one.",
  },
]

export const Route = createFileRoute('/services/direct-hire')({
  component: DirectHirePage,
})

function DirectHirePage() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-white text-slate-900">
      <PublicNavbar />
      <main>
        <DirectHireHeroSection />
        <DirectHireInfoSection />
        <DirectHireProcessSection />
        <DirectHirePricingSection />
        <TestimonialsSection testimonials={directHireTestimonials} />
        <DirectHireFaqSection />
        <DirectHireCtaSection />
      </main>
      <Footer />
    </div>
  )
}
