/**
 * Returns the correct route based on the user's permissions array.
 * Wildcard '*' or 'dashboard' → /dashboard
 * 'client_dashboard'          → /client-dashboard
 * 'hero_dashboard'            → /hero-dashboard
 * 'prospect_dashboard'        → /prospect-dashboard
 */
export function getRoleLanding(permissions: string[]): string {
  if (permissions.includes('*') || permissions.includes('dashboard')) {
    return '/dashboard'
  }
  if (permissions.includes('client_dashboard')) {
    return '/client-dashboard'
  }
  if (permissions.includes('hero_dashboard')) {
    return '/hero-dashboard'
  }
  if (permissions.includes('prospect_dashboard')) {
    return '/prospect-dashboard'
  }
  return '/dashboard'
}
