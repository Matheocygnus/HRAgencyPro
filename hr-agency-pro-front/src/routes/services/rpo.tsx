import { createFileRoute } from '@tanstack/react-router'
import { PublicNavbar } from '../../components/landing/PublicNavbar'
import { Footer } from '../../components/landing/Footer'
import { RpoHeroSection } from '../../components/rpo/RpoHeroSection'
import { WhatIsRpoSection } from '../../components/rpo/WhatIsRpoSection'
import { ComprehensiveOutsourcingSection } from '../../components/rpo/ComprehensiveOutsourcingSection'
import { TrackRecordSection } from '../../components/rpo/TrackRecordSection'
import { RpoFaqSection } from '../../components/rpo/RpoFaqSection'
import { RpoCtaSection } from '../../components/rpo/RpoCtaSection'

export const Route = createFileRoute('/services/rpo')({
  component: ServicesRpoPage,
})

function ServicesRpoPage() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-white text-slate-900">
      <PublicNavbar />
      <main>
        <RpoHeroSection />
        <WhatIsRpoSection />
        <ComprehensiveOutsourcingSection />
        <TrackRecordSection />
        <RpoFaqSection />
        <RpoCtaSection />
      </main>
      <Footer />
    </div>
  )
}
