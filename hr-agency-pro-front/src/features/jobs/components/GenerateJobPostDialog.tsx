import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Modal, Button, Label, TextField, Spinner } from '@heroui/react'
import { Sparkles } from 'lucide-react'

const schema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(10, 'Description is required'),
  requirements: z.string().min(10, 'Requirements are required'),
  location: z.string().min(1, 'Location is required'),
  jobType: z.string().min(1, 'Job type is required'),
  salary: z.string().optional(),
})

type FormValues = z.infer<typeof schema>

export interface GeneratedJobPost {
  title: string
  description: string
  requirements: string
  location: string
  jobType: string
  salary: string
}

interface GenerateJobPostDialogProps {
  open: boolean
  onClose: () => void
  onPublish: (data: FormValues) => void
  generated: GeneratedJobPost | null
  isGenerating: boolean
}

export function GenerateJobPostDialog({
  open,
  onClose,
  onPublish,
  generated,
  isGenerating,
}: GenerateJobPostDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  useEffect(() => {
    if (generated) reset(generated)
  }, [generated, reset])

  function handlePublish(data: FormValues) {
    onPublish(data)
    reset()
    onClose()
  }

  return (
    <Modal.Backdrop isOpen={open} onOpenChange={(isOpen) => { if (!isOpen) { reset(); onClose() } }}>
      <Modal.Container>
        <Modal.Dialog className="sm:max-w-2xl">
          <Modal.Header>
            <div className="flex items-center gap-2">
              <Sparkles className="size-5 text-primary" />
              <Modal.Heading>AI-Generated Job Post</Modal.Heading>
            </div>
          </Modal.Header>
          <Modal.Body>
            {isGenerating ? (
              <div className="flex flex-col items-center gap-3 py-12">
                <Spinner size="lg" />
                <p className="text-sm text-muted">Generating job post with Gemini AI...</p>
              </div>
            ) : (
              <form
                id="generate-job-post-form"
                onSubmit={handleSubmit(handlePublish)}
                className="flex flex-col gap-4"
              >
                <p className="text-xs text-muted">
                  Review and edit the AI-generated content before publishing. Once published it will appear on the public careers page.
                </p>

                <TextField isInvalid={!!errors.title}>
                  <Label>Job Title</Label>
                  <input {...register('title')} className="input w-full" />
                  {errors.title && <p className="mt-1 text-xs text-danger">{errors.title.message}</p>}
                </TextField>

                <TextField isInvalid={!!errors.description}>
                  <Label>Description</Label>
                  <input {...register('description')} className="input w-full" />
                  {errors.description && <p className="mt-1 text-xs text-danger">{errors.description.message}</p>}
                </TextField>

                <TextField isInvalid={!!errors.requirements}>
                  <Label>Requirements</Label>
                  <input {...register('requirements')} className="input w-full" />
                  {errors.requirements && <p className="mt-1 text-xs text-danger">{errors.requirements.message}</p>}
                </TextField>

                <div className="grid grid-cols-2 gap-4">
                  <TextField isInvalid={!!errors.location}>
                    <Label>Location</Label>
                    <input {...register('location')} className="input w-full" />
                    {errors.location && <p className="mt-1 text-xs text-danger">{errors.location.message}</p>}
                  </TextField>

                  <TextField isInvalid={!!errors.jobType}>
                    <Label>Job Type</Label>
                    <input {...register('jobType')} className="input w-full" />
                    {errors.jobType && <p className="mt-1 text-xs text-danger">{errors.jobType.message}</p>}
                  </TextField>
                </div>

                <TextField>
                  <Label>Salary Range</Label>
                  <input {...register('salary')} placeholder="e.g. $3,000 - $4,000/month" className="input w-full" />
                </TextField>
              </form>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" slot="close">Cancel</Button>
            {!isGenerating && (
              <Button
                color="primary"
                type="submit"
                form="generate-job-post-form"
                isLoading={isSubmitting}
                startContent={<Sparkles className="size-4" />}
              >
                Publish Job Post
              </Button>
            )}
          </Modal.Footer>
        </Modal.Dialog>
      </Modal.Container>
    </Modal.Backdrop>
  )
}
