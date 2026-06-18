import { useState, useEffect, useRef } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { usePermissions } from '../../../features/auth/use-permissions'
import { AccessDenied } from '../../../components/AccessDenied'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Table, Chip, Button, Card, SearchField, Tabs } from '@heroui/react'
import { prospectsApi } from '../../../api/prospects.api'
import { companiesApi } from '../../../api/companies.api'
import { useToast } from '../../../lib/toast'
import type { Prospect } from '../../../types/prospect.types'
import type { Company } from '../../../types/company.types'

export const Route = createFileRoute('/_authenticated/_dashboard-shell/prospect-database')({
  component: ProspectDatabase,
})

type ActiveTab = 'prospects' | 'companies'

const statusColor: Record<string, 'default' | 'primary' | 'success' | 'warning' | 'danger'> = {
  sourcing: 'default', contacted: 'primary', interview: 'warning',
  client_review: 'warning', budget: 'warning', contract: 'primary',
  hired: 'success', rejected: 'danger',
}

export function ProspectDatabase() {
  const { can } = usePermissions()
  if (!can('prospects')) return <AccessDenied />
  const queryClient = useQueryClient()
  const { addToast } = useToast()
  const [activeTab, setActiveTab] = useState<ActiveTab>('prospects')
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current)
    debounceTimer.current = setTimeout(() => setDebouncedSearch(search), 300)
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current)
    }
  }, [search])

  const { data: prospects = [] } = useQuery<Prospect[]>({
    queryKey: ['prospects'],
    queryFn: () => prospectsApi.list(),
  })

  const { data: companies = [] } = useQuery<Company[]>({
    queryKey: ['companies'],
    queryFn: () => companiesApi.list(),
  })

  // Hired prospects are Heroes — exclude them from the database view
  const activeProspects = prospects.filter(p => p.status !== 'hired')

  const filteredProspects = activeProspects.filter(p => {
    const term = debouncedSearch.toLowerCase()
    return (
      p.firstName.toLowerCase().includes(term) ||
      p.lastName.toLowerCase().includes(term) ||
      p.email.toLowerCase().includes(term) ||
      (p.targetCompany?.toLowerCase().includes(term) ?? false)
    )
  })

  const filteredCompanies = companies.filter(c =>
    c.name.toLowerCase().includes(debouncedSearch.toLowerCase()),
  )

  async function handleCsvUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const result = await prospectsApi.importCsv(file)
    queryClient.invalidateQueries({ queryKey: ['prospects'] })
    e.target.value = ''
    addToast(`Imported ${result.imported} prospects${result.skipped > 0 ? `, ${result.skipped} skipped` : ''}.`, result.skipped > 0 ? 'warning' : 'success')
  }

  return (
    <div data-testid="prospect-database" className="flex flex-col gap-4 p-4 md:gap-6 md:p-6">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground md:text-2xl">Prospect Database</h1>
          <p className="text-xs text-muted md:text-sm">Browse and import prospects and companies</p>
        </div>
        <label className="inline-flex cursor-pointer items-center gap-2">
          <Button as="span" size="sm" variant="bordered" color="default">
            Upload CSV
          </Button>
          <input
            type="file"
            accept=".csv"
            className="hidden"
            onChange={handleCsvUpload}
            data-testid="csv-upload"
          />
        </label>
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2">
        <SearchField
          className="w-full sm:w-64"
          value={search}
          onChange={setSearch}
          aria-label="Search"
        >
          <SearchField.Group>
            <SearchField.SearchIcon />
            <SearchField.Input placeholder="Search..." />
            <SearchField.ClearButton />
          </SearchField.Group>
        </SearchField>
        <Tabs
          selectedKey={activeTab}
          onSelectionChange={k => setActiveTab(k as ActiveTab)}
          size="sm"
        >
          <Tabs.ListContainer>
            <Tabs.List aria-label="Prospect database sections">
              <Tabs.Tab id="prospects">Prospects<Tabs.Indicator /></Tabs.Tab>
              <Tabs.Tab id="companies">Companies<Tabs.Indicator /></Tabs.Tab>
            </Tabs.List>
          </Tabs.ListContainer>
        </Tabs>
      </div>

      {/* Prospects table */}
      {activeTab === 'prospects' && (
        <Card>
          <Card.Content className="p-0">
            <Table>
              <Table.ScrollContainer>
                <Table.Content aria-label="Prospects table" data-testid="prospects-table">
                  <Table.Header>
                    <Table.Column isRowHeader>Name</Table.Column>
                    <Table.Column>Email</Table.Column>
                    <Table.Column>Status</Table.Column>
                    <Table.Column>Company</Table.Column>
                  </Table.Header>
                  <Table.Body
                    items={filteredProspects}
                    renderEmptyState={() => (
                      <div className="py-12 text-center text-sm text-muted">No prospects found.</div>
                    )}
                  >
                    {p => (
                      <Table.Row key={p.id} id={p.id} data-testid={`prospect-row-${p.id}`}>
                        <Table.Cell>
                          <span className="font-medium">{p.firstName} {p.lastName}</span>
                        </Table.Cell>
                        <Table.Cell>{p.email}</Table.Cell>
                        <Table.Cell>
                          <Chip size="sm" variant="flat" color={statusColor[p.status] ?? 'default'}>
                            {p.status}
                          </Chip>
                        </Table.Cell>
                        <Table.Cell>{p.targetCompany ?? '—'}</Table.Cell>
                      </Table.Row>
                    )}
                  </Table.Body>
                </Table.Content>
              </Table.ScrollContainer>
            </Table>
          </Card.Content>
        </Card>
      )}

      {/* Companies table */}
      {activeTab === 'companies' && (
        <Card>
          <Card.Content className="p-0">
            <Table>
              <Table.ScrollContainer>
                <Table.Content aria-label="Companies table" data-testid="companies-table">
                  <Table.Header>
                    <Table.Column isRowHeader>Name</Table.Column>
                    <Table.Column>Client ID</Table.Column>
                  </Table.Header>
                  <Table.Body
                    items={filteredCompanies}
                    renderEmptyState={() => (
                      <div className="py-12 text-center text-sm text-muted">No companies found.</div>
                    )}
                  >
                    {c => (
                      <Table.Row key={c.id} id={c.id} data-testid={`company-row-${c.id}`}>
                        <Table.Cell><span className="font-medium">{c.name}</span></Table.Cell>
                        <Table.Cell>{c.clientId ?? '—'}</Table.Cell>
                      </Table.Row>
                    )}
                  </Table.Body>
                </Table.Content>
              </Table.ScrollContainer>
            </Table>
          </Card.Content>
        </Card>
      )}
    </div>
  )
}
