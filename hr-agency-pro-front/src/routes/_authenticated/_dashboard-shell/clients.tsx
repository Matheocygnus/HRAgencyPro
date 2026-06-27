import { useState, useMemo } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { usePermissions } from '../../../features/auth/use-permissions'
import { AccessDenied } from '../../../components/AccessDenied'
import { TabScrollShadow } from '../../../components/TabScrollShadow'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Table, Chip, Button, Card, Tabs, Skeleton } from '@heroui/react'
import { Plus, Pencil } from 'lucide-react'
import { clientsApi } from '../../../api/clients.api'
import { companiesApi } from '../../../api/companies.api'
import type { Client } from '../../../types/client.types'
import type { Company } from '../../../types/company.types'
import { ClientFormDialog } from '../../../features/clients/components/ClientFormDialog'
import { CompanyFormDialog } from '../../../features/companies/components/CompanyFormDialog'
import { ConfirmDialog } from '../../../components/ConfirmDialog'

import { guardRoute } from '../../../lib/route-guard'

export const Route = createFileRoute('/_authenticated/_dashboard-shell/clients')({
  beforeLoad: guardRoute('companies'),
  component: ClientsPage,
})

type ActiveTab = 'clients' | 'companies'

export function ClientsPage() {
  const { can } = usePermissions()
  if (!can('companies')) return <AccessDenied />
  const queryClient = useQueryClient()
  const [activeTab, setActiveTab] = useState<ActiveTab>('clients')
  const [clientDialogOpen, setClientDialogOpen] = useState(false)
  const [companyDialogOpen, setCompanyDialogOpen] = useState(false)
  const [deleteClientTarget, setDeleteClientTarget] = useState<number | null>(null)
  const [deleteCompanyTarget, setDeleteCompanyTarget] = useState<number | null>(null)
  const [editClientTarget, setEditClientTarget] = useState<Client | null>(null)
  const [editCompanyTarget, setEditCompanyTarget] = useState<Company | null>(null)

  const { data: clients = [], isLoading: clientsLoading } = useQuery<Client[]>({
    queryKey: ['clients'],
    queryFn: () => clientsApi.list(),
  })

  const { data: companies = [], isLoading: companiesLoading } = useQuery<Company[]>({
    queryKey: ['companies'],
    queryFn: () => companiesApi.list(),
  })

  const clientMap = useMemo(() =>
    Object.fromEntries(clients.map(c => [c.id, c.name])),
    [clients]
  )

  async function handleCreateClient(data: Partial<Client>) {
    await clientsApi.create(data)
    queryClient.invalidateQueries({ queryKey: ['clients'] })
  }

  async function handleDeleteClient(id: number) {
    await clientsApi.remove(id)
    queryClient.invalidateQueries({ queryKey: ['clients'] })
  }

  async function handleUpdateClient(data: Partial<Client>) {
    if (!editClientTarget) return
    await clientsApi.update(editClientTarget.id, data)
    queryClient.invalidateQueries({ queryKey: ['clients'] })
  }

  async function handleCreateCompany(data: Partial<Company>) {
    await companiesApi.create(data)
    queryClient.invalidateQueries({ queryKey: ['companies'] })
  }

  async function handleDeleteCompany(id: number) {
    await companiesApi.remove(id)
    queryClient.invalidateQueries({ queryKey: ['companies'] })
  }

  async function handleUpdateCompany(data: Partial<Company>) {
    if (!editCompanyTarget) return
    await companiesApi.update(editCompanyTarget.id, data)
    queryClient.invalidateQueries({ queryKey: ['companies'] })
  }

  return (
    <div data-testid="clients-page" className="flex flex-col gap-4 p-4 md:gap-6 md:p-6">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground md:text-2xl">Clients &amp; Companies</h1>
          <p className="text-xs text-muted md:text-sm">Manage clients and their associated companies</p>
        </div>
        {activeTab === 'clients' ? (
          <Button color="primary" size="sm" startContent={<Plus className="size-4" />} onPress={() => setClientDialogOpen(true)}>
            Add Client
          </Button>
        ) : (
          <Button color="primary" size="sm" startContent={<Plus className="size-4" />} onPress={() => setCompanyDialogOpen(true)}>
            Add Company
          </Button>
        )}
      </div>

      {/* Tab switcher */}
      <Tabs
        selectedKey={activeTab}
        onSelectionChange={k => setActiveTab(k as ActiveTab)}
        size="sm"
      >
        <TabScrollShadow>
          <Tabs.ListContainer className="!overflow-x-visible">
            <Tabs.List aria-label="Clients or Companies">
              <Tabs.Tab id="clients">Clients<Tabs.Indicator /></Tabs.Tab>
              <Tabs.Tab id="companies">Companies<Tabs.Indicator /></Tabs.Tab>
            </Tabs.List>
          </Tabs.ListContainer>
        </TabScrollShadow>
      </Tabs>

      {/* Clients table */}
      {activeTab === 'clients' && (
        clientsLoading ? (
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
                <Table.Content aria-label="Clients table" data-testid="clients-table">
                  <Table.Header>
                    <Table.Column isRowHeader>Name</Table.Column>
                    <Table.Column>Email</Table.Column>
                    <Table.Column>Phone</Table.Column>
                    <Table.Column>Actions</Table.Column>
                  </Table.Header>
                  <Table.Body
                    items={clients}
                    renderEmptyState={() => (
                      <div className="py-12 text-center text-sm text-muted">No clients found.</div>
                    )}
                  >
                    {client => (
                      <Table.Row key={client.id} id={client.id} data-testid={`client-row-${client.id}`}>
                        <Table.Cell><span className="font-medium">{client.name}</span></Table.Cell>
                        <Table.Cell>{client.email}</Table.Cell>
                        <Table.Cell>{client.phone ?? '—'}</Table.Cell>
                        <Table.Cell>
                          <div className="flex gap-1">
                            <Button size="sm" variant="ghost" color="primary" isIconOnly aria-label="Edit client" onPress={() => setEditClientTarget(client)}>
                              <Pencil className="size-3.5" />
                            </Button>
                            <Button size="sm" variant="ghost" color="danger" onPress={() => setDeleteClientTarget(client.id)}>Delete</Button>
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
        )
      )}

      {/* Companies table */}
      {activeTab === 'companies' && (
        companiesLoading ? (
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
                <Table.Content aria-label="Companies table" data-testid="companies-table">
                  <Table.Header>
                    <Table.Column isRowHeader>Name</Table.Column>
                    <Table.Column>Client</Table.Column>
                    <Table.Column>Actions</Table.Column>
                  </Table.Header>
                  <Table.Body
                    items={companies}
                    renderEmptyState={() => (
                      <div className="py-12 text-center text-sm text-muted">No companies found.</div>
                    )}
                  >
                    {company => (
                      <Table.Row key={company.id} id={company.id} data-testid={`company-row-${company.id}`}>
                        <Table.Cell><span className="font-medium">{company.name}</span></Table.Cell>
                        <Table.Cell>{clientMap[company.clientId] ?? '—'}</Table.Cell>
                        <Table.Cell>
                          <div className="flex gap-1">
                            <Button size="sm" variant="ghost" color="primary" isIconOnly aria-label="Edit company" onPress={() => setEditCompanyTarget(company)}>
                              <Pencil className="size-3.5" />
                            </Button>
                            <Button size="sm" variant="ghost" color="danger" onPress={() => setDeleteCompanyTarget(company.id)}>Delete</Button>
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
        )
      )}

      <ClientFormDialog
        open={clientDialogOpen}
        onClose={() => setClientDialogOpen(false)}
        onSubmit={handleCreateClient}
      />
      <ClientFormDialog
        open={editClientTarget !== null}
        onClose={() => setEditClientTarget(null)}
        onSubmit={handleUpdateClient}
        defaultValues={editClientTarget ?? undefined}
        title="Edit Client"
      />
      <CompanyFormDialog
        open={companyDialogOpen}
        onClose={() => setCompanyDialogOpen(false)}
        onSubmit={handleCreateCompany}
        clients={clients}
      />
      <CompanyFormDialog
        open={editCompanyTarget !== null}
        onClose={() => setEditCompanyTarget(null)}
        onSubmit={handleUpdateCompany}
        defaultValues={editCompanyTarget ?? undefined}
        title="Edit Company"
        clients={clients}
      />

      <ConfirmDialog
        open={deleteClientTarget !== null}
        title="Delete Client"
        description="This action cannot be undone."
        onClose={() => setDeleteClientTarget(null)}
        onConfirm={() => { if (deleteClientTarget !== null) handleDeleteClient(deleteClientTarget) }}
      />

      <ConfirmDialog
        open={deleteCompanyTarget !== null}
        title="Delete Company"
        description="This action cannot be undone."
        onClose={() => setDeleteCompanyTarget(null)}
        onConfirm={() => { if (deleteCompanyTarget !== null) handleDeleteCompany(deleteCompanyTarget) }}
      />
    </div>
  )
}
