import { useState, useMemo } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { usePermissions } from '../../../features/auth/use-permissions'
import { AccessDenied } from '../../../components/AccessDenied'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Table, Chip, Button, Card, SearchField, Tabs, Skeleton } from '@heroui/react'
import { Plus } from 'lucide-react'
import { invoicesApi } from '../../../api/invoices.api'
import { clientsApi } from '../../../api/clients.api'
import { heroesApi } from '../../../api/heroes.api'
import type { Invoice } from '../../../types/invoice.types'
import { InvoiceFormDialog } from '../../../features/invoices/components/InvoiceFormDialog'
import { ConfirmDialog } from '../../../components/ConfirmDialog'

export const Route = createFileRoute('/_authenticated/_dashboard-shell/invoices')({
  component: InvoicesPage,
})

type StatusTab = 'all' | 'pending' | 'paid' | 'overdue' | 'cancelled'
const STATUS_TABS: StatusTab[] = ['all', 'pending', 'paid', 'overdue', 'cancelled']

const statusColor: Record<string, 'default' | 'primary' | 'success' | 'warning' | 'danger'> = {
  pending: 'warning', paid: 'success', overdue: 'danger', cancelled: 'default',
}

function isEffectivelyOverdue(invoice: Invoice): boolean {
  if (invoice.status === 'paid' || invoice.status === 'cancelled') return false
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return new Date(invoice.dueDate) < today
}

export function InvoicesPage() {
  const { can } = usePermissions()
  if (!can('invoices')) return <AccessDenied />
  const queryClient = useQueryClient()
  const [activeTab, setActiveTab] = useState<StatusTab>('all')
  const [search, setSearch] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editTarget, setEditTarget] = useState<Invoice | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<number | null>(null)

  const { data: invoices = [], isLoading } = useQuery<Invoice[]>({
    queryKey: ['invoices'],
    queryFn: () => invoicesApi.list(),
  })

  const { data: clients = [] } = useQuery({
    queryKey: ['clients'],
    queryFn: () => clientsApi.list(),
    enabled: can('companies'),
  })

  const { data: heroes = [] } = useQuery({
    queryKey: ['heroes'],
    queryFn: () => heroesApi.list(),
  })

  const clientMap = useMemo(() =>
    Object.fromEntries(clients.map(c => [c.id, c.name])),
    [clients]
  )

  const heroMap = useMemo(() =>
    Object.fromEntries(heroes.map((h: any) => [h.id, `${h.firstName} ${h.lastName}`.trim()])),
    [heroes]
  )

  const filtered = invoices
    .filter(i => {
      if (activeTab === 'all') return true
      if (activeTab === 'overdue') return i.status === 'overdue' || isEffectivelyOverdue(i)
      return i.status === activeTab
    })
    .filter(i => {
      if (!search) return true
      const q = search.toLowerCase()
      const clientName = (clientMap[i.clientId] ?? '').toLowerCase()
      const heroName = (heroMap[i.heroId] ?? '').toLowerCase()
      return (
        String(i.id).includes(q) ||
        String(i.clientId).includes(q) ||
        clientName.includes(q) ||
        heroName.includes(q) ||
        String(i.amount).includes(q) ||
        (i.invoiceNumber ?? '').toLowerCase().includes(q)
      )
    })

  async function handleCreate(data: Partial<Invoice>) {
    await invoicesApi.create(data)
    queryClient.invalidateQueries({ queryKey: ['invoices'] })
  }

  async function handleUpdate(data: Partial<Invoice>) {
    if (!editTarget) return
    await invoicesApi.update(editTarget.id, data)
    queryClient.invalidateQueries({ queryKey: ['invoices'] })
    setEditTarget(null)
  }

  async function handleDelete(id: number) {
    await invoicesApi.remove(id)
    queryClient.invalidateQueries({ queryKey: ['invoices'] })
  }

  return (
    <div data-testid="invoices-page" className="flex flex-col gap-4 p-4 md:gap-6 md:p-6">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground md:text-2xl">Invoices</h1>
          <p className="text-xs text-muted md:text-sm">Track and manage billing invoices</p>
        </div>
        <Button color="primary" size="sm" startContent={<Plus className="size-4" />} onPress={() => setDialogOpen(true)}>
          Add Invoice
        </Button>
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2">
        <SearchField
          className="w-full sm:w-64"
          value={search}
          onChange={setSearch}
          aria-label="Search invoices"
        >
          <SearchField.Group>
            <SearchField.SearchIcon />
            <SearchField.Input placeholder="Search by client, invoice number, amount..." />
            <SearchField.ClearButton />
          </SearchField.Group>
        </SearchField>
        <Tabs
          selectedKey={activeTab}
          onSelectionChange={k => setActiveTab(k as StatusTab)}
          size="sm"
        >
          <Tabs.ListContainer>
            <Tabs.List aria-label="Invoice status">
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
              <Table.Content aria-label="Invoices table" data-testid="invoices-table">
                <Table.Header>
                  <Table.Column isRowHeader>ID</Table.Column>
                  <Table.Column>Client</Table.Column>
                  <Table.Column>Hero</Table.Column>
                  <Table.Column>Amount</Table.Column>
                  <Table.Column>Status</Table.Column>
                  <Table.Column>Due Date</Table.Column>
                  <Table.Column>Actions</Table.Column>
                </Table.Header>
                <Table.Body renderEmptyState={() => (
                    <div className="py-12 text-center text-sm text-muted">No invoices found.</div>
                  )}
                >
                  {filtered.map(invoice => {
                    const overdue = isEffectivelyOverdue(invoice)
                    return (
                    <Table.Row
                      key={invoice.id}
                      id={invoice.id}
                      data-testid={`invoice-row-${invoice.id}`}
                      className={overdue ? 'bg-danger/10' : undefined}
                    >
                      <Table.Cell><span className="font-medium">{invoice.id}</span></Table.Cell>
                      <Table.Cell>{clientMap[invoice.clientId] ?? `Client #${invoice.clientId}`}</Table.Cell>
                      <Table.Cell>{heroMap[invoice.heroId] ?? '—'}</Table.Cell>
                      <Table.Cell>${invoice.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Table.Cell>
                      <Table.Cell>
                        <Chip size="sm" variant="flat" color={overdue ? 'danger' : (statusColor[invoice.status] ?? 'default')}>
                          {overdue && invoice.status === 'pending' ? 'overdue' : invoice.status}
                        </Chip>
                      </Table.Cell>
                      <Table.Cell>
                        <span className={overdue ? 'text-danger font-medium' : undefined}>{invoice.dueDate}</span>
                      </Table.Cell>
                      <Table.Cell>
                        <div className="flex gap-1">
                          <Button size="sm" variant="ghost" color="primary" onPress={() => setEditTarget(invoice)}>Edit</Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            color="danger"
                            isDisabled={invoice.status === 'paid'}
                            onPress={() => setDeleteTarget(invoice.id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </Table.Cell>
                    </Table.Row>
                    )
                  })}
                </Table.Body>
              </Table.Content>
            </Table.ScrollContainer>
          </Table>
        </Card.Content>
      </Card>
      )}

      <InvoiceFormDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSubmit={handleCreate}
      />

      {editTarget && (
        <InvoiceFormDialog
          open
          onClose={() => setEditTarget(null)}
          onSubmit={handleUpdate}
          defaultValues={editTarget}
          title="Edit Invoice"
        />
      )}

      <ConfirmDialog
        open={deleteTarget !== null}
        title="Delete Invoice"
        description="This action cannot be undone."
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => { if (deleteTarget !== null) handleDelete(deleteTarget) }}
      />
    </div>
  )
}
