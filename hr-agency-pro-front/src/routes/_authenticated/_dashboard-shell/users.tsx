import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { usePermissions } from '../../../features/auth/use-permissions'
import { AccessDenied } from '../../../components/AccessDenied'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Table, Chip, Button, Card, SearchField, Skeleton } from '@heroui/react'
import { Plus } from 'lucide-react'
import { usersApi } from '../../../api/users.api'
import { rolesApi } from '../../../api/roles.api'
import type { UserRecord } from '../../../types/user.types'
import type { Role } from '../../../types/role.types'
import { UserFormDialog } from '../../../features/users/components/UserFormDialog'
import { ConfirmDialog } from '../../../components/ConfirmDialog'

export const Route = createFileRoute('/_authenticated/_dashboard-shell/users')({
  component: UsersPage,
})

const roleColor: Record<string, 'default' | 'primary' | 'success' | 'warning' | 'danger'> = {
  admin: 'danger', manager: 'primary', user: 'default',
}

export function UsersPage() {
  const { can } = usePermissions()
  if (!can('users')) return <AccessDenied />
  const queryClient = useQueryClient()
  const [search, setSearch] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editTarget, setEditTarget] = useState<UserRecord | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<number | null>(null)

  const { data: users = [], isLoading } = useQuery<UserRecord[]>({
    queryKey: ['users'],
    queryFn: () => usersApi.list(),
  })

  const { data: roles = [] } = useQuery<Role[]>({
    queryKey: ['roles'],
    queryFn: () => rolesApi.list(),
  })

  const filtered = users.filter(u => {
    if (!search) return true
    const q = search.toLowerCase()
    return (
      u.email.toLowerCase().includes(q) ||
      u.firstName.toLowerCase().includes(q) ||
      u.lastName.toLowerCase().includes(q)
    )
  })

  async function handleCreate(data: Partial<UserRecord>) {
    await usersApi.create(data)
    queryClient.invalidateQueries({ queryKey: ['users'] })
  }

  async function handleUpdate(data: Partial<UserRecord>) {
    if (!editTarget) return
    await usersApi.update(editTarget.id, data)
    queryClient.invalidateQueries({ queryKey: ['users'] })
    setEditTarget(null)
  }

  async function handleDelete(id: number) {
    await usersApi.remove(id)
    queryClient.invalidateQueries({ queryKey: ['users'] })
  }

  return (
    <div data-testid="users-page" className="flex flex-col gap-4 p-4 md:gap-6 md:p-6">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground md:text-2xl">Users</h1>
          <p className="text-xs text-muted md:text-sm">Manage system users and their roles</p>
        </div>
        <Button color="primary" size="sm" startContent={<Plus className="size-4" />} onPress={() => setDialogOpen(true)}>
          Add User
        </Button>
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2">
        <SearchField
          className="w-full sm:w-64"
          value={search}
          onChange={setSearch}
          aria-label="Search users"
        >
          <SearchField.Group>
            <SearchField.SearchIcon />
            <SearchField.Input placeholder="Search by name or email..." />
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
              <Table.Content aria-label="Users table" data-testid="users-table">
                <Table.Header>
                  <Table.Column isRowHeader>ID</Table.Column>
                  <Table.Column>First Name</Table.Column>
                  <Table.Column>Last Name</Table.Column>
                  <Table.Column>Email</Table.Column>
                  <Table.Column>Role</Table.Column>
                  <Table.Column>Actions</Table.Column>
                </Table.Header>
                <Table.Body
                  items={filtered}
                  renderEmptyState={() => (
                    <div className="py-12 text-center text-sm text-muted">No users found.</div>
                  )}
                >
                  {user => (
                    <Table.Row key={user.id} id={user.id} data-testid={`user-row-${user.id}`}>
                      <Table.Cell><span className="font-medium">{user.id}</span></Table.Cell>
                      <Table.Cell>{user.firstName}</Table.Cell>
                      <Table.Cell>{user.lastName}</Table.Cell>
                      <Table.Cell>{user.email}</Table.Cell>
                      <Table.Cell>
                        <Chip size="sm" variant="flat" color={roleColor[user.role?.name ?? ''] ?? 'default'}>
                          {user.role?.name ?? user.roleId}
                        </Chip>
                      </Table.Cell>
                      <Table.Cell>
                        <div className="flex gap-1">
                          <Button size="sm" variant="ghost" color="primary" onPress={() => setEditTarget(user)}>Edit</Button>
                          <Button size="sm" variant="ghost" color="danger" onPress={() => setDeleteTarget(user.id)}>Delete</Button>
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

      <UserFormDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSubmit={handleCreate}
        roles={roles}
      />

      {editTarget && (
        <UserFormDialog
          open
          onClose={() => setEditTarget(null)}
          onSubmit={handleUpdate}
          defaultValues={editTarget}
          roles={roles}
          title="Edit User"
        />
      )}

      <ConfirmDialog
        open={deleteTarget !== null}
        title="Delete User"
        description="This action cannot be undone."
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => { if (deleteTarget !== null) handleDelete(deleteTarget) }}
      />
    </div>
  )
}
