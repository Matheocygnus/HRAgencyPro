import { redirect } from '@tanstack/react-router'
import { hasPermission } from './permissions'
import { getRoleLanding } from './role-landing'

export function guardRoute(permission: string) {
  return ({ context }: any) => {
    const permissions: string[] = context?.permissions ?? []
    if (!hasPermission(permissions, permission)) {
      throw redirect({ to: getRoleLanding(permissions) as any })
    }
  }
}

// Heroes list: heroes and clients must never see the global roster — agency-level only.
export function guardHerosList() {
  return ({ context }: any) => {
    const permissions: string[] = context?.permissions ?? []
    if (permissions.includes('hero_dashboard') || permissions.includes('client_dashboard')) {
      throw redirect({ to: getRoleLanding(permissions) as any })
    }
    if (!hasPermission(permissions, 'heroes:read')) {
      throw redirect({ to: getRoleLanding(permissions) as any })
    }
  }
}

// Shared routes accessible to ALL known roles (recruiter + client + hero).
// Use for /contracts and /invoices — backend handles per-role data scoping.
export function guardAllRoles() {
  return ({ context }: any) => {
    const p: string[] = context?.permissions ?? []
    const known = p.includes('*') || p.includes('dashboard') ||
                  p.includes('client_dashboard') || p.includes('hero_dashboard')
    if (!known) throw redirect({ to: getRoleLanding(p) as any })
  }
}

// Shared routes accessible to recruiter and client ONLY (not hero).
// Use for /interviews and /jobs.
export function guardClientOrRecruiter() {
  return ({ context }: any) => {
    const p: string[] = context?.permissions ?? []
    if (!p.includes('*') && !p.includes('dashboard') && !p.includes('client_dashboard')) {
      throw redirect({ to: getRoleLanding(p) as any })
    }
  }
}

// Company detail (/companies/:id): clients pass through — backend validates ownership.
export function guardCompanyDetail() {
  return ({ context }: any) => {
    const permissions: string[] = context?.permissions ?? []
    if (hasPermission(permissions, 'companies:read') || permissions.includes('client_dashboard')) return
    throw redirect({ to: getRoleLanding(permissions) as any })
  }
}

// Heroes profile (/heroes/:id): a hero user may only access their own profile.
export function guardHeroProfile() {
  return ({ context, params }: any) => {
    const permissions: string[] = context?.permissions ?? []
    if (permissions.includes('hero_dashboard')) {
      const user = context.queryClient?.getQueryData(['auth', 'me']) as any
      const heroId = user?.heroId
      if (!heroId || heroId !== parseInt(params.id, 10)) {
        throw redirect({ to: '/hero-dashboard' as any })
      }
    }
  }
}
