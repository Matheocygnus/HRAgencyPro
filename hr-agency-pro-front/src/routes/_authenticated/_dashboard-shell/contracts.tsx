import { useState, useMemo } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { usePermissions } from '../../../features/auth/use-permissions'
import { AccessDenied } from '../../../components/AccessDenied'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Table, Chip, Button, Card, SearchField, Tabs, Skeleton } from '@heroui/react'
import { Plus } from 'lucide-react'
import { contractsApi } from '../../../api/contracts.api'
import { heroesApi } from '../../../api/heroes.api'
import { clientsApi } from '../../../api/clients.api'
import type { Contract } from '../../../types/contract.types'
import { ContractFormDialog } from '../../../features/contracts/components/ContractFormDialog'
import { QuickEditDialog } from '../../../features/contracts/components/QuickEditDialog'
import { ConfirmDialog } from '../../../components/ConfirmDialog'

export const Route = createFileRoute('/_authenticated/_dashboard-shell/contracts')({
  component: ContractsPage,
})

type StatusTab = 'all' | 'draft' | 'signed' | 'active' | 'completed' | 'terminated'
const STATUS_TABS: StatusTab[] = ['all', 'draft', 'signed', 'active', 'completed', 'terminated']

const statusColor: Record<string, 'default' | 'primary' | 'success' | 'warning' | 'danger'> = {
  active: 'success', signed: 'primary', draft: 'default',
  completed: 'success', terminated: 'danger',
}

export function ContractsPage() {
  const { can } = usePermissions()
  if (!can('contracts')) return <AccessDenied />
  const queryClient = useQueryClient()
  const [activeTab, setActiveTab] = useState<StatusTab>('all')
  const [search, setSearch] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editTarget, setEditTarget] = useState<Contract | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<number | null>(null)

  const { data: contracts = [], isLoading } = useQuery<Contract[]>({
    queryKey: ['contracts'],
    queryFn: () => contractsApi.list(),
  })

  const { data: heroes = [] } = useQuery({
    queryKey: ['heroes'],
    queryFn: () => heroesApi.list(),
  })

  const { data: clients = [] } = useQuery({
    queryKey: ['clients'],
    queryFn: () => clientsApi.list(),
  })

  const heroMap = useMemo(() =>
    Object.fromEntries(heroes.map(h => [h.id, `${h.firstName} ${h.lastName}`.trim()])),
    [heroes]
  )

  const clientMap = useMemo(() =>
    Object.fromEntries(clients.map(c => [c.id, c.name])),
    [clients]
  )

  const filtered = contracts
    .filter(c => activeTab === 'all' || c.status === activeTab)
    .filter(c => {
      if (!search) return true
      const q = search.toLowerCase()
      const heroName = (heroMap[c.heroId] ?? '').toLowerCase()
      const clientName = (clientMap[c.clientId] ?? '').toLowerCase()
      return (
        String(c.id).includes(q) ||
        String(c.heroId).includes(q) ||
        heroName.includes(q) ||
        clientName.includes(q)
      )
    })

  async function handleCreate(data: Partial<Contract>) {
    await contractsApi.create(data)
    queryClient.invalidateQueries({ queryKey: ['contracts'] })
  }

  async function handleUpdate(data: Partial<Contract>) {
    if (!editTarget) return
    await contractsApi.update(editTarget.id, data)
    queryClient.invalidateQueries({ queryKey: ['contracts'] })
    setEditTarget(null)
  }

  async function handleDelete(id: number) {
    await contractsApi.remove(id)
    queryClient.invalidateQueries({ queryKey: ['contracts'] })
  }

  return (
    <div data-testid="contracts-page" className="flex flex-col gap-4 p-4 md:gap-6 md:p-6">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground md:text-2xl">Contracts</h1>
          <p className="text-xs text-muted md:text-sm">Manage hero-client contracts</p>
        </div>
        <Button color="primary" size="sm" startContent={<Plus className="size-4" />} onPress={() => setDialogOpen(true)}>
          Add Contract
        </Button>
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2">
        <SearchField
          className="w-full sm:w-64"
          value={search}
          onChange={setSearch}
          aria-label="Search contracts"
        >
          <SearchField.Group>
            <SearchField.SearchIcon />
            <SearchField.Input placeholder="Search by hero ID or contract ID..." />
            <SearchField.ClearButton />
          </SearchField.Group>
        </SearchField>
        <Tabs
          selectedKey={activeTab}
          onSelectionChange={k => setActiveTab(k as StatusTab)}
          size="sm"
        >
          <Tabs.ListContainer>
            <Tabs.List aria-label="Contract status">
              {STATUS_TABS.map(tab => (
                <Tabs.Tab key={tab} id={tab}>{tab}<Tabs.Indicator /></Tabs.Tab>
              ))}
            </Tabs.List>
          </Tabs.ListContainer>
        </Tabs>
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
              <Table.Content aria-label="Contracts table" data-testid="contracts-table">
                <Table.Header>
                  <Table.Column isRowHeader>ID</Table.Column>
                  <Table.Column>Hero</Table.Column>
                  <Table.Column>Client</Table.Column>
                  <Table.Column>Status</Table.Column>
                  <Table.Column>Start</Table.Column>
                  <Table.Column>End</Table.Column>
                  <Table.Column>Months</Table.Column>
                  <Table.Column>Actions</Table.Column>
                </Table.Header>
                <Table.Body renderEmptyState={() => (
                    <div className="py-12 text-center text-sm text-muted">No contracts found.</div>
                  )}
                >
                  {filtered.map(contract => (
                    <Table.Row key={contract.id} id={contract.id} data-testid={`contract-row-${contract.id}`}>
                      <Table.Cell><span className="font-medium">{contract.id}</span></Table.Cell>
                      <Table.Cell>{heroMap[contract.heroId] ?? `Hero #${contract.heroId}`}</Table.Cell>
                      <Table.Cell>{clientMap[contract.clientId] ?? `Client #${contract.clientId}`}</Table.Cell>
                      <Table.Cell>
                        <Chip size="sm" variant="flat" color={statusColor[contract.status] ?? 'default'}>
                          {contract.status}
                        </Chip>
                      </Table.Cell>
                      <Table.Cell>{contract.startDate}</Table.Cell>
                      <Table.Cell>{contract.endDate ?? '—'}</Table.Cell>
                      <Table.Cell>{contract.lengthMonths ?? '—'}</Table.Cell>
                      <Table.Cell>
                        <div className="flex gap-1">
                          <Button size="sm" variant="ghost" color="primary" onPress={() => setEditTarget(contract)}>Edit</Button>
                          <Button size="sm" variant="ghost" color="danger" onPress={() => setDeleteTarget(contract.id)}>Delete</Button>
                        </div>
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table.Content>
            </Table.ScrollContainer>
          </Table>
        </Card.Content>
      </Card>
      )}

      <ContractFormDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSubmit={handleCreate}
      />

      {editTarget && (
        <QuickEditDialog
          open
          onClose={() => setEditTarget(null)}
          onSubmit={handleUpdate}
          contract={editTarget}
        />
      )}

      <ConfirmDialog
        open={deleteTarget !== null}
        title="Delete Contract"
        description="This action cannot be undone."
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => { if (deleteTarget !== null) handleDelete(deleteTarget) }}
      />
    </div>
  )
}
