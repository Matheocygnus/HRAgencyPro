import { api } from '../lib/api'
import type { Hero } from '../types/hero.types'

function flattenHero(h: any): Hero {
  return {
    ...h,
    firstName: h.prospect?.firstName ?? h.firstName ?? '',
    lastName: h.prospect?.lastName ?? h.lastName ?? '',
    email: h.prospect?.email ?? h.email ?? '',
    phone: h.prospect?.phone ?? h.phone ?? '',
    skills: h.prospect?.skills
      ? h.prospect.skills.split(',').map((s: string) => s.trim()).filter(Boolean)
      : (h.skills ?? []),
  }
}

export const heroesApi = {
  list: (params?: { clientId?: number }) =>
    api.get<any[]>('/heroes', { params }).then(r => r.data.map(flattenHero)),
  get: (id: number) => api.get<any>(`/heroes/${id}`).then(r => flattenHero(r.data)),
  create: (data: Partial<Hero>) => api.post<Hero>('/heroes', data).then(r => r.data),
  update: (id: number, data: Partial<Hero>) =>
    api.patch<Hero>(`/heroes/${id}`, data).then(r => r.data),
  remove: (id: number) => api.delete(`/heroes/${id}`).then(r => r.data),
}
