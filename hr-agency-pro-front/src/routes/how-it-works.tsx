import { createFileRoute } from '@tanstack/react-router'
import { PublicNavbar } from '../components/landing/PublicNavbar'
import { Footer } from '../components/landing/Footer'
import { HowItWorksHero } from '../components/how-it-works/HowItWorksHero'
import { HowItWorksFeatures } from '../components/how-it-works/HowItWorksFeatures'
import { HowItWorksTeamCta } from '../components/how-it-works/HowItWorksTeamCta'
import { HowItWorksPricing } from '../components/how-it-works/HowItWorksPricing'
import { HowItWorksFaq } from '../components/how-it-works/HowItWorksFaq'
import { HowItWorksCta } from '../components/how-it-works/HowItWorksCta'

function HowItWorksPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <PublicNavbar />
      <main className="flex-1">
        <HowItWorksHero />
        <HowItWorksFeatures />
        <HowItWorksTeamCta />
        <HowItWorksPricing />
        <HowItWorksFaq />
        <HowItWorksCta />
      </main>
      <Footer />
    </div>
  )
}

export const Route = createFileRoute('/how-it-works')({
  component: HowItWorksPage,
})
