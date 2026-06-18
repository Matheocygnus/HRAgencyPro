import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useQuery } from '@tanstack/react-query'
import { Modal, Button, Label, TextField } from '@heroui/react'
import { jobsApi } from '../../../api/jobs.api'
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

const schema = z.object({
  jobOpeningId: z.coerce.number().min(1, 'Job opening is required'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email'),
  phone: z.string().optional(),
  status: z.enum(['new', 'screened', 'cv_sent', 'interview_scheduled', 'offer_agreed', 'hired', 'rejected']),
})

type FormValues = z.infer<typeof schema>

interface JobApplicationFormDialogProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: Partial<JobApplication>) => void
  initial?: Partial<JobApplication>
}

export function JobApplicationFormDialog({ open, onClose, onSubmit, initial }: JobApplicationFormDialogProps) {
  const { data: openings = [] } = useQuery({
    queryKey: ['job-openings'],
    queryFn: () => jobsApi.openings.list(),
    enabled: open,
  })

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      jobOpeningId: initial?.jobOpeningId ?? 0,
      firstName: initial?.firstName ?? '',
      lastName: initial?.lastName ?? '',
      email: initial?.email ?? '',
      phone: initial?.phone ?? '',
      status: initial?.status ?? 'new',
    },
  })

  function handleFormSubmit(data: FormValues) {
    onSubmit(data)
    reset()
    onClose()
  }

  return (
    <Modal.Backdrop isOpen={open} onOpenChange={(isOpen) => { if (!isOpen) onClose() }}>
      <Modal.Container>
        <Modal.Dialog className="sm:max-w-md">
          <Modal.Header>
            <Modal.Heading>{initial ? 'Edit Application' : 'Add Application'}</Modal.Heading>
          </Modal.Header>
          <Modal.Body>
            <form
              id="job-application-form"
              onSubmit={handleSubmit(handleFormSubmit)}
              className="flex flex-col gap-4"
            >
              <TextField isInvalid={!!errors.jobOpeningId}>
                <Label>Job Opening</Label>
                <select {...register('jobOpeningId')} className="input w-full">
                  <option value={0}>Select opening...</option>
                  {openings.map(o => (
                    <option key={o.id} value={o.id}>{o.title}</option>
                  ))}
                </select>
                {errors.jobOpeningId && (
                  <p className="text-xs text-danger mt-1">{errors.jobOpeningId.message}</p>
                )}
              </TextField>
              <TextField isInvalid={!!errors.firstName}>
                <Label>First Name</Label>
                <input {...register('firstName')} className="input w-full" placeholder="First name" />
                {errors.firstName && (
                  <p className="text-xs text-danger mt-1">{errors.firstName.message}</p>
                )}
              </TextField>
              <TextField isInvalid={!!errors.lastName}>
                <Label>Last Name</Label>
                <input {...register('lastName')} className="input w-full" placeholder="Last name" />
                {errors.lastName && (
                  <p className="text-xs text-danger mt-1">{errors.lastName.message}</p>
                )}
              </TextField>
              <TextField isInvalid={!!errors.email}>
                <Label>Email</Label>
                <input {...register('email')} type="email" className="input w-full" placeholder="email@example.com" />
                {errors.email && (
                  <p className="text-xs text-danger mt-1">{errors.email.message}</p>
                )}
              </TextField>
              <TextField>
                <Label>Phone</Label>
                <input {...register('phone')} className="input w-full" placeholder="+1 555 000 0000" />
              </TextField>
              <TextField>
                <Label>Status</Label>
                <select {...register('status')} className="input w-full">
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
