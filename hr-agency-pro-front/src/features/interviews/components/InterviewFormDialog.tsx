import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useQuery } from '@tanstack/react-query'
import { Modal, Button, Label, TextField } from '@heroui/react'
import { prospectsApi } from '../../../api/prospects.api'
import type { Interview } from '../../../types/interview.types'

function toDateTimeLocal(value?: string): string {
  if (!value) return ''
  return value.slice(0, 16)
}

const schema = z.object({
  prospectId: z.coerce.number().min(1, 'Prospect is required'),
  title: z.string().min(1, 'Title is required'),
  scheduledDate: z.string().min(1, 'Scheduled date is required'),
  duration: z.coerce.number().min(1, 'Duration is required'),
  meetingLink: z.string().optional(),
  notes: z.string().optional(),
})

type FormValues = z.infer<typeof schema>

interface InterviewFormDialogProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: Partial<Interview>) => void
  defaultValues?: Partial<Interview>
  title?: string
  lockedProspect?: { id: number; firstName: string; lastName: string }
}

export function InterviewFormDialog({
  open,
  onClose,
  onSubmit,
  defaultValues,
  title = 'Schedule Interview',
  lockedProspect,
}: InterviewFormDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, dirtyFields },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      prospectId: defaultValues?.prospectId ?? 0,
      title: defaultValues?.title ?? '',
      scheduledDate: toDateTimeLocal(defaultValues?.scheduledDate),
      duration: defaultValues?.duration ?? 60,
      meetingLink: defaultValues?.meetingLink ?? '',
      notes: defaultValues?.notes ?? '',
    },
  })

  const ok = (n: keyof FormValues) => !!dirtyFields[n] && !errors[n]
  const cls = (n: keyof FormValues) => `input w-full${ok(n) ? ' input-valid' : ''}`

  const notesValue = watch('notes') ?? ''

  useEffect(() => {
    if (open) {
      reset({
        prospectId: defaultValues?.prospectId ?? 0,
        title: defaultValues?.title ?? '',
        scheduledDate: toDateTimeLocal(defaultValues?.scheduledDate),
        duration: defaultValues?.duration ?? 60,
        meetingLink: defaultValues?.meetingLink ?? '',
        notes: defaultValues?.notes ?? '',
      })
    }
  }, [open])

  const { data: prospects = [] } = useQuery({
    queryKey: ['prospects'],
    queryFn: () => prospectsApi.list(),
    enabled: open && !lockedProspect,
  })

  function handleFormSubmit(data: FormValues) {
    onSubmit(data as Partial<Interview>)
    reset()
    onClose()
  }

  return (
    <Modal.Backdrop
      isOpen={open}
      onOpenChange={(isOpen) => { if (!isOpen) onClose() }}
    >
      <Modal.Container>
        <Modal.Dialog
          className="sm:max-w-md"
          data-testid="interview-form-dialog"
          aria-label={title}
        >
          <Modal.Header>
            <Modal.Heading>{title}</Modal.Heading>
          </Modal.Header>
          <Modal.Body>
            <form
              id="interview-form"
              onSubmit={handleSubmit(handleFormSubmit)}
              className="flex flex-col gap-4"
            >
              {lockedProspect ? (
                <TextField>
                  <Label>Prospect</Label>
                  <input type="hidden" {...register('prospectId')} value={lockedProspect.id} />
                  <input
                    readOnly
                    className="input w-full opacity-60 cursor-not-allowed"
                    value={`${lockedProspect.firstName} ${lockedProspect.lastName}`}
                  />
                </TextField>
              ) : (
                <TextField isInvalid={!!errors.prospectId}>
                  <Label className="field-required">Prospect</Label>
                  <select {...register('prospectId')} className={cls('prospectId')}>
                    <option value="">Select prospect...</option>
                    {prospects.map((p: any) => (
                      <option key={p.id} value={p.id}>
                        {p.firstName} {p.lastName}
                      </option>
                    ))}
                  </select>
                  {errors.prospectId && (
                    <p className="text-xs text-danger mt-1">{errors.prospectId.message}</p>
                  )}
                </TextField>
              )}

              <TextField isInvalid={!!errors.title}>
                <Label className="field-required">Title</Label>
                <input {...register('title')} className={cls('title')} placeholder="Interview title" />
                {errors.title && (
                  <p className="text-xs text-danger mt-1">{errors.title.message}</p>
                )}
              </TextField>

              <TextField isInvalid={!!errors.scheduledDate}>
                <Label className="field-required">Scheduled Date</Label>
                <input {...register('scheduledDate')} type="datetime-local" className={cls('scheduledDate')} />
                {errors.scheduledDate && (
                  <p className="text-xs text-danger mt-1">{errors.scheduledDate.message}</p>
                )}
              </TextField>

              <TextField isInvalid={!!errors.duration}>
                <Label className="field-required">Duration (minutes)</Label>
                <input {...register('duration')} type="number" className={cls('duration')} placeholder="60" />
                {errors.duration && (
                  <p className="text-xs text-danger mt-1">{errors.duration.message}</p>
                )}
              </TextField>

              <TextField>
                <Label>Meeting Link (optional)</Label>
                <input {...register('meetingLink')} className={cls('meetingLink')} placeholder="https://..." />
              </TextField>

              <TextField>
                <div className="flex items-center justify-between">
                  <Label>Notes (optional)</Label>
                  <span className="text-xs text-muted">{notesValue.length}/500</span>
                </div>
                <textarea {...register('notes')} className={`${cls('notes')} resize-none`} rows={3} maxLength={500} />
              </TextField>
            </form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" slot="close">Cancel</Button>
            <Button color="accent" type="submit" form="interview-form">Save</Button>
          </Modal.Footer>
        </Modal.Dialog>
      </Modal.Container>
    </Modal.Backdrop>
  )
}
