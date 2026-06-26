import { useState } from 'react'
import { createFileRoute, redirect } from '@tanstack/react-router'
import { usePermissions } from '../../../features/auth/use-permissions'
import { AccessDenied } from '../../../components/AccessDenied'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Table, Chip, Button, Card, Skeleton } from '@heroui/react'
import { Plus, ShoppingBag } from 'lucide-react'
import { hasPermission } from '../../../lib/permissions'
import { jobsApi } from '../../../api/jobs.api'
import { useAuth } from '../../../features/auth/use-auth'
import type { JobRequest } from '../../../types/job.types'
import { JobRequestFormDialog } from '../../../features/jobs/components/JobRequestFormDialog'
import { ConfirmDialog } from '../../../components/ConfirmDialog'
import { GenerateJobPostDialog } from '../../../features/jobs/components/GenerateJobPostDialog'

export const Route = createFileRoute('/_authenticated/_dashboard-shell/job-requests')({
  beforeLoad: ({ context }) => {
    if (!context?.permissions || !hasPermission(context.permissions, 'job-requests')) {
      throw redirect({ to: '/dashboard' })
    }
  },
  component: JobRequestsPage,
})

const statusColor: Record<string, 'default' | 'primary' | 'success' | 'warning' | 'danger'> = {
  pending: 'warning', approved: 'success', rejected: 'danger', converted: 'primary',
}

export function JobRequestsPage() {
  const { can } = usePermissions()
  if (!can('job-requests')) return <AccessDenied />
  const queryClient = useQueryClient()
  const { user } = useAuth()
  const clientId = user?.clientId as number | undefined
  const isRecruiter = !clientId

  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<number | null>(null)
  const [editTarget, setEditTarget] = useState<JobRequest | null>(null)
  const [generateDialogOpen, setGenerateDialogOpen] = useState(false)
  const [enhancedData, setEnhancedData] = useState<{ text: string; requestTitle: string; requestId: number; debug?: string } | null>(null)

  const { data: requests = [], isLoading } = useQuery<JobRequest[]>({
    queryKey: ['job-requests', { clientId }],
    queryFn: () => jobsApi.requests.list(clientId ? { clientId } : undefined),
  })

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) =>
      jobsApi.requests.update(id, { status } as Partial<JobRequest>),
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: ['job-requests'] }),
  })

  const enhanceMutation = useMutation({
    mutationFn: ({ requestId, requestTitle }: { requestId: number; requestTitle: string }) =>
      jobsApi.enhance.fromRequest(requestId).then(res => ({
        text: res.enhancedText,
        requestTitle,
        debug: res.debug,
      })),
    onSuccess: (data, variables) => setEnhancedData({ ...data, requestId: variables.requestId }),
  })

  const publishMutation = useMutation({
    mutationFn: (data: { title: string; description: string }) =>
      jobsApi.openings.create({ ...data, status: 'active' }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['job-openings'] })
      if (enhancedData?.requestId) {
        void jobsApi.requests.update(enhancedData.requestId, { status: 'converted' } as Partial<JobRequest>)
          .then(() => queryClient.invalidateQueries({ queryKey: ['job-requests'] }))
      }
    },
  })

  function handleGenerate(requestId: number, requestTitle: string) {
    setEnhancedData(null)
    setGenerateDialogOpen(true)
    enhanceMutation.mutate({ requestId, requestTitle })
  }

  async function handleCreate(data: Partial<JobRequest> & Record<string, unknown>) {
    await jobsApi.requests.create({ ...data, clientId })
    queryClient.invalidateQueries({ queryKey: ['job-requests', { clientId }] })
  }

  async function handleDelete(id: number) {
    await jobsApi.requests.remove(id)
    queryClient.invalidateQueries({ queryKey: ['job-requests', { clientId }] })
  }

  async function handleUpdate(data: Partial<JobRequest>) {
    if (!editTarget) return
    await jobsApi.requests.update(editTarget.id, data)
    queryClient.invalidateQueries({ queryKey: ['job-requests', { clientId }] })
  }

  return (
    <div data-testid="job-requests-page" className="flex flex-col gap-4 p-4 md:gap-6 md:p-6">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          {isRecruiter && <ShoppingBag className="size-5 text-primary" />}
          <div>
            <h1 className="text-xl font-bold tracking-tight text-foreground md:text-2xl">
              {isRecruiter ? 'Shopping Management' : 'My Job Requests'}
            </h1>
            <p className="text-xs text-muted md:text-sm">
              {isRecruiter ? 'Review and manage incoming Hero Requests from clients' : 'Submit and track your hiring requests'}
            </p>
          </div>
        </div>
        {!isRecruiter && (
          <Button
            color="primary"
            size="sm"
            startContent={<Plus className="size-4" />}
            data-testid="btn-add-job-request"
            onPress={() => setDialogOpen(true)}
          >
            New Request
          </Button>
        )}
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
                <Table.Content aria-label="Job requests table" data-testid="job-requests-table">
                  <Table.Header>
                    <Table.Column isRowHeader>Title</Table.Column>
                    {isRecruiter && <Table.Column>Client</Table.Column>}
                    <Table.Column>Status</Table.Column>
                    <Table.Column>Budget</Table.Column>
                    <Table.Column>Created</Table.Column>
                    <Table.Column>Actions</Table.Column>
                  </Table.Header>
                  <Table.Body
                    items={requests}
                    renderEmptyState={() => (
                      <div className="py-12 text-center text-sm text-muted">No job requests found.</div>
                    )}
                  >
                    {r => (
                      <Table.Row key={r.id} id={r.id} data-testid={`req-row-${r.id}`}>
                        <Table.Cell>
                          <div>
                            <span className="font-medium">{r.title}</span>
                            {r.description && (
                              <p className="mt-0.5 line-clamp-1 text-xs text-muted">{r.description}</p>
                            )}
                          </div>
                        </Table.Cell>
                        {isRecruiter && (
                          <Table.Cell>
                            <div className="text-sm">
                              <span className="font-medium">{(r as any).clientName ?? '—'}</span>
                              {(r as any).companyName && (
                                <p className="text-xs text-muted">{(r as any).companyName}</p>
                              )}
                            </div>
                          </Table.Cell>
                        )}
                        <Table.Cell>
                          <Chip size="sm" variant="flat" color={statusColor[r.status] ?? 'default'}>
                            {r.status}
                          </Chip>
                        </Table.Cell>
                        <Table.Cell>
                          {r.notes ?? '—'}
                        </Table.Cell>
                        <Table.Cell>{new Date(r.createdAt).toLocaleDateString()}</Table.Cell>
                        <Table.Cell>
                          <div className="flex gap-1">
                            {isRecruiter && r.status === 'pending' && (
                              <>
                                <Button
                                  size="sm" variant="flat" color="success"
                                  isLoading={statusMutation.isPending}
                                  onPress={() => statusMutation.mutate({ id: r.id, status: 'approved' })}
                                >
                                  Approve
                                </Button>
                                <Button
                                  size="sm" variant="flat" color="danger"
                                  isLoading={statusMutation.isPending}
                                  onPress={() => statusMutation.mutate({ id: r.id, status: 'rejected' })}
                                >
                                  Reject
                                </Button>
                              </>
                            )}
                            {isRecruiter && r.status === 'approved' && (
                              <Button
                                size="sm" variant="flat" color="primary"
                                isLoading={enhanceMutation.isPending && enhanceMutation.variables?.requestId === r.id}
                                onPress={() => handleGenerate(r.id, r.title)}
                              >
                                ✨ Enhance with AI
                              </Button>
                            )}
                            {!isRecruiter && r.status === 'pending' && (
                              <>
                                <Button size="sm" variant="ghost" color="warning" onPress={() => setEditTarget(r)}>
                                  Edit
                                </Button>
                                <Button size="sm" variant="ghost" color="danger" onPress={() => setDeleteTarget(r.id)}>
                                  Cancel
                                </Button>
                              </>
                            )}
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

      <JobRequestFormDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSubmit={handleCreate}
      />
      <JobRequestFormDialog
        open={editTarget !== null}
        onClose={() => setEditTarget(null)}
        onSubmit={handleUpdate}
        defaultValues={editTarget ?? undefined}
        title="Edit Job Request"
      />

      <ConfirmDialog
        open={deleteTarget !== null}
        title="Delete Job Request"
        description="This action cannot be undone."
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => { if (deleteTarget !== null) handleDelete(deleteTarget) }}
      />

      <GenerateJobPostDialog
        open={generateDialogOpen}
        onClose={() => { setGenerateDialogOpen(false); setEnhancedData(null) }}
        requestTitle={enhancedData?.requestTitle ?? enhanceMutation.variables?.requestTitle ?? ''}
        enhancedText={enhancedData?.text ?? null}
        isEnhancing={enhanceMutation.isPending}
        debugError={enhancedData?.debug}
        onPublish={(data) => publishMutation.mutate(data)}
      />
    </div>
  )
}
