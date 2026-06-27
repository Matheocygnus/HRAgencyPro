import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useQuery } from '@tanstack/react-query'
import { Modal, Button, Label, TextField } from '@heroui/react'
import { clientsApi } from '../../../api/clients.api'
import { companiesApi } from '../../../api/companies.api'
import type { JobRequest } from '../../../types/job.types'

const schema = z.object({
  clientId: z.coerce.number().min(1, 'Client is required'),
  companyId: z.coerce.number().min(1, 'Company is required'),
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  requirements: z.string().min(1, 'Requirements are required'),
  location: z.string().min(1, 'Location is required'),
  jobType: z.string().min(1, 'Job type is required'),
  salary: z.coerce.number().optional(),
  notes: z.string().optional(),
})

type FormValues = z.infer<typeof schema>

interface JobRequestFormDialogProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: Partial<JobRequest>) => void
  defaultValues?: Partial<JobRequest>
  title?: string
}

export function JobRequestFormDialog({ open, onClose, onSubmit, defaultValues, title = 'New Job Request' }: JobRequestFormDialogProps) {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, dirtyFields },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues as FormValues | undefined,
  })

  const selectedClientId = watch('clientId')

  const { data: clients = [] } = useQuery({
    queryKey: ['clients'],
    queryFn: () => clientsApi.list(),
    enabled: open,
  })

  const { data: companies = [] } = useQuery({
    queryKey: ['companies', selectedClientId],
    queryFn: () => companiesApi.list(selectedClientId ? { clientId: Number(selectedClientId) } : undefined),
    enabled: open,
  })

  useEffect(() => {
    if (!open) reset()
  }, [open, reset])

  const ok = (n: keyof FormValues) => !!dirtyFields[n] && !errors[n]
  const cls = (n: keyof FormValues) => `input w-full${ok(n) ? ' input-valid' : ''}`

  function handleFormSubmit(data: FormValues) {
    const client = clients.find((c: any) => c.id === Number(data.clientId))
    const company = companies.find((c: any) => c.id === Number(data.companyId))
    onSubmit({
      ...data,
      clientName: client?.name,
      companyName: company?.name,
    } as Partial<JobRequest>)
    reset()
    onClose()
  }

  return (
    <Modal.Backdrop isOpen={open} onOpenChange={(isOpen) => { if (!isOpen) onClose() }}>
      <Modal.Container>
        <Modal.Dialog className="sm:max-w-lg" data-testid="job-request-form-dialog" aria-label={title}>
          <Modal.Header>
            <Modal.Heading>{title}</Modal.Heading>
          </Modal.Header>
          <Modal.Body className="overflow-y-auto max-h-[60vh]">
            <form
              id="job-request-form"
              onSubmit={handleSubmit(handleFormSubmit)}
              className="flex flex-col gap-4"
            >
              <TextField isInvalid={!!errors.clientId}>
                <Label className="field-required">Client</Label>
                <select {...register('clientId')} className={cls('clientId')}>
                  <option value="">Select client...</option>
                  {clients.map((c: any) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
                {errors.clientId && <p className="text-xs text-danger mt-1">{errors.clientId.message}</p>}
              </TextField>

              <TextField isInvalid={!!errors.companyId}>
                <Label className="field-required">Company</Label>
                <select {...register('companyId')} className={cls('companyId')}>
                  <option value="">Select company...</option>
                  {companies.map((c: any) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
                {errors.companyId && <p className="text-xs text-danger mt-1">{errors.companyId.message}</p>}
              </TextField>

              <TextField isInvalid={!!errors.title}>
                <Label className="field-required">Title</Label>
                <input {...register('title')} className={cls('title')} placeholder="Position title" />
                {errors.title && <p className="text-xs text-danger mt-1">{errors.title.message}</p>}
              </TextField>

              <TextField isInvalid={!!errors.description}>
                <Label className="field-required">Description</Label>
                <textarea {...register('description')} className={cls('description')} rows={2} placeholder="Role description" />
                {errors.description && <p className="text-xs text-danger mt-1">{errors.description.message}</p>}
              </TextField>

              <TextField isInvalid={!!errors.requirements}>
                <Label className="field-required">Requirements</Label>
                <textarea {...register('requirements')} className={cls('requirements')} rows={2} placeholder="Required skills" />
                {errors.requirements && <p className="text-xs text-danger mt-1">{errors.requirements.message}</p>}
              </TextField>

              <TextField isInvalid={!!errors.location}>
                <Label className="field-required">Location</Label>
                <input {...register('location')} className={cls('location')} placeholder="Remote / City" />
                {errors.location && <p className="text-xs text-danger mt-1">{errors.location.message}</p>}
              </TextField>

              <TextField isInvalid={!!errors.jobType}>
                <Label className="field-required">Job Type</Label>
                <select {...register('jobType')} className={cls('jobType')}>
                  <option value="">Select type...</option>
                  <option value="full-time">Full-time</option>
                  <option value="part-time">Part-time</option>
                  <option value="contract">Contract</option>
                  <option value="freelance">Freelance</option>
                </select>
                {errors.jobType && <p className="text-xs text-danger mt-1">{errors.jobType.message}</p>}
              </TextField>

              <TextField>
                <Label>Salary (optional)</Label>
                <input {...register('salary')} type="number" className={cls('salary')} placeholder="Monthly in USD" />
              </TextField>

              <TextField>
                <Label>Notes (optional)</Label>
                <textarea {...register('notes')} className={cls('notes')} rows={2} />
              </TextField>
            </form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" slot="close">Cancel</Button>
            <Button color="accent" type="submit" form="job-request-form">Submit</Button>
          </Modal.Footer>
        </Modal.Dialog>
      </Modal.Container>
    </Modal.Backdrop>
  )
}
