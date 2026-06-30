import { createFileRoute } from '@tanstack/react-router'
import { PublicNavbar } from '../components/landing/PublicNavbar'
import { Footer } from '../components/landing/Footer'
import { IndustriesHero } from '../components/industries/IndustriesHero'
import { IndustriesGrid } from '../components/industries/IndustriesGrid'
import { IndustriesAfterHire } from '../components/industries/IndustriesAfterHire'
import { IndustriesProcess } from '../components/industries/IndustriesProcess'
import { IndustriesWhyLatam } from '../components/industries/IndustriesWhyLatam'

function IndustriesPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <PublicNavbar />
      <main className="flex-1">
        <IndustriesHero />
        <IndustriesGrid />
        <IndustriesAfterHire />
        <IndustriesProcess />
        <IndustriesWhyLatam />
      </main>
      <Footer />
    </div>
  )
}

export const Route = createFileRoute('/industries')({
  component: IndustriesPage,
})
