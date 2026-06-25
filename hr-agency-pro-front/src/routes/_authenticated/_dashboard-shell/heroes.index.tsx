import { useState } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { usePermissions } from '../../../features/auth/use-permissions'
import { useAuthContext } from '../../../features/auth/auth-context'
import { AccessDenied } from '../../../components/AccessDenied'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Table, Chip, Button, Card, SearchField, Skeleton } from '@heroui/react'
import { Plus } from 'lucide-react'
import { heroesApi } from '../../../api/heroes.api'
import type { Hero } from '../../../types/hero.types'
import { HeroFormDialog } from '../../../features/heroes/components/HeroFormDialog'
import { ConfirmDialog } from '../../../components/ConfirmDialog'

import { guardHerosList } from '../../../lib/route-guard'

export const Route = createFileRoute('/_authenticated/_dashboard-shell/heroes/')({
  beforeLoad: guardHerosList(),
  component: HeroesList,
})

export function HeroesList() {
  const { can } = usePermissions()
  if (!can('heroes') && !can('heroes:read')) return <AccessDenied />
  const canWrite = can('heroes')
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { user } = useAuthContext()
  const clientId = user?.clientId
  const [search, setSearch] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<number | null>(null)
  const [editHero, setEditHero] = useState<Hero | null>(null)

  const { data: heroes = [], isLoading } = useQuery<Hero[]>({
    queryKey: ['heroes'],
    queryFn: () => heroesApi.list(clientId != null ? { clientId } : undefined),
  })

  const filtered = heroes.filter(h => {
    const term = (search ?? '').toLowerCase()
    return (
      (h.firstName ?? '').toLowerCase().includes(term) ||
      (h.lastName ?? '').toLowerCase().includes(term) ||
      (h.email ?? '').toLowerCase().includes(term)
    )
  })

  async function handleCreate(data: Partial<Hero>) {
    await heroesApi.create(data)
    queryClient.invalidateQueries({ queryKey: ['heroes'] })
  }

  async function handleDelete(id: number) {
    await heroesApi.remove(id)
    queryClient.invalidateQueries({ queryKey: ['heroes'] })
  }

  async function handleUpdate(data: Partial<Hero>) {
    if (!editHero) return
    await heroesApi.update(editHero.id, data)
    queryClient.invalidateQueries({ queryKey: ['heroes'] })
  }

  return (
    <div data-testid="heroes-list" className="flex flex-col gap-4 p-4 md:gap-6 md:p-6">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground md:text-2xl">Heroes</h1>
          <p className="text-xs text-muted md:text-sm">Manage your hero roster</p>
        </div>
        {canWrite && (
          <Button color="primary" size="sm" startContent={<Plus className="size-4" />} onPress={() => setDialogOpen(true)}>
            Add Hero
          </Button>
        )}
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2">
        <SearchField
          className="w-full sm:w-64"
          value={search}
          onChange={setSearch}
          aria-label="Search heroes"
        >
          <SearchField.Group>
            <SearchField.SearchIcon />
            <SearchField.Input placeholder="Search heroes..." />
            <SearchField.ClearButton />
          </SearchField.Group>
        </SearchField>
      </div>

      {/* Table card */}
      {isLoading ? (
        <div className="flex flex-col gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-12 rounded-lg" />
          ))}
        </div>
      ) : (
      <Card>
        <Card.Content className="p-0">
          <Table>
            <Table.ScrollContainer>
              <Table.Content aria-label="Heroes table" data-testid="heroes-table">
                <Table.Header>
                  <Table.Column isRowHeader>Name</Table.Column>
                  <Table.Column>Email</Table.Column>
                  <Table.Column>Skills</Table.Column>
                  <Table.Column>Actions</Table.Column>
                </Table.Header>
                <Table.Body
                  items={filtered}
                  renderEmptyState={() => (
                    <div className="py-12 text-center text-sm text-muted">No heroes found.</div>
                  )}
                >
                  {hero => (
                    <Table.Row key={hero.id} id={hero.id} data-testid={`hero-row-${hero.id}`}>
                      <Table.Cell>
                        <span className="font-medium">{hero.firstName} {hero.lastName}</span>
                      </Table.Cell>
                      <Table.Cell>{hero.email}</Table.Cell>
                      <Table.Cell>
                        {hero.skills?.length ? (
                          <div className="flex flex-wrap gap-1">
                            {hero.skills.map(skill => (
                              <Chip key={skill} size="sm" variant="flat" color="primary">{skill}</Chip>
                            ))}
                          </div>
                        ) : (
                          <span className="text-muted text-sm">—</span>
                        )}
                      </Table.Cell>
                      <Table.Cell>
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            color="primary"
                            onPress={() => navigate({ to: '/heroes/$id', params: { id: String(hero.id) } })}
                          >
                            View
                          </Button>
                          {canWrite && (
                            <>
                              <Button
                                size="sm"
                                variant="ghost"
                                color="warning"
                                onPress={() => setEditHero(hero)}
                              >
                                Edit
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                color="danger"
                                onPress={() => setDeleteTarget(hero.id)}
                              >
                                Delete
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                color="success"
                                onPress={() => navigate({ to: '/contracts' })}
                              >
                                Contract
                              </Button>
                            </>
                          )}
                        </div>
                      </Table.Cell>
                    </Table.Row>
                  )}
                </Table.Body>
              </Table.Content>
            </Table.ScrollContainer>
          </Table>
        </Card.Content>
      </Card>
      )}

      <HeroFormDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSubmit={handleCreate}
      />
      <HeroFormDialog
        open={editHero !== null}
        onClose={() => setEditHero(null)}
        onSubmit={handleUpdate}
        defaultValues={editHero ?? undefined}
        isEditing
        title="Edit Hero"
      />

      <ConfirmDialog
        open={deleteTarget !== null}
        title="Delete Hero"
        description="This action cannot be undone."
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => { if (deleteTarget !== null) handleDelete(deleteTarget) }}
      />
    </div>
  )
}
