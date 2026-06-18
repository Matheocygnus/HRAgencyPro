export const hasPermission = (perms: string[], req: string): boolean => {
  if (perms.includes('*')) return true
  if (!req) return true
  if (perms.includes(req)) return true
  // Flat permission grants all sub-permissions: 'heroes' satisfies 'heroes:read', 'heroes:create', etc.
  const base = req.includes(':') ? req.split(':')[0] : null
  if (base && perms.includes(base)) return true
  return false
}
