import { createFileRoute } from '@tanstack/react-router'
import { PublicNavbar } from '../components/landing/PublicNavbar'
import { HeroSection } from '../components/landing/HeroSection'
import { StatsBanner } from '../components/landing/StatsBanner'
import { TestimonialsSection } from '../components/landing/TestimonialsSection'
import { ProblemSolutionSection } from '../components/landing/ProblemSolutionSection'
import { HeroCTACard } from '../components/landing/HeroCTACard'
import { HowItWorksSection } from '../components/landing/HowItWorksSection'
import { FeaturesSection } from '../components/landing/FeaturesSection'
import { SavingsCalculatorSection } from '../components/landing/SavingsCalculatorSection'
import { PricingSection } from '../components/landing/PricingSection'
import { PlanYourTeamCTA } from '../components/landing/PlanYourTeamCTA'
import { FAQSection } from '../components/landing/FAQSection'
import { ReadyToBuildCTA } from '../components/landing/ReadyToBuildCTA'
import { Footer } from '../components/landing/Footer'

export const Route = createFileRoute('/')({
  component: LandingPage,
})

function LandingPage() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-white text-slate-900">
      <PublicNavbar />
      <main>
        <HeroSection />
        <TestimonialsSection />
        <StatsBanner />
        <ProblemSolutionSection />
        <HeroCTACard />
        <HowItWorksSection />
        <FeaturesSection />
        <SavingsCalculatorSection />
        <PricingSection />
        <PlanYourTeamCTA />
        <FAQSection />
        <ReadyToBuildCTA />
      </main>
      <Footer />
    </div>
  )
}
