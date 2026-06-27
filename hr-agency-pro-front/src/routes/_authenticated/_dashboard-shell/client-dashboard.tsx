import { useState, useMemo } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { KPI } from '@heroui-pro/react'
import { Tabs, Table, Chip, Skeleton, Card, Avatar, Button } from '@heroui/react'
import { TabScrollShadow } from '../../../components/TabScrollShadow'
import { Plus, Building2, Users, FileText, CheckCircle, XCircle } from 'lucide-react'
import { api } from '../../../lib/api'
import { useAuthContext } from '../../../features/auth/auth-context'
import { usePermissions } from '../../../features/auth/use-permissions'
import { HeroRequestDialog } from '../../../features/clients/components/HeroRequestDialog'
import { ConfirmDialog } from '../../../components/ConfirmDialog'
import { useToast } from '../../../lib/toast'
import { AccessDenied } from '../../../components/AccessDenied'

export const Route = createFileRoute('/_authenticated/_dashboard-shell/client-dashboard')({
  component: ClientDashboard,
})

interface Client { id: number; name: string; industry: string }
interface Hero {
  id: number
  prospect?: { firstName?: string; lastName?: string; position?: string }
}
interface Contract { id: number; title: string; status: string }
interface JobRequest { id: number; title: string; status: string; createdAt?: string }
interface PendingProspect { id: number; firstName: string; lastName: string; position?: string; skills?: string; email: string }

const statusColor: Record<string, 'default' | 'primary' | 'success' | 'warning' | 'danger'> = {
  active: 'success', draft: 'default', signed: 'primary',
  pending: 'warning', terminated: 'danger', open: 'primary', published: 'success',
}

const statusLabel: Record<string, string> = {
  active: 'Active', draft: 'Draft', signed: 'Signed',
  pending: 'Pending', terminated: 'Terminated', open: 'Open', published: 'Published',
}

export function ClientDashboard() {
  const { can } = usePermissions()
  const { user } = useAuthContext()
  const clientId = user?.clientId
  const queryClient = useQueryClient()
  const toast = useToast()
  const [showRequestDialog, setShowRequestDialog] = useState(false)
  const [cancelTarget, setCancelTarget] = useState<number | null>(null)
  const [resubmitSource, setResubmitSource] = useState<JobRequest | null>(null)

  const approveMutation = useMutation({
    mutationFn: (id: number) => api.post(`/prospects/${id}/client-approve`).then(r => r.data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['prospects', 'pending', clientId] })
      toast.addToast('Candidate approved. Our team will follow up shortly.', 'success')
    },
    onError: () => toast.addToast('Failed to approve. Please try again.', 'error'),
  })

  const rejectMutation = useMutation({
    mutationFn: ({ id, reason }: { id: number; reason: string }) =>
      api.post(`/prospects/${id}/client-reject`, { reason }).then(r => r.data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['prospects', 'pending', clientId] })
      toast.addToast('Candidate rejected.', 'info')
    },
    onError: () => toast.addToast('Failed to reject. Please try again.', 'error'),
  })

  const cancelRequestMutation = useMutation({
    mutationFn: (id: number) => api.delete(`/job-requests/${id}/cancel`),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['job-requests'] })
      toast.addToast('Request cancelled.', 'info')
      setCancelTarget(null)
    },
    onError: () => toast.addToast('Failed to cancel request.', 'error'),
  })

  const createRequestMutation = useMutation({
    mutationFn: (data: Record<string, unknown>) =>
      api.post('/job-requests', data).then(r => r.data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['job-requests', { clientId }] })
      toast.addToast('Request submitted successfully.', 'success')
    },
    onError: () => {
      toast.addToast('Failed to submit request. Please try again.', 'error')
    },
  })

  const resubmitMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Record<string, unknown> }) =>
      api.patch(`/job-requests/${id}/resubmit`, data).then(r => r.data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['job-requests', { clientId }] })
      toast.addToast('Request resubmitted successfully.', 'success')
    },
    onError: () => {
      toast.addToast('Failed to resubmit request. Please try again.', 'error')
    },
  })

  const clientQuery = useQuery<Client>({
    queryKey: ['clients', clientId],
    queryFn: () => api.get<Client>(`/clients/${clientId}`).then(r => r.data),
    enabled: clientId != null,
  })
  const heroesQuery = useQuery<Hero[]>({
    queryKey: ['heroes', { clientId }],
    queryFn: () => api.get<Hero[]>('/heroes', { params: { clientId } }).then(r => r.data),
    enabled: clientId != null,
  })
  const contractsQuery = useQuery<Contract[]>({
    queryKey: ['contracts', { clientId }],
    queryFn: () => api.get<Contract[]>('/contracts', { params: { clientId } }).then(r => r.data),
    enabled: clientId != null,
  })
  const jobRequestsQuery = useQuery<JobRequest[]>({
    queryKey: ['job-requests', { clientId }],
    queryFn: () => api.get<JobRequest[]>('/job-requests', { params: { clientId } }).then(r => r.data),
    enabled: clientId != null,
  })

  const pendingQuery = useQuery<PendingProspect[]>({
    queryKey: ['prospects', 'pending', clientId],
    queryFn: () => api.get<PendingProspect[]>('/prospects/awaiting-approval').then(r => r.data),
    enabled: clientId != null,
  })

  const heroes = heroesQuery.data ?? []
  const contracts = contractsQuery.data ?? []
  const jobRequests = jobRequestsQuery.data ?? []
  const pending = pendingQuery.data ?? []
  const isLoadingStats = clientQuery.isLoading || heroesQuery.isLoading || contractsQuery.isLoading

  const resubmitDefaults = useMemo(() => {
    if (!resubmitSource) return undefined
    const req = resubmitSource
    let budget: number | undefined
    let notes: string | undefined = req.notes
    if (req.notes) {
      const match = req.notes.match(/^Monthly Budget: \$([0-9,]+)\/month\n?/)
      if (match) {
        budget = Number(match[1].replace(/,/g, ''))
        notes = req.notes.slice(match[0].length).trim() || undefined
      }
    }
    return {
      title: req.title,
      openPositions: req.openPositions,
      startDate: req.startDate ?? undefined,
      description: req.description ?? undefined,
      requirements: req.requirements ?? undefined,
      niceToHaveSkills: req.niceToHaveSkills ?? undefined,
      tools: req.tools ?? undefined,
      jobType: req.jobType ?? undefined,
      workingHours: req.workingHours ?? undefined,
      timezone: req.location ?? undefined,
      reportsTo: req.reportsTo ?? undefined,
      languages: req.languages ?? [],
      seniority: req.seniority ?? undefined,
      requiresProficiencyTest: req.requiresProficiencyTest ?? false,
      interviewQuestions: req.interviewQuestions ?? undefined,
      testingRequirements: req.testingRequirements ?? undefined,
      budget,
      notes,
    }
  }, [resubmitSource])

  if (!can('client_dashboard')) return <AccessDenied />

  return (
    <div data-testid="client-dashboard" className="flex flex-col gap-6 p-4 md:p-6">

      {/* Page header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          {clientQuery.isLoading ? (
            <>
              <Skeleton className="mb-2 h-7 w-48 rounded-lg" />
              <Skeleton className="h-4 w-32 rounded-lg" />
            </>
          ) : (
            <>
              <h1 className="text-2xl font-bold tracking-tight text-foreground">
                {clientQuery.data?.name ?? 'Client Dashboard'}
              </h1>
              {clientQuery.data?.industry && (
                <p className="mt-0.5 text-sm text-muted">{clientQuery.data.industry}</p>
              )}
            </>
          )}
        </div>
        <Button
          color="primary"
          size="sm"
          onPress={() => setShowRequestDialog(true)}
          startContent={<Plus className="size-4" />}
          className="shrink-0"
        >
          New Request
        </Button>
      </div>

      {/* KPI grid */}
      {isLoadingStats ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <KPI>
            <KPI.Header>
              <KPI.Title>Company</KPI.Title>
              <Building2 className="size-4 text-muted" />
            </KPI.Header>
            <KPI.Content>
              <span className="text-lg font-semibold leading-tight">
                {clientQuery.data?.name ?? '—'}
              </span>
            </KPI.Content>
          </KPI>
          <KPI>
            <KPI.Header>
              <KPI.Title>Active Heroes</KPI.Title>
              <Users className="size-4 text-muted" />
            </KPI.Header>
            <KPI.Content>
              <span data-testid="stat-heroes">
                <KPI.Value value={heroes.length} maximumFractionDigits={0} />
              </span>
            </KPI.Content>
          </KPI>
          <KPI>
            <KPI.Header>
              <KPI.Title>Contracts</KPI.Title>
              <FileText className="size-4 text-muted" />
            </KPI.Header>
            <KPI.Content>
              <span data-testid="stat-contracts">
                <KPI.Value value={contracts.length} maximumFractionDigits={0} />
              </span>
            </KPI.Content>
          </KPI>
        </div>
      )}

      {/* Activity card */}
      <Card>
        <Card.Header>
          <Card.Title>Activity</Card.Title>
          <Card.Description>Your heroes, contracts, and open requests</Card.Description>
        </Card.Header>
        <Card.Content>
          <Tabs defaultSelectedKey="overview">
            <TabScrollShadow>
              <Tabs.ListContainer className="max-md:!overflow-x-visible">
                <Tabs.List aria-label="Client dashboard tabs" className="max-md:!w-max max-md:*:!w-auto max-md:*:!shrink-0">
                <Tabs.Tab id="overview">Overview<Tabs.Indicator /></Tabs.Tab>
                <Tabs.Tab id="heroes">
                  Heroes
                  {heroes.length > 0 && (
                    <Chip size="sm" variant="flat" color="primary" className="ml-1.5 h-4 min-w-4 px-1 text-[10px]">
                      {heroes.length}
                    </Chip>
                  )}
                  <Tabs.Indicator />
                </Tabs.Tab>
                <Tabs.Tab id="job-requests">
                  Requests
                  {jobRequests.length > 0 && (
                    <Chip size="sm" variant="flat" color="primary" className="ml-1.5 h-4 min-w-4 px-1 text-[10px]">
                      {jobRequests.length}
                    </Chip>
                  )}
                  <Tabs.Indicator />
                </Tabs.Tab>
                <Tabs.Tab id="contracts">
                  Contracts
                  {contracts.length > 0 && (
                    <Chip size="sm" variant="flat" color="primary" className="ml-1.5 h-4 min-w-4 px-1 text-[10px]">
                      {contracts.length}
                    </Chip>
                  )}
                  <Tabs.Indicator />
                </Tabs.Tab>
                <Tabs.Tab id="pending">
                  Pending Approval
                  {pending.length > 0 && (
                    <Chip size="sm" variant="flat" color="warning" className="ml-1.5 h-4 min-w-4 px-1 text-[10px]">
                      {pending.length}
                    </Chip>
                  )}
                  <Tabs.Indicator />
                </Tabs.Tab>
              </Tabs.List>
              </Tabs.ListContainer>
            </TabScrollShadow>

            <Tabs.Panel id="overview" className="pt-4">
              {clientQuery.data ? (
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-3 rounded-lg border border-divider bg-content2 px-4 py-3">
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                      <Building2 className="size-4" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{clientQuery.data.name}</p>
                      <p className="text-xs text-muted">{clientQuery.data.industry}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    <div className="rounded-lg border border-divider bg-content2 px-4 py-3 text-center">
                      <p className="text-2xl font-bold text-foreground">{heroes.length}</p>
                      <p className="text-xs text-muted">Heroes</p>
                    </div>
                    <div className="rounded-lg border border-divider bg-content2 px-4 py-3 text-center">
                      <p className="text-2xl font-bold text-foreground">{contracts.length}</p>
                      <p className="text-xs text-muted">Contracts</p>
                    </div>
                    <div className="col-span-2 rounded-lg border border-divider bg-content2 px-4 py-3 text-center sm:col-span-1">
                      <p className="text-2xl font-bold text-foreground">{jobRequests.length}</p>
                      <p className="text-xs text-muted">Requests</p>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="py-8 text-center text-sm text-muted">No client data available.</p>
              )}
            </Tabs.Panel>

            <Tabs.Panel id="heroes" className="pt-4">
              <div className="overflow-x-auto">
                <Table>
                  <Table.Content aria-label="Heroes table">
                    <Table.Header>
                      <Table.Column isRowHeader>Hero</Table.Column>
                      <Table.Column>Role</Table.Column>
                    </Table.Header>
                    <Table.Body items={heroes} renderEmptyState={() => (
                      <div className="py-10 text-center text-sm text-muted">No heroes assigned yet.</div>
                    )}>
                      {hero => {
                        const name = [hero.prospect?.firstName, hero.prospect?.lastName].filter(Boolean).join(' ') || '—'
                        const title = hero.prospect?.position ?? '—'
                        return (
                          <Table.Row key={hero.id}>
                            <Table.Cell>
                              <div className="flex items-center gap-3">
                                <Avatar size="sm">
                                  <Avatar.Fallback>{name.split(' ').map((n: string) => n[0]).join('').slice(0,2).toUpperCase()}</Avatar.Fallback>
                                </Avatar>
                                <span className="font-medium">{name}</span>
                              </div>
                            </Table.Cell>
                            <Table.Cell>
                              <span className="text-sm text-muted">{title}</span>
                            </Table.Cell>
                          </Table.Row>
                        )
                      }}
                    </Table.Body>
                  </Table.Content>
                </Table>
              </div>
            </Tabs.Panel>

            <Tabs.Panel id="job-requests" className="pt-4">
              <div className="overflow-x-auto">
                <Table>
                  <Table.Content aria-label="Job requests table">
                    <Table.Header>
                      <Table.Column isRowHeader>Title</Table.Column>
                      <Table.Column>Status</Table.Column>
                      <Table.Column>Actions</Table.Column>
                    </Table.Header>
                    <Table.Body items={jobRequests} renderEmptyState={() => (
                      <div className="py-10 text-center text-sm text-muted">
                        No job requests yet.{' '}
                        <button
                          onClick={() => setShowRequestDialog(true)}
                          className="text-primary underline-offset-2 hover:underline"
                        >
                          Create one
                        </button>
                      </div>
                    )}>
                      {req => (
                        <Table.Row key={req.id}>
                          <Table.Cell>
                            <span className="font-medium">{req.title}</span>
                          </Table.Cell>
                          <Table.Cell>
                            <Chip color={statusColor[req.status] ?? 'default'} size="sm" variant="flat">
                              {statusLabel[req.status] ?? req.status}
                            </Chip>
                          </Table.Cell>
                          <Table.Cell>
                            {req.status === 'pending' && (
                              <Button
                                size="sm"
                                variant="ghost"
                                color="danger"
                                onPress={() => setCancelTarget(req.id)}
                              >
                                Cancel
                              </Button>
                            )}
                            {req.status === 'rejected' && (
                              <Button
                                size="sm"
                                variant="ghost"
                                color="primary"
                                onPress={() => {
                                  setResubmitSource(req)
                                  setShowRequestDialog(true)
                                }}
                              >
                                Resubmit
                              </Button>
                            )}
                          </Table.Cell>
                        </Table.Row>
                      )}
                    </Table.Body>
                  </Table.Content>
                </Table>
              </div>
            </Tabs.Panel>
            <Tabs.Panel id="contracts" className="pt-4">
              <div className="overflow-x-auto">
                <Table>
                  <Table.Content aria-label="Contracts table">
                    <Table.Header>
                      <Table.Column isRowHeader>Title</Table.Column>
                      <Table.Column>Status</Table.Column>
                    </Table.Header>
                    <Table.Body items={contracts} renderEmptyState={() => (
                      <div className="py-10 text-center text-sm text-muted">No active contracts.</div>
                    )}>
                      {contract => (
                        <Table.Row key={contract.id}>
                          <Table.Cell>
                            <span className="font-medium">{contract.title}</span>
                          </Table.Cell>
                          <Table.Cell>
                            <Chip color={statusColor[contract.status] ?? 'default'} size="sm" variant="flat">
                              {statusLabel[contract.status] ?? contract.status}
                            </Chip>
                          </Table.Cell>
                        </Table.Row>
                      )}
                    </Table.Body>
                  </Table.Content>
                </Table>
              </div>
            </Tabs.Panel>

            <Tabs.Panel id="pending" className="pt-4">
              {pendingQuery.isLoading ? (
                <div className="flex flex-col gap-4">
                  {[1, 2].map(i => <Skeleton key={i} className="h-24 rounded-2xl" />)}
                </div>
              ) : pending.length === 0 ? (
                <div className="py-10 text-center text-sm text-muted">
                  No candidates awaiting your approval.
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {pending.map(prospect => (
                    <div
                      key={prospect.id}
                      className="group flex items-center justify-between gap-4 rounded-2xl border border-divider bg-content2 px-5 py-4 transition-shadow hover:shadow-md"
                    >
                      <div className="flex items-center gap-4 min-w-0">
                        <Avatar size="md" className="shrink-0 ring-2 ring-divider">
                          <Avatar.Fallback>
                            {`${prospect.firstName} ${prospect.lastName}`.split(' ').filter((n: string) => /^[a-zA-Z]/.test(n)).map((n: string) => n[0]).join('').slice(0,2).toUpperCase()}
                          </Avatar.Fallback>
                        </Avatar>
                        <div className="min-w-0">
                          <p className="font-semibold text-foreground">
                            {prospect.firstName} {prospect.lastName}
                          </p>
                          {prospect.position && (
                            <p className="text-sm text-muted">{prospect.position}</p>
                          )}
                          {prospect.skills && (
                            <div className="mt-1.5 flex flex-wrap gap-1">
                              {prospect.skills.split(',').slice(0, 4).map(s => (
                                <span
                                  key={s}
                                  className="rounded-md bg-content3 px-2 py-0.5 text-[11px] text-muted"
                                >
                                  {s.trim()}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex shrink-0 gap-2">
                        <button
                          onClick={() => approveMutation.mutate(prospect.id)}
                          disabled={approveMutation.isPending || rejectMutation.isPending}
                          className="flex items-center gap-1.5 rounded-lg border border-success/30 bg-success/10 px-3 py-1.5 text-sm font-medium text-success transition-all hover:border-success hover:bg-success hover:text-white disabled:opacity-50"
                        >
                          <CheckCircle className="size-4" />
                          Approve
                        </button>
                        <button
                          onClick={() => rejectMutation.mutate({ id: prospect.id, reason: 'Not a fit' })}
                          disabled={approveMutation.isPending || rejectMutation.isPending}
                          className="flex items-center gap-1.5 rounded-lg border border-danger/30 bg-danger/10 px-3 py-1.5 text-sm font-medium text-danger transition-all hover:border-danger hover:bg-danger hover:text-white disabled:opacity-50"
                        >
                          <XCircle className="size-4" />
                          Reject
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Tabs.Panel>
          </Tabs>
        </Card.Content>
      </Card>

      <HeroRequestDialog
        key={resubmitSource?.id ?? 'new'}
        open={showRequestDialog}
        onClose={() => {
          setShowRequestDialog(false)
          setResubmitSource(null)
        }}
        onSubmit={(data) => {
          const { budget, notes, timezone, ...rest } = data
          const budgetLine = budget ? `Monthly Budget: $${Number(budget).toLocaleString('en-US')}/month` : ''
          const mergedNotes = [budgetLine, notes].filter(Boolean).join('\n') || undefined
          const payload = {
            ...rest,
            location: timezone,
            notes: mergedNotes,
            clientId: clientId ?? 0,
            companyId: clientId ?? 0,
            clientName: clientQuery.data?.name,
          }
          if (resubmitSource) {
            resubmitMutation.mutate({ id: resubmitSource.id, data: { ...payload, status: 'pending' } })
          } else {
            createRequestMutation.mutate(payload)
          }
          setResubmitSource(null)
        }}
        isSubmitting={createRequestMutation.isPending || resubmitMutation.isPending}
        defaultValues={resubmitDefaults}
      />

      <ConfirmDialog
        open={cancelTarget !== null}
        title="Cancel Request"
        description="Are you sure you want to cancel this request? This action cannot be undone."
        onClose={() => setCancelTarget(null)}
        onConfirm={() => { if (cancelTarget !== null) cancelRequestMutation.mutate(cancelTarget) }}
      />
    </div>
  )
}
