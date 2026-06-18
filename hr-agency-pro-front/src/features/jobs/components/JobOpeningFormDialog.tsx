import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Modal, Button, Label, TextField } from '@heroui/react'
import type { JobOpening } from '../../../types/job.types'

const schema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  requirements: z.string().optional(),
  location: z.string().optional(),
  jobType: z.string().optional(),
  salaryRange: z.string().optional(),
  status: z.enum(['active', 'closed']),
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
    formState: { errors },
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
            <Modal.Heading>{initial ? 'Edit Job Opening' : 'Add Job Opening'}</Modal.Heading>
          </Modal.Header>
          <Modal.Body>
            <form
              id="job-opening-form"
              onSubmit={handleSubmit(handleFormSubmit)}
              className="flex flex-col gap-4"
            >
              <TextField isInvalid={!!errors.title}>
                <Label>Title</Label>
                <input {...register('title')} className="input w-full" placeholder="Job title" />
                {errors.title && (
                  <p className="text-xs text-danger mt-1">{errors.title.message}</p>
                )}
              </TextField>
              <TextField>
                <Label>Description</Label>
                <textarea
                  {...register('description')}
                  className="input w-full"
                  rows={3}
                  placeholder="Job description"
                />
              </TextField>
              <TextField>
                <Label>Requirements</Label>
                <textarea
                  {...register('requirements')}
                  className="input w-full"
                  rows={2}
                  placeholder="Required skills and experience"
                />
              </TextField>
              <TextField>
                <Label>Location</Label>
                <input {...register('location')} className="input w-full" placeholder="Remote / City" />
              </TextField>
              <TextField>
                <Label>Job Type</Label>
                <select {...register('jobType')} className="input w-full">
                  <option value="">Select type</option>
                  <option value="full-time">Full-time</option>
                  <option value="part-time">Part-time</option>
                  <option value="contract">Contract</option>
                  <option value="freelance">Freelance</option>
                </select>
              </TextField>
              <TextField>
                <Label>Salary Range</Label>
                <input {...register('salaryRange')} className="input w-full" placeholder="e.g. 5k-8k USD" />
              </TextField>
              <TextField>
                <Label>Status</Label>
                <select {...register('status')} className="input w-full">
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
