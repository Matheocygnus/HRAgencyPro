import { useState, useMemo } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Table, Chip, Button, Card, Tabs, Skeleton } from '@heroui/react'
import { Plus, Search } from 'lucide-react'
import { usePermissions } from '../../../features/auth/use-permissions'
import { AccessDenied } from '../../../components/AccessDenied'
import { jobsApi } from '../../../api/jobs.api'
import { prospectsApi } from '../../../api/prospects.api'
import { clientsApi } from '../../../api/clients.api'
import type { JobOpening, JobApplication, JobRequest, ApplicationStatus } from '../../../types/job.types'
import { JobOpeningFormDialog } from '../../../features/jobs/components/JobOpeningFormDialog'
import { JobApplicationFormDialog } from '../../../features/jobs/components/JobApplicationFormDialog'
import { JobRequestFormDialog } from '../../../features/jobs/components/JobRequestFormDialog'
import { ConfirmDialog } from '../../../components/ConfirmDialog'

export const Route = createFileRoute('/_authenticated/_dashboard-shell/jobs')({
  component: JobsPage,
})

type MainTab = 'openings' | 'applications' | 'requests'
type AppStatusTab = 'all' | ApplicationStatus

const STATUS_STAGES: ApplicationStatus[] = [
  'new', 'screened', 'cv_sent', 'interview_scheduled', 'offer_agreed', 'hired', 'rejected',
]

const STATUS_LABELS: Record<ApplicationStatus, string> = {
  new: 'New',
  screened: 'Screened',
  cv_sent: 'CV Sent',
  interview_scheduled: 'Interview',
  offer_agreed: 'Offer Agreed',
  hired: 'Hired',
  rejected: 'Rejected',
}

const NEXT_STAGES: Partial<Record<ApplicationStatus, ApplicationStatus[]>> = {
  new: ['screened', 'rejected'],
  screened: ['cv_sent', 'rejected'],
  cv_sent: ['interview_scheduled', 'rejected'],
  interview_scheduled: ['offer_agreed', 'rejected'],
  offer_agreed: ['hired', 'rejected'],
}

const statusColor: Record<string, 'default' | 'primary' | 'success' | 'warning' | 'danger'> = {
  open: 'primary', published: 'success', closed: 'default',
  new: 'default', screened: 'primary', cv_sent: 'primary',
  interview_scheduled: 'warning', offer_agreed: 'warning',
  hired: 'success', rejected: 'danger',
  pending: 'warning', converted: 'primary', rejected: 'danger',
}

export function JobsPage() {
  const { can } = usePermissions()
  if (!can('jobs') && !can('jobs:read')) return <AccessDenied />
  const canWrite = can('jobs')
  const canCreateRequest = can('jobs') || can('jobs:create')
  const queryClient = useQueryClient()
  const [mainTab, setMainTab] = useState<MainTab>('openings')

  // Opening state
  const [selectedOpeningId, setSelectedOpeningId] = useState<number | null>(null)
  const [openingDialogOpen, setOpeningDialogOpen] = useState(false)
  const [editOpening, setEditOpening] = useState<JobOpening | null>(null)
  const [deleteOpeningTarget, setDeleteOpeningTarget] = useState<number | null>(null)

  // Application state
  const [appStatusTab, setAppStatusTab] = useState<AppStatusTab>('all')
  const [appSearch, setAppSearch] = useState('')
  const [appDialogOpen, setAppDialogOpen] = useState(false)
  const [editApp, setEditApp] = useState<JobApplication | null>(null)
  const [deleteAppTarget, setDeleteAppTarget] = useState<number | null>(null)
  const [selectedAppId, setSelectedAppId] = useState<number | null>(null)

  // Request state
  const [reqDialogOpen, setReqDialogOpen] = useState(false)
  const [editRequest, setEditRequest] = useState<JobRequest | null>(null)
  const [deleteReqTarget, setDeleteReqTarget] = useState<number | null>(null)
  const [viewRequest, setViewRequest] = useState<JobRequest | null>(null)

  const { data: openings = [], isLoading: openingsLoading } = useQuery<JobOpening[]>({
    queryKey: ['job-openings'],
    queryFn: () => jobsApi.openings.list(),
  })

  const { data: applications = [], isLoading: appsLoading } = useQuery<JobApplication[]>({
    queryKey: ['job-applications'],
    queryFn: () => jobsApi.applications.list(),
  })

  const { data: requests = [], isLoading: reqsLoading } = useQuery<JobRequest[]>({
    queryKey: ['job-requests'],
    queryFn: () => jobsApi.requests.list(),
  })

  const { data: clients = [] } = useQuery({
    queryKey: ['clients'],
    queryFn: () => clientsApi.list(),
  })

  const clientMap = useMemo(() =>
    Object.fromEntries(clients.map((c: any) => [c.id, c.name])),
    [clients]
  )

  const selectedOpening = openings.find(o => o.id === selectedOpeningId) ?? null
  const selectedApp = applications.find(a => a.id === selectedAppId) ?? null

  const filteredApps = useMemo(() => {
    const byStatus =
      appStatusTab === 'all' ? applications : applications.filter(a => a.status === appStatusTab)
    const q = appSearch.trim().toLowerCase()
    if (!q) return byStatus
    return byStatus.filter(a => {
      const name = `${a.firstName ?? ''} ${a.lastName ?? ''}`.toLowerCase()
      const role = (a.role ?? '').toLowerCase()
      return name.includes(q) || role.includes(q)
    })
  }, [applications, appStatusTab, appSearch])

  // --- Opening handlers ---
  async function handleCreateOpening(data: Partial<JobOpening>) {
    await jobsApi.openings.create(data)
    queryClient.invalidateQueries({ queryKey: ['job-openings'] })
  }

  async function handleUpdateOpening(data: Partial<JobOpening>) {
    if (!editOpening) return
    const updated = await jobsApi.openings.update(editOpening.id, data)
    queryClient.setQueryData<JobOpening[]>(['job-openings'], prev =>
      prev?.map(o => o.id === updated.id ? updated : o) ?? []
    )
    setEditOpening(null)
  }

  async function handleDeleteOpening(id: number) {
    await jobsApi.openings.remove(id)
    queryClient.invalidateQueries({ queryKey: ['job-openings'] })
    if (selectedOpeningId === id) setSelectedOpeningId(null)
  }

  // --- Application handlers ---
  async function handleCreateApp(data: Partial<JobApplication>) {
    await jobsApi.applications.create(data)
    queryClient.invalidateQueries({ queryKey: ['job-applications'] })
  }

  async function handleUpdateApp(data: Partial<JobApplication>) {
    if (!editApp) return
    await jobsApi.applications.update(editApp.id, data)
    queryClient.invalidateQueries({ queryKey: ['job-applications'] })
    setEditApp(null)
  }

  async function handleDeleteApp(id: number) {
    await jobsApi.applications.remove(id)
    queryClient.invalidateQueries({ queryKey: ['job-applications'] })
  }

  async function handleConvertToProspect(app: JobApplication) {
    await prospectsApi.create({ firstName: app.firstName, lastName: app.lastName, email: app.email, status: 'sourcing' })
    queryClient.invalidateQueries({ queryKey: ['prospects'] })
  }

  async function handleChangeAppStatus(id: number, status: ApplicationStatus) {
    await jobsApi.applications.update(id, { status })
    queryClient.invalidateQueries({ queryKey: ['job-applications'] })
  }

  // --- Request handlers ---
  async function handleRejectRequest(id: number) {
    await jobsApi.requests.update(id, { status: 'rejected' })
    queryClient.invalidateQueries({ queryKey: ['job-requests'] })
  }

  async function handleConvertToOpening(req: JobRequest) {
    const budgetMatch = req.notes?.match(/^Monthly Budget: \$([0-9,]+)\/month\n?/)
    const salaryFromBudget = budgetMatch ? `$${budgetMatch[1]}/month` : undefined
    const clientNotes = req.notes ? req.notes.replace(/^Monthly Budget: [^\n]+\n?/, '').trim() : undefined
    const descriptionWithNotes = [
      req.description,
      clientNotes ? `--- Client Notes ---\n${clientNotes}` : undefined,
    ].filter(Boolean).join('\n\n')

    await jobsApi.openings.create({
      title: req.title,
      description: descriptionWithNotes || req.description,
      requirements: req.requirements,
      jobType: req.jobType,
      location: req.location ?? undefined,
      salaryRange: salaryFromBudget,
      clientId: (req as any).clientId,
      companyId: (req as any).companyId,
    })
    await jobsApi.requests.update(req.id, { status: 'converted' })
    queryClient.invalidateQueries({ queryKey: ['job-openings'] })
    queryClient.invalidateQueries({ queryKey: ['job-requests'] })
  }

  async function handleUpdateRequest(data: Partial<JobRequest>) {
    if (!editRequest) return
    await jobsApi.requests.update(editRequest.id, data)
    queryClient.invalidateQueries({ queryKey: ['job-requests'] })
    setEditRequest(null)
  }

  async function handleDeleteRequest(id: number) {
    await jobsApi.requests.remove(id)
    queryClient.invalidateQueries({ queryKey: ['job-requests'] })
  }

  return (
    <div data-testid="jobs-page" className="flex flex-col gap-4 p-4 md:gap-6 md:p-6">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground md:text-2xl">Jobs</h1>
          <p className="text-xs text-muted md:text-sm">Manage job openings, applications and requests</p>
        </div>
        {canWrite && mainTab === 'openings' && (
          <Button color="primary" size="sm" startContent={<Plus className="size-4" />} onPress={() => setOpeningDialogOpen(true)}>
            Add Opening
          </Button>
        )}
        {canWrite && mainTab === 'applications' && (
          <Button color="primary" size="sm" startContent={<Plus className="size-4" />} onPress={() => setAppDialogOpen(true)}>
            Add Application
          </Button>
        )}
        {canCreateRequest && mainTab === 'requests' && (
          <Button color="primary" size="sm" startContent={<Plus className="size-4" />} onPress={() => setReqDialogOpen(true)}>
            Add Request
          </Button>
        )}
      </div>

      {/* Main tabs */}
      <Tabs
        selectedKey={mainTab}
        onSelectionChange={k => setMainTab(k as MainTab)}
        size="sm"
      >
        <Tabs.ListContainer>
          <Tabs.List aria-label="Jobs sections">
            <Tabs.Tab id="openings" data-testid="tab-job-openings">Job Openings<Tabs.Indicator /></Tabs.Tab>
            <Tabs.Tab id="applications" data-testid="tab-job-applications">Job Applications<Tabs.Indicator /></Tabs.Tab>
            <Tabs.Tab id="requests" data-testid="tab-job-requests">Job Requests<Tabs.Indicator /></Tabs.Tab>
          </Tabs.List>
        </Tabs.ListContainer>
      </Tabs>

      {/* Job Openings tab */}
      {mainTab === 'openings' && (
        <div className="flex gap-4">
          <div className="flex-1">
            {openingsLoading ? (
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
                      <Table.Content aria-label="Job openings table" data-testid="openings-table">
                        <Table.Header>
                          <Table.Column isRowHeader>ID</Table.Column>
                          <Table.Column>Title</Table.Column>
                          <Table.Column>Client</Table.Column>
                          <Table.Column>Location</Table.Column>
                          <Table.Column>Salary Range</Table.Column>
                          <Table.Column>Status</Table.Column>
                          <Table.Column>Actions</Table.Column>
                        </Table.Header>
                        <Table.Body
                          items={openings}
                          renderEmptyState={() => (
                            <div className="py-12 text-center text-sm text-muted">No openings found.</div>
                          )}
                        >
                          {o => (
                            <Table.Row
                              key={o.id}
                              id={o.id}
                              data-testid={`opening-row-${o.id}`}
                              className="cursor-pointer"
                              onAction={() => setSelectedOpeningId(o.id === selectedOpeningId ? null : o.id)}
                            >
                              <Table.Cell><span className="font-medium">{o.id}</span></Table.Cell>
                              <Table.Cell>{o.title}</Table.Cell>
                              <Table.Cell>{clientMap[o.clientId ?? 0] ?? '—'}</Table.Cell>
                              <Table.Cell>{o.location || '—'}</Table.Cell>
                              <Table.Cell>{o.salaryRange || o.salary || '—'}</Table.Cell>
                              <Table.Cell>
                                <Chip size="sm" variant="flat" color={statusColor[o.status] ?? 'default'}>
                                  {o.status}
                                </Chip>
                              </Table.Cell>
                              <Table.Cell>
                                <div className="flex gap-1" onClick={e => e.stopPropagation()}>
                                  <Button size="sm" variant="ghost" onPress={() => setSelectedOpeningId(o.id === selectedOpeningId ? null : o.id)}>View</Button>
                                  {canWrite && <Button size="sm" variant="ghost" color="primary" onPress={() => setEditOpening(o)}>Edit</Button>}
                                  {canWrite && <Button size="sm" variant="ghost" color="danger" onPress={() => setDeleteOpeningTarget(o.id)}>Delete</Button>}
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
          </div>

          {/* Side panel for opening details */}
          {selectedOpening && (
            <Card data-testid="opening-detail-panel" className="w-80 shrink-0 self-start">
              <Card.Header>
                <div className="flex items-start justify-between gap-2">
                  <Card.Title className="text-base">Opening #{selectedOpening.id}</Card.Title>
                  <Button size="sm" variant="ghost" onPress={() => setSelectedOpeningId(null)}>✕</Button>
                </div>
              </Card.Header>
              <Card.Content className="max-h-[70vh] overflow-y-auto">
                <dl className="flex flex-col gap-2.5 text-sm">
                  <div>
                    <dt className="text-xs font-medium text-muted">Client</dt>
                    <dd>{clientMap[selectedOpening.clientId ?? 0] ?? '—'}</dd>
                  </div>
                  <div>
                    <dt className="text-xs font-medium text-muted">Title</dt>
                    <dd className="font-medium">{selectedOpening.title}</dd>
                  </div>
                  <div>
                    <dt className="text-xs font-medium text-muted">Status</dt>
                    <dd>
                      <Chip size="sm" variant="flat" color={statusColor[selectedOpening.status] ?? 'default'}>
                        {selectedOpening.status}
                      </Chip>
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs font-medium text-muted">Job Type</dt>
                    <dd>{selectedOpening.jobType ?? '—'}</dd>
                  </div>
                  <div>
                    <dt className="text-xs font-medium text-muted">Location / Timezone</dt>
                    <dd>{selectedOpening.location || '—'}</dd>
                  </div>
                  <div>
                    <dt className="text-xs font-medium text-muted">Salary Range</dt>
                    <dd>{selectedOpening.salaryRange || selectedOpening.salary || '—'}</dd>
                  </div>
                  <div>
                    <dt className="text-xs font-medium text-muted">Created</dt>
                    <dd>{selectedOpening.createdAt ? new Date(selectedOpening.createdAt).toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '—'}</dd>
                  </div>
                  <hr className="border-divider" />
                  {selectedOpening.description && (
                    <div>
                      <dt className="text-xs font-medium text-muted">Description</dt>
                      <dd className="whitespace-pre-wrap text-xs">{selectedOpening.description}</dd>
                    </div>
                  )}
                  {selectedOpening.requirements && (
                    <div>
                      <dt className="text-xs font-medium text-muted">Requirements</dt>
                      <dd className="whitespace-pre-wrap text-xs">{selectedOpening.requirements}</dd>
                    </div>
                  )}
                </dl>
              </Card.Content>
            </Card>
          )}
        </div>
      )}

      {/* Job Applications tab */}
      {mainTab === 'applications' && (
        <div className="flex flex-col gap-4">
          {/* Status filters + search */}
          <div className="flex items-center gap-3">
            <div className="flex-1 min-w-0">
              <Tabs
                selectedKey={appStatusTab}
                onSelectionChange={k => { setAppStatusTab(k as AppStatusTab); setSelectedAppId(null) }}
                size="sm"
              >
                <Tabs.ListContainer>
                  <Tabs.List aria-label="Application status">
                    <Tabs.Tab id="all">All<Tabs.Indicator /></Tabs.Tab>
                    {STATUS_STAGES.map(s => (
                      <Tabs.Tab key={s} id={s}>
                        {STATUS_LABELS[s]}
                        <Tabs.Indicator />
                      </Tabs.Tab>
                    ))}
                  </Tabs.List>
                </Tabs.ListContainer>
              </Tabs>
            </div>

            <div className="relative shrink-0 w-56">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted" />
              <input
                type="search"
                value={appSearch}
                onChange={e => setAppSearch(e.target.value)}
                placeholder="Search by name or role..."
                data-testid="app-search-input"
                className="w-full rounded-lg border border-divider bg-content1 py-2 pl-9 pr-3 text-sm text-foreground placeholder:text-muted outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          <div className="flex gap-4">
            {/* Applications table */}
            <div className="flex-1 min-w-0">
              {appsLoading ? (
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
                        <Table.Content aria-label="Job applications table" data-testid="applications-table">
                          <Table.Header>
                            <Table.Column isRowHeader>Applicant</Table.Column>
                            <Table.Column>Role</Table.Column>
                            <Table.Column>English</Table.Column>
                            <Table.Column>Seniority</Table.Column>
                            <Table.Column>Status</Table.Column>
                            <Table.Column>Actions</Table.Column>
                          </Table.Header>
                          <Table.Body
                            items={filteredApps}
                            renderEmptyState={() => (
                              <div className="py-12 text-center text-sm text-muted">No applications found.</div>
                            )}
                          >
                            {a => (
                              <Table.Row
                                key={a.id}
                                id={a.id}
                                data-testid={`app-row-${a.id}`}
                                className="cursor-pointer"
                                onAction={() => setSelectedAppId(a.id === selectedAppId ? null : a.id)}
                              >
                                <Table.Cell>
                                  <div>
                                    <p className="font-medium text-sm">{a.firstName} {a.lastName}</p>
                                    <p className="text-xs text-muted">{a.email}</p>
                                  </div>
                                </Table.Cell>
                                <Table.Cell>{a.role ?? '—'}</Table.Cell>
                                <Table.Cell>{a.englishLevel ?? '—'}</Table.Cell>
                                <Table.Cell>{a.seniority ?? '—'}</Table.Cell>
                                <Table.Cell>
                                  <Chip size="sm" variant="flat" color={statusColor[a.status] ?? 'default'}>
                                    {STATUS_LABELS[a.status] ?? a.status}
                                  </Chip>
                                </Table.Cell>
                                <Table.Cell>
                                  <div className="flex gap-1" onClick={e => e.stopPropagation()}>
                                    {canWrite && <Button size="sm" variant="ghost" color="primary" onPress={() => setEditApp(a)}>Edit</Button>}
                                    {canWrite && <Button size="sm" variant="ghost" color="danger" onPress={() => setDeleteAppTarget(a.id)}>Delete</Button>}
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
            </div>

            {/* Application detail panel */}
            {selectedApp && (
              <Card data-testid="app-detail-panel" className="w-80 shrink-0 self-start">
                <Card.Header>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <Card.Title className="text-base">{selectedApp.firstName} {selectedApp.lastName}</Card.Title>
                      <p className="text-xs text-muted">{selectedApp.email}</p>
                    </div>
                    <Button size="sm" variant="ghost" onPress={() => setSelectedAppId(null)}>✕</Button>
                  </div>
                </Card.Header>
                <Card.Content className="flex flex-col gap-3 text-sm">
                  {/* Stage advancement */}
                  {NEXT_STAGES[selectedApp.status] && (
                    <div className="flex flex-col gap-1.5">
                      <p className="text-xs font-semibold uppercase tracking-wide text-muted">Advance Stage</p>
                      <div className="flex flex-wrap gap-1.5">
                        {NEXT_STAGES[selectedApp.status]!.map(next => (
                          <Button
                            key={next}
                            size="sm"
                            color={next === 'rejected' ? 'danger' : 'success'}
                            variant="flat"
                            onPress={() => handleChangeAppStatus(selectedApp.id, next)}
                          >
                            {STATUS_LABELS[next]}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}

                  <hr className="border-divider" />

                  <dl className="flex flex-col gap-2">
                    {selectedApp.country && <div><dt className="text-xs text-muted">Country</dt><dd>{selectedApp.country}</dd></div>}
                    {selectedApp.pronoun && <div><dt className="text-xs text-muted">Pronoun</dt><dd>{selectedApp.pronoun}</dd></div>}
                    {selectedApp.role && <div><dt className="text-xs text-muted">Role</dt><dd>{selectedApp.role}</dd></div>}
                    {selectedApp.englishLevel && <div><dt className="text-xs text-muted">English Level</dt><dd>{selectedApp.englishLevel}</dd></div>}
                    {selectedApp.seniority && <div><dt className="text-xs text-muted">Seniority</dt><dd>{selectedApp.seniority}</dd></div>}
                    {selectedApp.heardAbout && <div><dt className="text-xs text-muted">Heard About</dt><dd>{selectedApp.heardAbout}</dd></div>}
                    {selectedApp.tools && <div><dt className="text-xs text-muted">Tools</dt><dd className="text-xs">{selectedApp.tools}</dd></div>}
                    {selectedApp.portfolio && (
                      <div>
                        <dt className="text-xs text-muted">Portfolio</dt>
                        <dd><a href={selectedApp.portfolio} target="_blank" rel="noopener noreferrer" className="text-primary underline text-xs">View Portfolio</a></dd>
                      </div>
                    )}
                    {selectedApp.voiceRecordingUrl && (
                      <div>
                        <dt className="text-xs text-muted">Voice Recording</dt>
                        <dd><a href={selectedApp.voiceRecordingUrl} target="_blank" rel="noopener noreferrer" className="text-primary underline text-xs">Listen on Vocaroo</a></dd>
                      </div>
                    )}
                    {selectedApp.resumeUrl && (
                      <div>
                        <dt className="text-xs text-muted">Resume</dt>
                        <dd><a href={`/uploads/jobs/${selectedApp.resumeUrl}`} target="_blank" rel="noopener noreferrer" className="text-primary underline text-xs">Download CV</a></dd>
                      </div>
                    )}
                    {selectedApp.salaryAgreement !== undefined && (
                      <div>
                        <dt className="text-xs text-muted">Salary Agreement</dt>
                        <dd>{selectedApp.salaryAgreement ? '✓ Agreed' : '✗ Not agreed'}</dd>
                      </div>
                    )}
                    {selectedApp.references && (
                      <div>
                        <dt className="text-xs text-muted">References</dt>
                        <dd className="whitespace-pre-wrap text-xs">{selectedApp.references}</dd>
                      </div>
                    )}
                  </dl>

                  <hr className="border-divider" />

                  <Button
                    size="sm"
                    variant="flat"
                    color="primary"
                    className="w-full"
                    onPress={() => handleConvertToProspect(selectedApp)}
                  >
                    Convert to Prospect
                  </Button>
                </Card.Content>
              </Card>
            )}
          </div>
        </div>
      )}

      {/* Job Requests tab */}
      {mainTab === 'requests' && (
        <div className="flex gap-4">
          <div className="flex-1 min-w-0">
            {reqsLoading ? (
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
                      <Table.Content aria-label="Job requests table" data-testid="requests-table">
                        <Table.Header>
                          <Table.Column isRowHeader>ID</Table.Column>
                          <Table.Column>Client</Table.Column>
                          <Table.Column>Title</Table.Column>
                          <Table.Column>Status</Table.Column>
                          <Table.Column>Created</Table.Column>
                          <Table.Column>Actions</Table.Column>
                        </Table.Header>
                        <Table.Body
                          items={requests}
                          renderEmptyState={() => (
                            <div className="py-12 text-center text-sm text-muted">No requests found.</div>
                          )}
                        >
                          {r => (
                            <Table.Row key={r.id} id={r.id} data-testid={`req-row-${r.id}`}>
                              <Table.Cell><span className="font-medium">{r.id}</span></Table.Cell>
                              <Table.Cell>{r.clientName ?? clientMap[r.clientId] ?? '—'}</Table.Cell>
                              <Table.Cell>{r.title}</Table.Cell>
                              <Table.Cell>
                                <Chip size="sm" variant="flat" color={statusColor[r.status] ?? 'default'}>
                                  {r.status}
                                </Chip>
                              </Table.Cell>
                              <Table.Cell>
                                {r.createdAt
                                  ? new Date(r.createdAt).toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' })
                                  : '—'}
                              </Table.Cell>
                              <Table.Cell>
                                <div className="flex gap-1 flex-wrap">
                                  <Button size="sm" variant="ghost" onPress={() => setViewRequest(viewRequest?.id === r.id ? null : r)}>View</Button>
                                  {canWrite && r.status === 'pending' && (
                                    <>
                                      <Button size="sm" variant="ghost" color="danger" onPress={() => handleRejectRequest(r.id)}>Reject</Button>
                                      <Button size="sm" variant="ghost" color="primary" onPress={() => handleConvertToOpening(r)}>To Opening</Button>
                                    </>
                                  )}
                                  {canWrite && <Button size="sm" variant="ghost" onPress={() => setEditRequest(r)}>Edit</Button>}
                                  {canWrite && <Button size="sm" variant="ghost" color="danger" onPress={() => setDeleteReqTarget(r.id)}>Delete</Button>}
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
          </div>

          {/* Request detail panel */}
          {viewRequest && (
            <Card data-testid="request-detail-panel" className="w-80 shrink-0 self-start">
              <Card.Header>
                <div className="flex items-start justify-between gap-2">
                  <Card.Title className="text-base">Request #{viewRequest.id}</Card.Title>
                  <Button size="sm" variant="ghost" onPress={() => setViewRequest(null)}>✕</Button>
                </div>
              </Card.Header>
              <Card.Content className="max-h-[70vh] overflow-y-auto">
                <dl className="flex flex-col gap-2.5 text-sm">
                  <div><dt className="text-xs font-medium text-muted">Client</dt><dd>{viewRequest.clientName ?? clientMap[viewRequest.clientId] ?? '—'}</dd></div>
                  <div><dt className="text-xs font-medium text-muted">Title</dt><dd className="font-medium">{viewRequest.title}</dd></div>
                  <div><dt className="text-xs font-medium text-muted">Status</dt><dd><Chip size="sm" variant="flat" color={statusColor[viewRequest.status] ?? 'default'}>{viewRequest.status}</Chip></dd></div>
                  {viewRequest.openPositions && <div><dt className="text-xs font-medium text-muted">Positions</dt><dd>{viewRequest.openPositions}</dd></div>}
                  {viewRequest.startDate && <div><dt className="text-xs font-medium text-muted">Start Date</dt><dd>{viewRequest.startDate}</dd></div>}
                  {viewRequest.jobType && <div><dt className="text-xs font-medium text-muted">Job Type</dt><dd>{viewRequest.jobType}</dd></div>}
                  {viewRequest.workingHours && <div><dt className="text-xs font-medium text-muted">Working Hours</dt><dd>{viewRequest.workingHours}</dd></div>}
                  {viewRequest.location && <div><dt className="text-xs font-medium text-muted">Timezone</dt><dd>{viewRequest.location}</dd></div>}
                  {viewRequest.seniority && <div><dt className="text-xs font-medium text-muted">Seniority</dt><dd>{viewRequest.seniority}</dd></div>}
                  {viewRequest.languages?.length ? <div><dt className="text-xs font-medium text-muted">Languages</dt><dd>{viewRequest.languages.join(', ')}</dd></div> : null}
                  <hr className="border-divider" />
                  {viewRequest.description && <div><dt className="text-xs font-medium text-muted">Responsibilities</dt><dd className="whitespace-pre-wrap text-xs">{viewRequest.description}</dd></div>}
                  {viewRequest.requirements && <div><dt className="text-xs font-medium text-muted">Must-have Skills</dt><dd className="whitespace-pre-wrap text-xs">{viewRequest.requirements}</dd></div>}
                  {viewRequest.niceToHaveSkills && <div><dt className="text-xs font-medium text-muted">Nice-to-have</dt><dd className="whitespace-pre-wrap text-xs">{viewRequest.niceToHaveSkills}</dd></div>}
                  {viewRequest.tools && <div><dt className="text-xs font-medium text-muted">Tools</dt><dd className="text-xs">{viewRequest.tools}</dd></div>}
                  {viewRequest.reportsTo && <div><dt className="text-xs font-medium text-muted">Reports To</dt><dd className="text-xs">{viewRequest.reportsTo}</dd></div>}
                  {viewRequest.interviewQuestions && <div><dt className="text-xs font-medium text-muted">Interview Questions</dt><dd className="whitespace-pre-wrap text-xs">{viewRequest.interviewQuestions}</dd></div>}
                  {viewRequest.testingRequirements && <div><dt className="text-xs font-medium text-muted">Testing Requirements</dt><dd className="whitespace-pre-wrap text-xs">{viewRequest.testingRequirements}</dd></div>}
                  {viewRequest.requiresProficiencyTest !== undefined && (
                    <div><dt className="text-xs font-medium text-muted">Proficiency Test</dt><dd>{viewRequest.requiresProficiencyTest ? '✓ Required' : '✗ Not required'}</dd></div>
                  )}
                  <hr className="border-divider" />
                  <div>
                    <dt className="text-xs font-medium text-muted">Notes</dt>
                    <dd className="whitespace-pre-wrap text-xs">{viewRequest.notes ?? '—'}</dd>
                  </div>
                </dl>
              </Card.Content>
            </Card>
          )}
        </div>
      )}

      {/* Dialogs */}
      <JobOpeningFormDialog
        open={openingDialogOpen}
        onClose={() => setOpeningDialogOpen(false)}
        onSubmit={handleCreateOpening}
      />

      {editOpening && (
        <JobOpeningFormDialog
          key={editOpening.id}
          open
          onClose={() => setEditOpening(null)}
          onSubmit={handleUpdateOpening}
          initial={editOpening}
        />
      )}

      <JobApplicationFormDialog
        open={appDialogOpen}
        onClose={() => setAppDialogOpen(false)}
        onSubmit={handleCreateApp}
      />

      {editApp && (
        <JobApplicationFormDialog
          open
          onClose={() => setEditApp(null)}
          onSubmit={handleUpdateApp}
          initial={editApp}
        />
      )}

      <JobRequestFormDialog
        open={reqDialogOpen}
        onClose={() => setReqDialogOpen(false)}
        onSubmit={async (data) => {
          await jobsApi.requests.create(data)
          queryClient.invalidateQueries({ queryKey: ['job-requests'] })
        }}
      />

      {editRequest && (
        <JobRequestFormDialog
          open
          onClose={() => setEditRequest(null)}
          onSubmit={handleUpdateRequest}
          defaultValues={editRequest}
          title="Edit Job Request"
        />
      )}

      <ConfirmDialog
        open={deleteOpeningTarget !== null}
        title="Delete Job"
        description="This action cannot be undone."
        onClose={() => setDeleteOpeningTarget(null)}
        onConfirm={() => { if (deleteOpeningTarget !== null) handleDeleteOpening(deleteOpeningTarget) }}
      />

      <ConfirmDialog
        open={deleteAppTarget !== null}
        title="Delete Job"
        description="This action cannot be undone."
        onClose={() => setDeleteAppTarget(null)}
        onConfirm={() => { if (deleteAppTarget !== null) handleDeleteApp(deleteAppTarget) }}
      />

      <ConfirmDialog
        open={deleteReqTarget !== null}
        title="Delete Job"
        description="This action cannot be undone."
        onClose={() => setDeleteReqTarget(null)}
        onConfirm={() => { if (deleteReqTarget !== null) handleDeleteRequest(deleteReqTarget) }}
      />
    </div>
  )
}

