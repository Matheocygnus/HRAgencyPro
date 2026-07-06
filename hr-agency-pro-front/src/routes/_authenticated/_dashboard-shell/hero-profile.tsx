import { createFileRoute, useNavigate, redirect } from '@tanstack/react-router'
import { useEffect } from 'react'
import { useAuth } from '../../../features/auth/use-auth'
import { getRoleLanding } from '../../../lib/role-landing'

export const Route = createFileRoute('/_authenticated/_dashboard-shell/hero-profile')({
  beforeLoad: ({ context }: any) => {
    const p: string[] = context?.permissions ?? []
    if (!p.includes('hero_dashboard')) {
      throw redirect({ to: getRoleLanding(p) as any })
    }
  },
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
