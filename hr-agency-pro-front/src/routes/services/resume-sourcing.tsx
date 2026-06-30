import { createFileRoute } from '@tanstack/react-router'
import { PublicNavbar } from '../../components/landing/PublicNavbar'
import { Footer } from '../../components/landing/Footer'
import { ResumeSourcingHeroSection } from '../../components/resume-sourcing/ResumeSourcingHeroSection'
import { ResumeSourcingHowItWorks } from '../../components/resume-sourcing/ResumeSourcingHowItWorks'
import { ResumeSourcingTiers } from '../../components/resume-sourcing/ResumeSourcingTiers'
import { ResumeSourcingBenefits } from '../../components/resume-sourcing/ResumeSourcingBenefits'
import { ResumeSourcingCta } from '../../components/resume-sourcing/ResumeSourcingCta'

function ResumeSourcingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <PublicNavbar />
      <main className="flex-1">
        <ResumeSourcingHeroSection />
        <ResumeSourcingHowItWorks />
        <ResumeSourcingTiers />
        <ResumeSourcingBenefits />
        <ResumeSourcingCta />
      </main>
      <Footer />
    </div>
  )
}

export const Route = createFileRoute('/services/resume-sourcing')({
  component: ResumeSourcingPage,
})
