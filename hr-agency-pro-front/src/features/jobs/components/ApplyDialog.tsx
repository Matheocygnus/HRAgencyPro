import { useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Modal, Button, Label, TextField } from '@heroui/react'
import { Paperclip } from 'lucide-react'

const PRONOUNS = ['He/Him', 'She/Her', 'They/Them', 'Other']
const ENGLISH_LEVELS = ['Beginner', 'Intermediate', 'Upper Intermediate', 'Advanced', 'Native']
const SENIORITY_LEVELS = ['Entry level', 'Junior (1-3 years)', 'Middle (4-5 years)', 'Senior (6+ years)']

const schema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  country: z.string().min(1, 'Country is required'),
  email: z.string().email('Invalid email'),
  phone: z.string().min(1, 'WhatsApp number is required'),
  callNumber: z.string().optional(),
  pronoun: z.string().min(1, 'Please select how to refer to you'),
  role: z.string().min(1, 'Please specify the role you are applying for'),
  otherPositions: z.string().optional(),
  heardAbout: z.string().min(1, 'Please tell us how you heard about this opportunity'),
  salaryAgreement: z.boolean().refine(v => v === true, 'You must agree with the salary rate'),
  voiceRecordingUrl: z.string().url('Please enter a valid Vocaroo URL').min(1, 'Voice recording is required'),
  englishLevel: z.string().min(1, 'English level is required'),
  seniority: z.string().min(1, 'Seniority level is required'),
  portfolio: z.string().optional(),
  tools: z.string().min(1, 'Please list your most frequently used tools'),
  otherTools: z.string().optional(),
  references: z.string().min(1, 'Please provide at least one professional reference'),
})

type FormValues = z.infer<typeof schema>

export type ApplyFormData = FormValues & { jobOpeningId: number; resumeFile: File }

interface ApplyDialogProps {
  jobOpeningId: number
  jobTitle: string
  onClose: () => void
  onSubmit: (data: ApplyFormData) => Promise<void>
}

function NativeSelect({ id, label, options, registration, error }: {
  id: string
  label: string
  options: string[]
  registration: ReturnType<ReturnType<typeof useForm>['register']>
  error?: string
}) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-sm font-medium text-foreground">{label}</label>
      <select
        id={id}
        {...registration}
        className="rounded-lg border border-divider bg-content1 px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
      >
        <option value="">Select...</option>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
      {error && <p className="text-xs text-danger">{error}</p>}
    </div>
  )
}

export function ApplyDialog({ jobOpeningId, jobTitle, onClose, onSubmit }: ApplyDialogProps) {
  const [success, setSuccess] = useState(false)
  const [resumeFile, setResumeFile] = useState<File | null>(null)
  const [resumeError, setResumeError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { salaryAgreement: false },
  })

  async function handleFormSubmit(data: FormValues) {
    if (!resumeFile) {
      setResumeError('Resume file is required')
      return
    }
    setResumeError(null)
    await onSubmit({ ...data, jobOpeningId, resumeFile })
    reset()
    setResumeFile(null)
    setSuccess(true)
    setTimeout(() => { setSuccess(false); onClose() }, 3000)
  }

  return (
    <Modal.Backdrop isOpen onOpenChange={(isOpen) => { if (!isOpen) onClose() }}>
      <Modal.Container>
        <Modal.Dialog className="sm:max-w-2xl" data-testid="apply-dialog" aria-label="Apply for Position">
          <Modal.CloseTrigger />
          <Modal.Header>
            <Modal.Heading>Apply for {jobTitle}</Modal.Heading>
          </Modal.Header>
          <Modal.Body className="max-h-[70vh] overflow-y-auto">
            {success && (
              <div role="alert" className="mb-4 rounded-lg bg-success/10 p-3 text-sm text-success">
                Application submitted successfully! We'll contact you via WhatsApp.
              </div>
            )}
            <form id="apply-form" onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col gap-4">

              <div className="grid grid-cols-2 gap-4">
                <TextField isInvalid={!!errors.firstName}>
                  <Label>First Name *</Label>
                  <input data-testid="input-first-name" {...register('firstName')} placeholder="First name" className="input w-full" />
                  {errors.firstName && <p className="mt-1 text-xs text-danger">{errors.firstName.message}</p>}
                </TextField>
                <TextField isInvalid={!!errors.lastName}>
                  <Label>Last Name *</Label>
                  <input data-testid="input-last-name" {...register('lastName')} placeholder="Last name" className="input w-full" />
                  {errors.lastName && <p className="mt-1 text-xs text-danger">{errors.lastName.message}</p>}
                </TextField>
              </div>

              <TextField isInvalid={!!errors.country}>
                <Label>Country *</Label>
                <input data-testid="input-country" {...register('country')} placeholder="e.g. Argentina" className="input w-full" />
                {errors.country && <p className="mt-1 text-xs text-danger">{errors.country.message}</p>}
              </TextField>

              <TextField isInvalid={!!errors.email}>
                <Label>Email *</Label>
                <input data-testid="input-email" {...register('email')} type="email" placeholder="you@example.com" className="input w-full" />
                {errors.email && <p className="mt-1 text-xs text-danger">{errors.email.message}</p>}
              </TextField>

              <TextField isInvalid={!!errors.phone}>
                <Label>WhatsApp Number * (include country code)</Label>
                <input data-testid="input-phone" {...register('phone')} placeholder="+54 9 11 1234-5678" className="input w-full" />
                {errors.phone && <p className="mt-1 text-xs text-danger">{errors.phone.message}</p>}
              </TextField>

              <TextField>
                <Label>Call Number (if different from WhatsApp)</Label>
                <input {...register('callNumber')} placeholder="+54 9 11 1234-5678" className="input w-full" />
              </TextField>

              <NativeSelect
                id="apply-pronoun"
                label="How should we refer to you? *"
                options={PRONOUNS}
                registration={register('pronoun')}
                error={errors.pronoun?.message}
              />

              <TextField isInvalid={!!errors.role}>
                <Label>Role position you are applying for *</Label>
                <input {...register('role')} placeholder="e.g. Senior React Developer" className="input w-full" />
                {errors.role && <p className="mt-1 text-xs text-danger">{errors.role.message}</p>}
              </TextField>

              <TextField>
                <Label>Other positions you'd consider (optional)</Label>
                <input {...register('otherPositions')} placeholder="e.g. Full Stack Developer, Node.js Developer" className="input w-full" />
              </TextField>

              <TextField isInvalid={!!errors.heardAbout}>
                <Label>How did you hear about this opportunity? *</Label>
                <input {...register('heardAbout')} placeholder="e.g. LinkedIn, referral, job board" className="input w-full" />
                {errors.heardAbout && <p className="mt-1 text-xs text-danger">{errors.heardAbout.message}</p>}
              </TextField>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-foreground">Salary Agreement *</label>
                <label className="flex cursor-pointer items-center gap-2 text-sm text-muted">
                  <input data-testid="checkbox-salary" type="checkbox" {...register('salaryAgreement')} className="size-4" />
                  I agree with the salary rate mentioned in the LinkedIn job post
                </label>
                {errors.salaryAgreement && <p className="text-xs text-danger">{errors.salaryAgreement.message}</p>}
              </div>

              <TextField isInvalid={!!errors.voiceRecordingUrl}>
                <Label>Voice Recording * — record at vocaroo.com and paste the link</Label>
                <input {...register('voiceRecordingUrl')} placeholder="https://vocaroo.com/..." className="input w-full" />
                {errors.voiceRecordingUrl && <p className="mt-1 text-xs text-danger">{errors.voiceRecordingUrl.message}</p>}
              </TextField>

              {/* Resume file upload */}
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-foreground">Resume / CV * (PDF or DOCX)</label>
                <div
                  className={`flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors hover:border-primary ${resumeError ? 'border-danger' : 'border-divider'}`}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Paperclip className="size-4 shrink-0 text-muted" />
                  <span className={resumeFile ? 'text-foreground' : 'text-muted'}>
                    {resumeFile ? resumeFile.name : 'Click to attach your resume...'}
                  </span>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.doc,.docx"
                  className="hidden"
                  onChange={e => {
                    const file = e.target.files?.[0] ?? null
                    setResumeFile(file)
                    if (file) setResumeError(null)
                  }}
                />
                {resumeError && <p className="text-xs text-danger">{resumeError}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <NativeSelect
                  id="apply-englishLevel"
                  label="English Level *"
                  options={ENGLISH_LEVELS}
                  registration={register('englishLevel')}
                  error={errors.englishLevel?.message}
                />
                <NativeSelect
                  id="apply-seniority"
                  label="Years of Experience *"
                  options={SENIORITY_LEVELS}
                  registration={register('seniority')}
                  error={errors.seniority?.message}
                />
              </div>

              <TextField>
                <Label>Portfolio URL (optional)</Label>
                <input {...register('portfolio')} placeholder="https://..." className="input w-full" />
              </TextField>

              <TextField isInvalid={!!errors.tools}>
                <Label>Most frequently used tools * (e.g. Google Workspace, Airtable)</Label>
                <input {...register('tools')} placeholder="Slack, Notion, Jira, Figma..." className="input w-full" />
                {errors.tools && <p className="mt-1 text-xs text-danger">{errors.tools.message}</p>}
              </TextField>

              <TextField>
                <Label>Other relevant tools (optional)</Label>
                <input {...register('otherTools')} placeholder="Any other tools not listed above" className="input w-full" />
              </TextField>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-foreground">
                  Professional References * — provide 3: Full Name, Job Title, Phone, Email, Relationship
                </label>
                <textarea
                  {...register('references')}
                  rows={5}
                  placeholder={`Reference 1: John Smith, CTO, +1 555 000 0001, john@company.com, Former Manager\nReference 2: ...\nReference 3: ...`}
                  className="rounded-lg border border-divider bg-content1 px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
                />
                {errors.references && <p className="text-xs text-danger">{errors.references.message}</p>}
              </div>

            </form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" slot="close">Cancel</Button>
            <Button
              color="accent"
              type="submit"
              form="apply-form"
              data-testid="btn-submit-apply"
              isLoading={isSubmitting}
              isDisabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Apply Now'}
            </Button>
          </Modal.Footer>
        </Modal.Dialog>
      </Modal.Container>
    </Modal.Backdrop>
  )
}
