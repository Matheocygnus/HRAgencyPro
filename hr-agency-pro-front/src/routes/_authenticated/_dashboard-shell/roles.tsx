import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { usePermissions } from '../../../features/auth/use-permissions'
import { AccessDenied } from '../../../components/AccessDenied'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Table, Chip, Button, Card, Skeleton } from '@heroui/react'
import { Plus } from 'lucide-react'
import { rolesApi } from '../../../api/roles.api'
import type { Role } from '../../../types/role.types'
import { RoleFormDialog } from '../../../features/roles/components/RoleFormDialog'
import { ConfirmDialog } from '../../../components/ConfirmDialog'

import { guardRoute } from '../../../lib/route-guard'

export const Route = createFileRoute('/_authenticated/_dashboard-shell/roles')({
  beforeLoad: guardRoute('roles'),
  component: RolesPage,
})

export function RolesPage() {
  const { can } = usePermissions()
  if (!can('roles')) return <AccessDenied />
  const queryClient = useQueryClient()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editTarget, setEditTarget] = useState<Role | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<number | null>(null)

  const { data: roles = [], isLoading } = useQuery<Role[]>({
    queryKey: ['roles'],
    queryFn: () => rolesApi.list(),
  })

  async function handleCreate(data: Partial<Role>) {
    await rolesApi.create(data)
    queryClient.invalidateQueries({ queryKey: ['roles'] })
  }

  async function handleUpdate(data: Partial<Role>) {
    if (!editTarget) return
    await rolesApi.update(editTarget.id, data)
    queryClient.invalidateQueries({ queryKey: ['roles'] })
    setEditTarget(null)
  }

  async function handleDelete(id: number) {
    await rolesApi.remove(id)
    queryClient.invalidateQueries({ queryKey: ['roles'] })
  }

  return (
    <div data-testid="roles-page" className="flex flex-col gap-4 p-4 md:gap-6 md:p-6">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground md:text-2xl">Roles</h1>
          <p className="text-xs text-muted md:text-sm">Configure roles and their permissions</p>
        </div>
        <Button color="primary" size="sm" startContent={<Plus className="size-4" />} onPress={() => setDialogOpen(true)}>
          Add Role
        </Button>
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
              <Table.Content aria-label="Roles table" data-testid="roles-table">
                <Table.Header>
                  <Table.Column isRowHeader>ID</Table.Column>
                  <Table.Column>Name</Table.Column>
                  <Table.Column>Permissions</Table.Column>
                  <Table.Column>Actions</Table.Column>
                </Table.Header>
                <Table.Body
                  items={roles}
                  renderEmptyState={() => (
                    <div className="py-12 text-center text-sm text-muted">No roles found.</div>
                  )}
                >
                  {role => (
                    <Table.Row key={role.id} id={role.id} data-testid={`role-row-${role.id}`}>
                      <Table.Cell><span className="font-medium">{role.id}</span></Table.Cell>
                      <Table.Cell>{role.name}</Table.Cell>
                      <Table.Cell>
                        <Chip size="sm" variant="flat" color="default">
                          {role.permissions.length}
                        </Chip>
                      </Table.Cell>
                      <Table.Cell>
                        <div className="flex gap-1">
                          <Button size="sm" variant="ghost" color="primary" onPress={() => setEditTarget(role)}>Edit</Button>
                          <Button size="sm" variant="ghost" color="danger" onPress={() => setDeleteTarget(role.id)}>Delete</Button>
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

      <RoleFormDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSubmit={handleCreate}
      />

      {editTarget && (
        <RoleFormDialog
          open
          onClose={() => setEditTarget(null)}
          onSubmit={handleUpdate}
          defaultValues={editTarget}
          title="Edit Role"
        />
      )}

      <ConfirmDialog
        open={deleteTarget !== null}
        title="Delete Role"
        description="This action cannot be undone."
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => { if (deleteTarget !== null) handleDelete(deleteTarget) }}
      />
    </div>
  )
}
