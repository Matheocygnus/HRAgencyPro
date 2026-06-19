import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useQuery } from '@tanstack/react-query'
import { Modal, Button, Label, TextField } from '@heroui/react'
import { jobsApi } from '../../../api/jobs.api'
import { prospectsApi } from '../../../api/prospects.api'
import type { JobApplication, ApplicationStatus } from '../../../types/job.types'

const APPLICATION_STATUSES: ApplicationStatus[] = [
  'new', 'screened', 'cv_sent', 'interview_scheduled', 'offer_agreed', 'hired', 'rejected',
]

const STATUS_LABELS: Record<ApplicationStatus, string> = {
  new: 'New',
  screened: 'Screened',
  cv_sent: 'CV Sent',
  interview_scheduled: 'Interview Scheduled',
  offer_agreed: 'Offer Agreed',
  hired: 'Hired',
  rejected: 'Rejected',
}

const ENGLISH_LEVELS = ['basic', 'conversational', 'advanced', 'fluent', 'native']
const SENIORITY_LEVELS = ['junior', 'mid', 'senior', 'lead', 'principal']

const createSchema = z.object({
  prospectId: z.coerce.number().min(1, 'Prospect is required'),
  jobOpeningId: z.coerce.number().min(1, 'Job opening is required'),
  role: z.string().optional(),
  englishLevel: z.string().optional(),
  seniority: z.string().optional(),
  status: z.enum(['new', 'screened', 'cv_sent', 'interview_scheduled', 'offer_agreed', 'hired', 'rejected']),
})

const editSchema = z.object({
  role: z.string().optional(),
  englishLevel: z.string().optional(),
  seniority: z.string().optional(),
  status: z.enum(['new', 'screened', 'cv_sent', 'interview_scheduled', 'offer_agreed', 'hired', 'rejected']),
})

type CreateFormValues = z.infer<typeof createSchema>
type EditFormValues = z.infer<typeof editSchema>

interface JobApplicationFormDialogProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: Partial<JobApplication>) => void
  initial?: Partial<JobApplication>
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

export function JobApplicationFormDialog({ open, onClose, onSubmit, initial }: JobApplicationFormDialogProps) {
  const isEdit = !!initial?.id

  const { data: openings = [] } = useQuery({
    queryKey: ['job-openings'],
    queryFn: () => jobsApi.openings.list(),
    enabled: open,
  })

  const { data: prospects = [] } = useQuery({
    queryKey: ['prospects'],
    queryFn: () => prospectsApi.list(),
    enabled: open && !isEdit,
  })

  if (isEdit) {
    return (
      <EditForm
        open={open}
        onClose={onClose}
        onSubmit={onSubmit}
        initial={initial}
        schema={editSchema}
      />
    )
  }

  return (
    <CreateForm
      open={open}
      onClose={onClose}
      onSubmit={onSubmit}
      openings={openings}
      prospects={prospects}
      schema={createSchema}
    />
  )
}

function CreateForm({ open, onClose, onSubmit, openings, prospects, schema }: {
  open: boolean
  onClose: () => void
  onSubmit: (data: Partial<JobApplication>) => void
  openings: any[]
  prospects: any[]
  schema: typeof createSchema
}) {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, dirtyFields },
  } = useForm<CreateFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { prospectId: 0, jobOpeningId: 0, role: '', englishLevel: '', seniority: '', status: 'new' },
  })

  const selectedProspectId = watch('prospectId')

  useEffect(() => {
    if (!open) reset()
  }, [open, reset])

  useEffect(() => {
    if (!selectedProspectId || Number(selectedProspectId) === 0) return
    const prospect = prospects.find((p: any) => p.id === Number(selectedProspectId))
    if (!prospect) return
    setValue('role', prospect.position ?? '')
  }, [selectedProspectId, prospects, setValue])

  const ok = (n: keyof CreateFormValues) => !!dirtyFields[n] && !errors[n]
  const cls = (n: keyof CreateFormValues) => `input w-full${ok(n) ? ' input-valid' : ''}`

  function handleFormSubmit(data: CreateFormValues) {
    const prospect = prospects.find((p: any) => p.id === Number(data.prospectId))
    onSubmit({
      jobOpeningId: data.jobOpeningId,
      firstName: prospect?.firstName ?? '',
      lastName: prospect?.lastName ?? '',
      email: prospect?.email ?? '',
      phone: prospect?.phone ?? '',
      role: data.role || undefined,
      englishLevel: data.englishLevel || undefined,
      seniority: data.seniority || undefined,
      status: data.status,
    })
    reset()
    onClose()
  }

  return (
    <Modal.Backdrop isOpen={open} onOpenChange={(isOpen) => { if (!isOpen) onClose() }}>
      <Modal.Container>
        <Modal.Dialog className="sm:max-w-md">
          <Modal.Header>
            <Modal.Heading>Add Application</Modal.Heading>
          </Modal.Header>
          <Modal.Body className="overflow-y-auto max-h-[60vh]">
            <form id="job-application-form" onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col gap-4">
              <TextField isInvalid={!!errors.prospectId}>
                <Label className="field-required">Prospect</Label>
                <select {...register('prospectId')} className={cls('prospectId')}>
                  <option value={0}>Select prospect...</option>
                  {prospects.map((p: any) => (
                    <option key={p.id} value={p.id}>{p.firstName} {p.lastName} — {p.email}</option>
                  ))}
                </select>
                {errors.prospectId && <p className="text-xs text-danger mt-1">{errors.prospectId.message}</p>}
              </TextField>

              <TextField isInvalid={!!errors.jobOpeningId}>
                <Label className="field-required">Job Opening</Label>
                <select {...register('jobOpeningId')} className={cls('jobOpeningId')}>
                  <option value={0}>Select opening...</option>
                  {openings.map((o: any) => (
                    <option key={o.id} value={o.id}>{o.title}</option>
                  ))}
                </select>
                {errors.jobOpeningId && <p className="text-xs text-danger mt-1">{errors.jobOpeningId.message}</p>}
              </TextField>

              <TextField>
                <Label>Role</Label>
                <input {...register('role')} className={cls('role')} placeholder="Position applied for" />
              </TextField>

              <TextField>
                <Label>English Level</Label>
                <select {...register('englishLevel')} className={cls('englishLevel')}>
                  <option value="">Select level...</option>
                  {ENGLISH_LEVELS.map(l => <option key={l} value={l}>{capitalize(l)}</option>)}
                </select>
              </TextField>

              <TextField>
                <Label>Seniority</Label>
                <select {...register('seniority')} className={cls('seniority')}>
                  <option value="">Select seniority...</option>
                  {SENIORITY_LEVELS.map(l => <option key={l} value={l}>{capitalize(l)}</option>)}
                </select>
              </TextField>

              <TextField>
                <Label>Status</Label>
                <select {...register('status')} className={cls('status')}>
                  {APPLICATION_STATUSES.map(s => (
                    <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                  ))}
                </select>
              </TextField>
            </form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" slot="close">Cancel</Button>
            <Button color="accent" type="submit" form="job-application-form">Save</Button>
          </Modal.Footer>
        </Modal.Dialog>
      </Modal.Container>
    </Modal.Backdrop>
  )
}

function EditForm({ open, onClose, onSubmit, initial, schema }: {
  open: boolean
  onClose: () => void
  onSubmit: (data: Partial<JobApplication>) => void
  initial: Partial<JobApplication>
  schema: typeof editSchema
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, dirtyFields },
  } = useForm<EditFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      role: initial.role ?? '',
      englishLevel: initial.englishLevel ?? '',
      seniority: initial.seniority ?? '',
      status: initial.status ?? 'new',
    },
  })

  useEffect(() => {
    if (open) reset({
      role: initial.role ?? '',
      englishLevel: initial.englishLevel ?? '',
      seniority: initial.seniority ?? '',
      status: initial.status ?? 'new',
    })
  }, [open])

  const ok = (n: keyof EditFormValues) => !!dirtyFields[n] && !errors[n]
  const cls = (n: keyof EditFormValues) => `input w-full${ok(n) ? ' input-valid' : ''}`

  function handleFormSubmit(data: EditFormValues) {
    onSubmit(data)
    reset()
    onClose()
  }

  return (
    <Modal.Backdrop isOpen={open} onOpenChange={(isOpen) => { if (!isOpen) onClose() }}>
      <Modal.Container>
        <Modal.Dialog className="sm:max-w-md">
          <Modal.Header>
            <Modal.Heading>Edit Application</Modal.Heading>
          </Modal.Header>
          <Modal.Body className="overflow-y-auto max-h-[60vh]">
            <div className="mb-4 rounded-lg bg-default/10 px-4 py-3">
              <p className="text-sm font-medium">{initial.firstName} {initial.lastName}</p>
              <p className="text-xs text-muted">{initial.email}</p>
            </div>
            <form id="job-application-form" onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col gap-4">
              <TextField>
                <Label>Role</Label>
                <input {...register('role')} className={cls('role')} placeholder="Position applied for" />
              </TextField>

              <TextField>
                <Label>English Level</Label>
                <select {...register('englishLevel')} className={cls('englishLevel')}>
                  <option value="">Select level...</option>
                  {ENGLISH_LEVELS.map(l => <option key={l} value={l}>{capitalize(l)}</option>)}
                </select>
              </TextField>

              <TextField>
                <Label>Seniority</Label>
                <select {...register('seniority')} className={cls('seniority')}>
                  <option value="">Select seniority...</option>
                  {SENIORITY_LEVELS.map(l => <option key={l} value={l}>{capitalize(l)}</option>)}
                </select>
              </TextField>

              <TextField>
                <Label>Status</Label>
                <select {...register('status')} className={cls('status')}>
                  {APPLICATION_STATUSES.map(s => (
                    <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                  ))}
                </select>
              </TextField>
            </form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" slot="close">Cancel</Button>
            <Button color="accent" type="submit" form="job-application-form">Save</Button>
          </Modal.Footer>
        </Modal.Dialog>
      </Modal.Container>
    </Modal.Backdrop>
  )
}
