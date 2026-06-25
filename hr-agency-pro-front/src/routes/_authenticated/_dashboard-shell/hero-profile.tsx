import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'
import { useAuth } from '../../../features/auth/use-auth'

export const Route = createFileRoute('/_authenticated/_dashboard-shell/hero-profile')({
  component: HeroProfileRedirect,
})

function HeroProfileRedirect() {
  const navigate = useNavigate()
  const { user } = useAuth()

  useEffect(() => {
    if (user?.heroId) {
      void navigate({ to: '/heroes/$id', params: { id: String(user.heroId) } })
    }
  }, [user?.heroId, navigate])

  return null
}
