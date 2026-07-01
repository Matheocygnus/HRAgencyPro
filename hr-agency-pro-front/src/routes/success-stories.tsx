import { createFileRoute } from '@tanstack/react-router'
import { PublicNavbar } from '../components/landing/PublicNavbar'
import { Footer } from '../components/landing/Footer'
import { SuccessStoriesHero } from '../components/success-stories/SuccessStoriesHero'
import { SuccessStoriesDetails } from '../components/success-stories/SuccessStoriesDetails'
import { SuccessStoriesForm } from '../components/success-stories/SuccessStoriesForm'
import { SuccessStoriesCta } from '../components/success-stories/SuccessStoriesCta'

function SuccessStoriesPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <PublicNavbar />
      <main className="flex-1">
        <SuccessStoriesHero />
        <SuccessStoriesDetails />
        <SuccessStoriesForm />
        <SuccessStoriesCta />
      </main>
      <Footer />
    </div>
  )
}

export const Route = createFileRoute('/success-stories')({
  component: SuccessStoriesPage,
})
