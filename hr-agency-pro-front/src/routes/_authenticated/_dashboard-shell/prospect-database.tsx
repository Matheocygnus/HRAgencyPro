import { useState, useEffect, useRef } from 'react'

function ExpandableCell({ text }: { text: string }) {
  const [expanded, setExpanded] = useState(false)
  return (
    <button
      type="button"
      onPointerDown={(e) => e.stopPropagation()}
      onClick={(e) => { e.stopPropagation(); setExpanded(v => !v) }}
      className="w-full bg-transparent border-0 p-0 text-left cursor-pointer"
    >
      <span className="text-xs text-danger/80 italic">
        {expanded ? text : text.length > 55 ? text.slice(0, 55) + '…' : text}
      </span>
    </button>
  )
}
import { createFileRoute } from '@tanstack/react-router'
import { TabScrollShadow } from '../../../components/TabScrollShadow'
import { usePermissions } from '../../../features/auth/use-permissions'
import { AccessDenied } from '../../../components/AccessDenied'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Table, Chip, Button, Card, SearchField, Tabs, Select, ListBox } from '@heroui/react'
import type { Key } from '@heroui/react'
import { prospectsApi } from '../../../api/prospects.api'
import { companiesApi } from '../../../api/companies.api'
import { useToast } from '../../../lib/toast'
import type { Prospect } from '../../../types/prospect.types'
import type { Company } from '../../../types/company.types'
import { ProspectFormDialog } from '../../../features/prospects/components/ProspectFormDialog'
import { ConfirmDialog } from '../../../components/ConfirmDialog'

import { guardRoute } from '../../../lib/route-guard'

export const Route = createFileRoute('/_authenticated/_dashboard-shell/prospect-database')({
  beforeLoad: guardRoute('prospects'),
  component: ProspectDatabase,
})

type ActiveTab = 'prospects' | 'companies'

const normalize = (s: string) =>
  s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim()

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
  const [roleFilters, setRoleFilters] = useState<string[]>([])
  const [statusFilter, setStatusFilter] = useState('')
  const [editTarget, setEditTarget] = useState<Prospect | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<number | null>(null)
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

  const availableRoles = Array.from(
    new Set(activeProspects.map(p => p.position).filter(Boolean))
  ).sort() as string[]

  const hasFilters = debouncedSearch !== '' || roleFilters.length > 0 || statusFilter !== ''

  const filteredProspects = activeProspects.filter(p => {
    const term = debouncedSearch.toLowerCase()
    const matchesSearch = !term || (
      p.firstName.toLowerCase().includes(term) ||
      p.lastName.toLowerCase().includes(term) ||
      p.email.toLowerCase().includes(term) ||
      (p.targetCompany?.toLowerCase().includes(term) ?? false)
    )
    const matchesRole = roleFilters.length === 0 || roleFilters.some(r => normalize(r) === normalize(p.position ?? ''))
    const matchesStatus = !statusFilter || p.status === statusFilter
    return matchesSearch && matchesRole && matchesStatus
  })

  const filteredCompanies = companies.filter(c =>
    c.name.toLowerCase().includes(debouncedSearch.toLowerCase()),
  )

  async function handleUpdate(data: Partial<Prospect>) {
    if (!editTarget) return
    await prospectsApi.update(editTarget.id, data)
    queryClient.invalidateQueries({ queryKey: ['prospects'] })
    setEditTarget(null)
  }

  async function handleDelete(id: number) {
    await prospectsApi.remove(id)
    queryClient.invalidateQueries({ queryKey: ['prospects'] })
    setDeleteTarget(null)
  }

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

        {activeTab === 'prospects' && (
          <>
            <Select
              className="w-44"
              placeholder="All roles"
              selectionMode="multiple"
              value={roleFilters}
              onChange={(keys) => setRoleFilters((keys as Key[]).map(String))}
            >
              <Select.Trigger>
                <Select.Value />
                <Select.Indicator />
              </Select.Trigger>
              <Select.Popover>
                <ListBox selectionMode="multiple">
                  {availableRoles.map(r => (
                    <ListBox.Item key={r} id={r} textValue={r}>
                      {r}
                      <ListBox.ItemIndicator />
                    </ListBox.Item>
                  ))}
                </ListBox>
              </Select.Popover>
            </Select>

            <Select
              className="w-36"
              placeholder="All statuses"
              value={statusFilter || null}
              onChange={(val) => setStatusFilter(val ? String(val) : '')}
            >
              <Select.Trigger>
                <Select.Value />
                <Select.Indicator />
              </Select.Trigger>
              <Select.Popover>
                <ListBox>
                  {[
                    { id: 'sourcing', label: 'Sourcing' },
                    { id: 'contacted', label: 'Contacted' },
                    { id: 'interview', label: 'Interview' },
                    { id: 'client_review', label: 'Client Review' },
                    { id: 'budget', label: 'Budget' },
                    { id: 'contract', label: 'Contract' },
                    { id: 'rejected', label: 'Rejected' },
                  ].map(s => (
                    <ListBox.Item key={s.id} id={s.id} textValue={s.label}>
                      {s.label}
                      <ListBox.ItemIndicator />
                    </ListBox.Item>
                  ))}
                </ListBox>
              </Select.Popover>
            </Select>

            {hasFilters && (
              <Button
                size="sm"
                variant="flat"
                color="default"
                onPress={() => { setSearch(''); setRoleFilters([]); setStatusFilter('') }}
              >
                Clear filters
              </Button>
            )}
          </>
        )}

        <Tabs
          selectedKey={activeTab}
          onSelectionChange={k => setActiveTab(k as ActiveTab)}
          size="sm"
        >
          <TabScrollShadow>
            <Tabs.ListContainer className="!overflow-x-visible">
              <Tabs.List aria-label="Prospect database sections">
                <Tabs.Tab id="prospects">Prospects<Tabs.Indicator /></Tabs.Tab>
                <Tabs.Tab id="companies">Companies<Tabs.Indicator /></Tabs.Tab>
              </Tabs.List>
            </Tabs.ListContainer>
          </TabScrollShadow>
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
                    <Table.Column>Rejection Reason</Table.Column>
                    <Table.Column>Actions</Table.Column>
                  </Table.Header>
                  <Table.Body
                    items={filteredProspects}
                    renderEmptyState={() => (
                      <div className="py-12 text-center text-sm text-muted">No prospects found.</div>
                    )}
                  >
                    {p => {
                      const hasReason = p.status === 'rejected' && !!p.rejectionReason
                      return (
                        <Table.Row
                          key={p.id}
                          id={p.id}
                          data-testid={`prospect-row-${p.id}`}
                        >
                          <Table.Cell>
                            <span className="font-medium">{p.firstName} {p.lastName}</span>
                          </Table.Cell>
                          <Table.Cell>{p.email}</Table.Cell>
                          <Table.Cell>
                            <Chip size="sm" variant="flat" color={statusColor[p.status] ?? 'default'}>
                              {p.status}
                            </Chip>
                          </Table.Cell>
                          <Table.Cell>
                            {hasReason
                              ? <ExpandableCell text={p.rejectionReason!} />
                              : <span className="text-muted">—</span>
                            }
                          </Table.Cell>
                          <Table.Cell>
                            <div className="flex gap-1">
                              <Button size="sm" variant="ghost" color="primary" onPress={() => setEditTarget(p)}>Edit</Button>
                              <Button size="sm" variant="ghost" color="danger" onPress={() => setDeleteTarget(p.id)}>Delete</Button>
                            </div>
                          </Table.Cell>
                        </Table.Row>
                      )
                    }}
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
      {editTarget && (
        <ProspectFormDialog
          open
          onClose={() => setEditTarget(null)}
          onSubmit={handleUpdate}
          defaultValues={editTarget}
          title="Edit Prospect"
        />
      )}

      <ConfirmDialog
        open={deleteTarget !== null}
        title="Delete Prospect"
        description="This action cannot be undone."
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => { if (deleteTarget !== null) handleDelete(deleteTarget) }}
      />
    </div>
  )
}
