import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useQuery } from '@tanstack/react-query'
import { Modal, Button, Label, TextField } from '@heroui/react'
import { clientsApi } from '../../../api/clients.api'
import { companiesApi } from '../../../api/companies.api'
import type { JobOpening } from '../../../types/job.types'

const schema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  requirements: z.string().optional(),
  location: z.string().optional(),
  jobType: z.string().optional(),
  salaryRange: z.string().optional(),
  status: z.enum(['active', 'closed']),
  clientId: z.coerce.number().optional(),
  companyId: z.coerce.number().optional(),
})

type FormValues = z.infer<typeof schema>

interface JobOpeningFormDialogProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: Partial<JobOpening>) => void
  initial?: Partial<JobOpening>
}

export function JobOpeningFormDialog({ open, onClose, onSubmit, initial }: JobOpeningFormDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, dirtyFields },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: initial?.title ?? '',
      description: initial?.description ?? '',
      requirements: initial?.requirements ?? '',
      location: initial?.location ?? '',
      jobType: initial?.jobType ?? '',
      salaryRange: initial?.salaryRange ?? initial?.salary ?? '',
      status: initial?.status ?? 'active',
      clientId: initial?.clientId ?? undefined,
      companyId: initial?.companyId ?? undefined,
    },
  })

  const { data: clients = [] } = useQuery({
    queryKey: ['clients'],
    queryFn: () => clientsApi.list(),
    enabled: open,
  })

  const { data: companies = [] } = useQuery({
    queryKey: ['companies'],
    queryFn: () => companiesApi.list(),
    enabled: open,
  })

  const ok = (n: keyof FormValues) => !!dirtyFields[n] && !errors[n]
  const cls = (n: keyof FormValues) => `input w-full${ok(n) ? ' input-valid' : ''}`

  function handleFormSubmit(data: FormValues) {
    const payload: Partial<JobOpening> = { ...data }
    if (!payload.clientId) delete payload.clientId
    if (!payload.companyId) delete payload.companyId
    onSubmit(payload)
    reset()
    onClose()
  }

  return (
    <Modal.Backdrop isOpen={open} onOpenChange={(isOpen) => { if (!isOpen) onClose() }}>
      <Modal.Container>
        <Modal.Dialog className="sm:max-w-md" aria-label={initial ? 'Edit Job Opening' : 'Add Job Opening'}>
          <Modal.Header>
            <Modal.Heading>{initial ? 'Edit Job Opening' : 'Add Job Opening'}</Modal.Heading>
          </Modal.Header>
          <Modal.Body className="overflow-y-auto max-h-[60vh]">
            <form
              id="job-opening-form"
              onSubmit={handleSubmit(handleFormSubmit)}
              className="flex flex-col gap-4"
            >
              <TextField isInvalid={!!errors.title}>
                <Label className="field-required">Title</Label>
                <input {...register('title')} className={cls('title')} placeholder="Job title" />
                {errors.title && <p className="text-xs text-danger mt-1">{errors.title.message}</p>}
              </TextField>

              <TextField>
                <Label>Client (optional)</Label>
                <select {...register('clientId')} className={cls('clientId')}>
                  <option value="">Select client...</option>
                  {clients.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </TextField>

              <TextField>
                <Label>Company (optional)</Label>
                <select {...register('companyId')} className={cls('companyId')}>
                  <option value="">Select company...</option>
                  {companies.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </TextField>

              <TextField>
                <Label>Description</Label>
                <textarea
                  {...register('description')}
                  className={cls('description')}
                  rows={3}
                  placeholder="Job description"
                />
              </TextField>

              <TextField>
                <Label>Requirements</Label>
                <textarea
                  {...register('requirements')}
                  className={cls('requirements')}
                  rows={2}
                  placeholder="Required skills and experience"
                />
              </TextField>

              <TextField>
                <Label>Location</Label>
                <input {...register('location')} className={cls('location')} placeholder="Remote / City" />
              </TextField>

              <TextField>
                <Label>Job Type</Label>
                <select {...register('jobType')} className={cls('jobType')}>
                  <option value="">Select type</option>
                  <option value="full-time">Full-time</option>
                  <option value="part-time">Part-time</option>
                  <option value="contract">Contract</option>
                  <option value="freelance">Freelance</option>
                </select>
              </TextField>

              <TextField>
                <Label>Salary Range</Label>
                <input {...register('salaryRange')} className={cls('salaryRange')} placeholder="e.g. 5k-8k USD" />
              </TextField>

              <TextField>
                <Label>Status</Label>
                <select {...register('status')} className={cls('status')}>
                  <option value="active">Active</option>
                  <option value="closed">Closed</option>
                </select>
              </TextField>
            </form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" slot="close">Cancel</Button>
            <Button color="accent" type="submit" form="job-opening-form">Save</Button>
          </Modal.Footer>
        </Modal.Dialog>
      </Modal.Container>
    </Modal.Backdrop>
  )
}
