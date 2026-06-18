import { useState } from 'react'
import type React from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { usePermissions } from '../../../features/auth/use-permissions'
import { AccessDenied } from '../../../components/AccessDenied'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import {
  DndContext,
  type DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
  useDroppable,
} from '@dnd-kit/core'
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Card, Chip, Button } from '@heroui/react'
import { Plus } from 'lucide-react'
import { prospectsApi } from '../../../api/prospects.api'
import { interviewsApi } from '../../../api/interviews.api'
import type { Prospect } from '../../../types/prospect.types'
import type { Interview } from '../../../types/interview.types'
import { ProspectCard } from '../../../features/prospects/components/ProspectCard'
import { ProspectFormDialog } from '../../../features/prospects/components/ProspectFormDialog'
import { PromoteToHeroDialog } from '../../../features/prospects/components/PromoteToHeroDialog'
import { RejectProspectDialog } from '../../../features/prospects/components/RejectProspectDialog'
import { InterviewFormDialog } from '../../../features/interviews/components/InterviewFormDialog'

export const Route = createFileRoute('/_authenticated/_dashboard-shell/prospects')({
  component: ProspectsKanban,
})

// Only active (non-terminal) stages are shown in the kanban.
// 'hired' and 'rejected' are terminal — hired prospects become Heroes.
const COLUMNS: { key: Prospect['status']; label: string; hint?: string }[] = [
  { key: 'sourcing', label: 'Sourcing', hint: 'New candidates' },
  { key: 'contacted', label: 'Screening', hint: 'Internal RH interview' },
  { key: 'interview', label: 'Company Review', hint: 'Resume sent to client' },
  { key: 'client_review', label: 'Client Interview', hint: 'Interview with company' },
  { key: 'budget', label: 'Budget / Negotiation', hint: 'Economic agreement' },
  { key: 'contract', label: 'Contract & Hire', hint: 'Finalize & promote to Hero' },
]

function SortableProspectCard({
  prospect,
  onEdit,
  onPromote,
  onSendResume,
  onReject,
  onCoordinateInterview,
  onCoordinateClientInterview,
}: {
  prospect: Prospect
  onEdit: () => void
  onPromote?: () => void
  onSendResume?: () => void
  onReject?: () => void
  onCoordinateInterview?: () => void
  onCoordinateClientInterview?: () => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: prospect.id,
  })
  const style = { transform: CSS.Transform.toString(transform), transition }
  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <ProspectCard
        prospect={prospect}
        onEdit={onEdit}
        onPromote={onPromote}
        onSendResume={onSendResume}
        onReject={onReject}
        onCoordinateInterview={onCoordinateInterview}
        onCoordinateClientInterview={onCoordinateClientInterview}
      />
    </div>
  )
}

function DroppableColumn({ id, children }: { id: string; children: React.ReactNode }) {
  const { setNodeRef } = useDroppable({ id })
  return <div ref={setNodeRef} className="min-h-8 space-y-2">{children}</div>
}

export function ProspectsKanban() {
  const { can } = usePermissions()
  if (!can('prospects')) return <AccessDenied />

  const queryClient = useQueryClient()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editProspect, setEditProspect] = useState<Prospect | null>(null)
  const [promoteProspect, setPromoteProspect] = useState<Prospect | null>(null)
  const [rejectProspect, setRejectProspect] = useState<Prospect | null>(null)
  const [sendResumeLoading, setSendResumeLoading] = useState<number | null>(null)
  const [interviewProspect, setInterviewProspect] = useState<{ prospect: Prospect; type: 'internal' | 'client' } | null>(null)

  const sensors = useSensors(useSensor(PointerSensor))

  const { data: prospects = [] } = useQuery<Prospect[]>({
    queryKey: ['prospects'],
    queryFn: () => prospectsApi.list(),
  })

  // Only non-terminal prospects are shown in the kanban
  const activeProspects = prospects.filter(p => p.status !== 'hired' && p.status !== 'rejected')

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over) return
    const prospectId = active.id as number

    // over.id can be a column key (string) or a prospect id (number — dropped on a card)
    let newStatus: string
    if (COLUMNS.some(c => c.key === over.id)) {
      newStatus = over.id as string
    } else {
      const overProspect = prospects.find(p => p.id === over.id)
      if (!overProspect) return
      newStatus = overProspect.status
    }

    const prospect = prospects.find(p => p.id === prospectId)
    if (!prospect || prospect.status === newStatus) return
    await prospectsApi.update(prospectId, { status: newStatus as Prospect['status'] })
    queryClient.invalidateQueries({ queryKey: ['prospects'] })
  }

  async function handleCreateProspect(data: Partial<Prospect>) {
    await prospectsApi.create(data)
    queryClient.invalidateQueries({ queryKey: ['prospects'] })
  }

  async function handleUpdateProspect(data: Partial<Prospect>) {
    if (!editProspect) return
    await prospectsApi.update(editProspect.id, data)
    queryClient.invalidateQueries({ queryKey: ['prospects'] })
  }

  async function handleSendResume(prospect: Prospect) {
    setSendResumeLoading(prospect.id)
    try {
      await prospectsApi.sendResume(prospect.id)
      queryClient.invalidateQueries({ queryKey: ['prospects'] })
    } finally {
      setSendResumeLoading(null)
    }
  }

  async function handleReject(reason: string) {
    if (!rejectProspect) return
    await prospectsApi.reject(rejectProspect.id, reason)
    queryClient.invalidateQueries({ queryKey: ['prospects'] })
    setRejectProspect(null)
  }

  async function handleScheduleInterview(data: Partial<Interview>) {
    await interviewsApi.create(data)
    queryClient.invalidateQueries({ queryKey: ['interviews'] })
    setInterviewProspect(null)
  }

  return (
    <div data-testid="prospects-kanban" className="flex flex-col gap-4 p-4 md:gap-6 md:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground md:text-2xl">Prospects Pipeline</h1>
          <p className="text-xs text-muted md:text-sm">Drag prospects across pipeline stages</p>
        </div>
        <Button color="primary" size="sm" startContent={<Plus className="size-4" />} onPress={() => setDialogOpen(true)}>
          Add Prospect
        </Button>
      </div>

      <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
        <div className="flex gap-3 overflow-x-auto pb-4">
          {COLUMNS.map(col => {
            const colProspects = activeProspects.filter(p => p.status === col.key)
            return (
              <Card key={col.key} className="w-56 shrink-0" data-testid={`column-${col.key}`}>
                <Card.Header className="flex-col items-start pb-1 pt-3">
                  <div className="flex w-full items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wide text-muted">{col.label}</span>
                    <Chip size="sm" variant="flat">{colProspects.length}</Chip>
                  </div>
                  {col.hint && (
                    <span className="text-[10px] text-muted/60 mt-0.5">{col.hint}</span>
                  )}
                </Card.Header>
                <Card.Content className="flex flex-col gap-2 pt-0">
                  <SortableContext
                    items={colProspects.map(p => p.id)}
                    strategy={verticalListSortingStrategy}
                    id={col.key}
                  >
                    <DroppableColumn id={col.key}>
                      {colProspects.map(prospect => (
                        <SortableProspectCard
                          key={prospect.id}
                          prospect={prospect}
                          onEdit={() => setEditProspect(prospect)}
                          onPromote={prospect.status === 'contract' ? () => setPromoteProspect(prospect) : undefined}
                          onSendResume={
                            prospect.status === 'interview' && sendResumeLoading !== prospect.id
                              ? () => handleSendResume(prospect)
                              : undefined
                          }
                          onReject={() => setRejectProspect(prospect)}
                          onCoordinateInterview={
                            prospect.status === 'contacted'
                              ? () => setInterviewProspect({ prospect, type: 'internal' })
                              : undefined
                          }
                          onCoordinateClientInterview={
                            prospect.status === 'client_review'
                              ? () => setInterviewProspect({ prospect, type: 'client' })
                              : undefined
                          }
                        />
                      ))}
                    </DroppableColumn>
                  </SortableContext>
                </Card.Content>
              </Card>
            )
          })}
        </div>
      </DndContext>

      {/* Add Prospect */}
      <ProspectFormDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSubmit={handleCreateProspect}
      />

      {/* Edit Prospect */}
      <ProspectFormDialog
        open={editProspect !== null}
        onClose={() => setEditProspect(null)}
        onSubmit={handleUpdateProspect}
        defaultValues={editProspect ?? undefined}
        title="Edit Prospect"
      />

      {/* Promote to Hero */}
      <PromoteToHeroDialog
        open={promoteProspect !== null}
        prospect={promoteProspect}
        onClose={() => setPromoteProspect(null)}
        onSuccess={() => queryClient.invalidateQueries({ queryKey: ['prospects'] })}
      />

      {/* Stop Process */}
      <RejectProspectDialog
        open={rejectProspect !== null}
        prospect={rejectProspect}
        onClose={() => setRejectProspect(null)}
        onConfirm={handleReject}
      />

      {/* Coordinate Interview (internal or with company) */}
      <InterviewFormDialog
        open={interviewProspect !== null}
        onClose={() => setInterviewProspect(null)}
        onSubmit={handleScheduleInterview}
        title={
          interviewProspect?.type === 'client'
            ? 'Coordinate Interview with Company'
            : 'Coordinate Interview'
        }
        lockedProspect={
          interviewProspect
            ? {
                id: interviewProspect.prospect.id,
                firstName: interviewProspect.prospect.firstName,
                lastName: interviewProspect.prospect.lastName,
              }
            : undefined
        }
        defaultValues={
          interviewProspect
            ? { prospectId: interviewProspect.prospect.id }
            : undefined
        }
      />
    </div>
  )
}
