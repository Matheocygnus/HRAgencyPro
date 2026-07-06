import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { usePermissions } from '../../../features/auth/use-permissions'
import { AccessDenied } from '../../../components/AccessDenied'
import { TabScrollShadow } from '../../../components/TabScrollShadow'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Table, Chip, Button, Card, SearchField, Tabs, Skeleton } from '@heroui/react'
import { Plus } from 'lucide-react'
import { contractsApi } from '../../../api/contracts.api'
import type { Contract } from '../../../types/contract.types'
import { ContractFormDialog } from '../../../features/contracts/components/ContractFormDialog'
import { QuickEditDialog } from '../../../features/contracts/components/QuickEditDialog'
import { ConfirmDialog } from '../../../components/ConfirmDialog'

import { guardAllRoles } from '../../../lib/route-guard'

export const Route = createFileRoute('/_authenticated/_dashboard-shell/contracts')({
  beforeLoad: guardAllRoles(),
  component: ContractsPage,
})

type StatusTab = 'all' | 'draft' | 'signed' | 'active' | 'completed' | 'terminated'
const STATUS_TABS: StatusTab[] = ['all', 'draft', 'signed', 'active', 'completed', 'terminated']
const HERO_STATUS_TABS: StatusTab[] = ['all', 'signed', 'active', 'completed', 'terminated']

const statusColor: Record<string, 'default' | 'primary' | 'success' | 'warning' | 'danger'> = {
  active: 'success', signed: 'primary', draft: 'default',
  completed: 'success', terminated: 'danger',
}

export function ContractsPage() {
  const { can, permissions } = usePermissions()
  const queryClient = useQueryClient()
  const [activeTab, setActiveTab] = useState<StatusTab>('all')
  const [search, setSearch] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editTarget, setEditTarget] = useState<Contract | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<number | null>(null)

  const isRecruiter = can('contracts')
  const isHero = permissions.includes('hero_dashboard')
  const canView = isRecruiter || can('contracts:read')

  const { data: contracts = [], isLoading } = useQuery<Contract[]>({
    queryKey: ['contracts'],
    queryFn: () => contractsApi.list(),
    enabled: canView,
  })

  if (!canView) return <AccessDenied />

  const filtered = contracts
    .filter(c => activeTab === 'all' || c.status === activeTab)
    .filter(c => {
      if (!search) return true
      const q = search.toLowerCase()
      const heroName = [c.hero?.prospect?.firstName, c.hero?.prospect?.lastName].filter(Boolean).join(' ').toLowerCase()
      const clientName = (c.company?.name ?? '').toLowerCase()
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
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground md:text-2xl">
            {isHero ? 'My Contracts' : 'Contracts'}
          </h1>
          <p className="text-xs text-muted md:text-sm">
            {isHero ? 'Your active and completed contracts' : 'Manage hero-client contracts'}
          </p>
        </div>
        {isRecruiter && (
          <Button color="primary" size="sm" startContent={<Plus className="size-4" />} onPress={() => setDialogOpen(true)}>
            Add Contract
          </Button>
        )}
      </div>

      <div className="flex flex-col gap-2 md:flex-row md:flex-wrap md:items-center">
        <SearchField
          className="w-full sm:w-64"
          value={search}
          onChange={setSearch}
          aria-label="Search contracts"
        >
          <SearchField.Group>
            <SearchField.SearchIcon />
            <SearchField.Input placeholder={isHero ? 'Search by contract...' : 'Search by hero ID or contract ID...'} />
            <SearchField.ClearButton />
          </SearchField.Group>
        </SearchField>
          <Tabs
            selectedKey={activeTab}
            onSelectionChange={k => setActiveTab(k as StatusTab)}
            size="sm"
          >
            <TabScrollShadow>
              <Tabs.ListContainer className="!overflow-x-visible">
                <Tabs.List aria-label="Contract status" className="*:!w-auto *:!grow *:!px-1.5 *:!text-xs md:*:!w-full md:*:!grow-0 md:*:!px-4 md:*:!text-sm">
                  {(isHero ? HERO_STATUS_TABS : STATUS_TABS).map(tab => (
                    <Tabs.Tab key={tab} id={tab}>{tab}<Tabs.Indicator /></Tabs.Tab>
                  ))}
                </Tabs.List>
              </Tabs.ListContainer>
            </TabScrollShadow>
          </Tabs>
      </div>

      {isLoading ? (
        <div className="flex flex-col gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-12 rounded-lg" />
          ))}
        </div>
      ) : (
        <Card>
          <Card.Content className="p-0 overflow-x-auto">
            <Table>
              <Table.ScrollContainer>
                <Table.Content aria-label="Contracts table" data-testid="contracts-table" className="min-w-[700px]">
                  <Table.Header>
                    <Table.Column isRowHeader>ID</Table.Column>
                    {isRecruiter && <Table.Column>Hero</Table.Column>}
                    <Table.Column>Company</Table.Column>
                    <Table.Column>Status</Table.Column>
                    <Table.Column>Start</Table.Column>
                    <Table.Column>End</Table.Column>
                    <Table.Column>Months</Table.Column>
                    {isRecruiter && <Table.Column>Actions</Table.Column>}
                  </Table.Header>
                  <Table.Body renderEmptyState={() => (
                    <div className="py-12 text-center text-sm text-muted">No contracts found.</div>
                  )}>
                    {filtered.map(contract => (
                      <Table.Row key={contract.id} id={contract.id} data-testid={`contract-row-${contract.id}`}>
                        <Table.Cell><span className="font-medium">{contract.id}</span></Table.Cell>
                        {isRecruiter && (
                          <Table.Cell>
                            {[contract.hero?.prospect?.firstName, contract.hero?.prospect?.lastName].filter(Boolean).join(' ') || `Hero #${contract.heroId}`}
                          </Table.Cell>
                        )}
                        <Table.Cell>{contract.company?.name ?? '—'}</Table.Cell>
                        <Table.Cell>
                          <Chip size="sm" variant="flat" color={statusColor[contract.status] ?? 'default'}>
                            {contract.status}
                          </Chip>
                        </Table.Cell>
                        <Table.Cell>{contract.startDate ?? '—'}</Table.Cell>
                        <Table.Cell>{contract.endDate ?? '—'}</Table.Cell>
                        <Table.Cell>
                          {contract.endDate
                            ? (new Date(contract.endDate).getFullYear() - new Date(contract.startDate).getFullYear()) * 12 +
                              new Date(contract.endDate).getMonth() - new Date(contract.startDate).getMonth()
                            : 'Ongoing'}
                        </Table.Cell>
                        {isRecruiter && (
                          <Table.Cell>
                            <div className="flex gap-1">
                              <Button size="sm" variant="ghost" color="primary" onPress={() => setEditTarget(contract)}>Edit</Button>
                              <Button size="sm" variant="ghost" color="danger" onPress={() => setDeleteTarget(contract.id)}>Delete</Button>
                            </div>
                          </Table.Cell>
                        )}
                      </Table.Row>
                    ))}
                  </Table.Body>
                </Table.Content>
              </Table.ScrollContainer>
            </Table>
          </Card.Content>
        </Card>
      )}

      {isRecruiter && (
        <>
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
        </>
      )}
    </div>
  )
}
