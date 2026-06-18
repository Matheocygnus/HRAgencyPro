import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { usePermissions } from '../../../features/auth/use-permissions'
import { AccessDenied } from '../../../components/AccessDenied'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Table, Chip, Button, Card, Skeleton } from '@heroui/react'
import { Plus } from 'lucide-react'
import { interviewsApi } from '../../../api/interviews.api'
import type { Interview } from '../../../types/interview.types'
import { InterviewFormDialog } from '../../../features/interviews/components/InterviewFormDialog'
import { ConfirmDialog } from '../../../components/ConfirmDialog'

export const Route = createFileRoute('/_authenticated/_dashboard-shell/interviews')({
  component: InterviewsPage,
})

const statusColor: Record<string, 'default' | 'primary' | 'success' | 'warning' | 'danger'> = {
  scheduled: 'primary', completed: 'success', cancelled: 'danger',
}

export function InterviewsPage() {
  const { can } = usePermissions()
  if (!can('interviews')) return <AccessDenied />
  const queryClient = useQueryClient()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editTarget, setEditTarget] = useState<Interview | null>(null)
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [deleteTarget, setDeleteTarget] = useState<number | null>(null)

  const { data: interviews = [], isLoading } = useQuery<Interview[]>({
    queryKey: ['interviews'],
    queryFn: () => interviewsApi.list(),
  })

  const filtered = interviews.filter(i => {
    if (dateFrom && i.scheduledDate < dateFrom) return false
    if (dateTo && i.scheduledDate > dateTo) return false
    return true
  })

  async function handleCreate(data: Partial<Interview>) {
    await interviewsApi.create(data)
    queryClient.invalidateQueries({ queryKey: ['interviews'] })
  }

  async function handleUpdate(data: Partial<Interview>) {
    if (!editTarget) return
    await interviewsApi.update(editTarget.id, data)
    queryClient.invalidateQueries({ queryKey: ['interviews'] })
    setEditTarget(null)
  }

  async function handleDelete(id: number) {
    await interviewsApi.remove(id)
    queryClient.invalidateQueries({ queryKey: ['interviews'] })
  }

  return (
    <div data-testid="interviews-page" className="flex flex-col gap-4 p-4 md:gap-6 md:p-6">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground md:text-2xl">Interviews</h1>
          <p className="text-xs text-muted md:text-sm">Schedule and track candidate interviews</p>
        </div>
        <Button color="primary" size="sm" startContent={<Plus className="size-4" />} onPress={() => setDialogOpen(true)}>
          Schedule Interview
        </Button>
      </div>

      {/* Date range filter */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <label className="text-sm text-muted">From:</label>
          <input
            type="date"
            value={dateFrom}
            onChange={e => setDateFrom(e.target.value)}
            className="rounded border border-border bg-surface px-2 py-1 text-sm"
          />
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm text-muted">To:</label>
          <input
            type="date"
            value={dateTo}
            onChange={e => setDateTo(e.target.value)}
            className="rounded border border-border bg-surface px-2 py-1 text-sm"
          />
        </div>
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
              <Table.Content aria-label="Interviews table" data-testid="interviews-table">
                <Table.Header>
                  <Table.Column isRowHeader>ID</Table.Column>
                  <Table.Column>Prospect</Table.Column>
                  <Table.Column>Title</Table.Column>
                  <Table.Column>Scheduled Date</Table.Column>
                  <Table.Column>Duration</Table.Column>
                  <Table.Column>Status</Table.Column>
                  <Table.Column>Notes</Table.Column>
                  <Table.Column>Actions</Table.Column>
                </Table.Header>
                <Table.Body
                  renderEmptyState={() => (
                    <div className="py-12 text-center text-sm text-muted">No interviews found.</div>
                  )}
                >
                  {filtered.map(interview => (
                    <Table.Row key={interview.id} id={interview.id} data-testid={`interview-row-${interview.id}`}>
                      <Table.Cell><span className="font-medium">{interview.id}</span></Table.Cell>
                      <Table.Cell>{interview.prospectId}</Table.Cell>
                      <Table.Cell>{interview.title ?? '—'}</Table.Cell>
                      <Table.Cell>{interview.scheduledDate ? new Date(interview.scheduledDate).toLocaleString() : '—'}</Table.Cell>
                      <Table.Cell>{interview.duration ? `${interview.duration}min` : '—'}</Table.Cell>
                      <Table.Cell>
                        <Chip size="sm" variant="flat" color={statusColor[interview.status] ?? 'default'}>
                          {interview.status}
                        </Chip>
                      </Table.Cell>
                      <Table.Cell>{interview.notes ?? '—'}</Table.Cell>
                      <Table.Cell>
                        <div className="flex gap-1">
                          <Button size="sm" variant="ghost" isDisabled>Join Video Call</Button>
                          <Button size="sm" variant="ghost" color="primary" onPress={() => setEditTarget(interview)}>Edit</Button>
                          <Button size="sm" variant="ghost" color="danger" onPress={() => setDeleteTarget(interview.id)}>Delete</Button>
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

      <InterviewFormDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSubmit={handleCreate}
      />

      {editTarget && (
        <InterviewFormDialog
          open
          onClose={() => setEditTarget(null)}
          onSubmit={handleUpdate}
          defaultValues={editTarget}
          title="Edit Interview"
        />
      )}

      <ConfirmDialog
        open={deleteTarget !== null}
        title="Delete Interview"
        description="This action cannot be undone."
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => { if (deleteTarget !== null) handleDelete(deleteTarget) }}
      />
    </div>
  )
}
