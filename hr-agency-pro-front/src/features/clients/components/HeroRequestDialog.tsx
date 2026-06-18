import { useForm, useController } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Modal, Button } from '@heroui/react'
import { CheckCircle } from 'lucide-react'

const schema = z.object({
  title: z.string().min(1, 'Role title is required'),
  openPositions: z.preprocess(
    (v) => (v === '' || v === null || v === undefined ? undefined : Number(v)),
    z.number().int().positive('Must be a positive number'),
  ),
  startDate: z.string().min(1, 'Start date is required'),
  description: z.string().min(10, 'Please describe responsibilities (min 10 chars)'),
  requirements: z.string().min(10, 'Please list must-have skills (min 10 chars)'),
  niceToHaveSkills: z.string().min(10, 'Please list good-to-have skills (min 10 chars)'),
  tools: z.string().optional(),
  jobType: z.string().min(1, 'Work shift is required'),
  workingHours: z.string().min(1, 'Working hours are required'),
  timezone: z.string().min(1, 'Time zone is required'),
  reportsTo: z.string().min(1, 'Please specify who this role reports to'),
  languages: z.array(z.string()).min(1, 'Select at least one language'),
  seniority: z.string().optional(),
  requiresProficiencyTest: z.boolean().optional(),
  interviewQuestions: z.string().optional(),
  testingRequirements: z.string().optional(),
  notes: z.string().optional(),
})

type FormValues = z.infer<typeof schema>

interface HeroRequestDialogProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: FormValues) => void
  isSubmitting?: boolean
}

const WORK_SHIFTS = ['Full time (40 hours)', 'Part time (20 hours)', 'Other']

const TIMEZONES = [
  'EST – Eastern Standard',
  'EDT – Eastern Daylight',
  'CST – Central Standard',
  'CDT – Central Daylight',
  'MST – Mountain Standard',
  'MDT – Mountain Daylight',
  'PST – Pacific Standard',
  'PDT – Pacific Daylight',
  'AKST – Alaska Standard',
  'HST – Hawaii Standard',
  'EET – Eastern Europe',
  'CEST – Central European Summer',
  'Other',
]

const LANGUAGES = ['English', 'Spanish', 'French', 'Other']

const SENIORITY_LEVELS = ['Entry level', 'Junior (1-3 years)', 'Middle (4-5 years)', 'Senior (6+ years)']

function fieldClass(touched: boolean, invalid: boolean, hasValue: boolean) {
  const base =
    'w-full rounded-lg border bg-content1 px-3 py-2 text-sm text-foreground placeholder:text-muted outline-none transition-colors'
  if (invalid) return `${base} border-danger focus:border-danger focus:ring-1 focus:ring-danger`
  if (touched && hasValue) return `${base} border-success focus:border-success focus:ring-1 focus:ring-success`
  return `${base} border-divider focus:border-primary focus:ring-1 focus:ring-primary`
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null
  return <p className="mt-1 text-xs text-danger">{message}</p>
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="mb-1 block text-sm font-medium text-foreground">
      {children}
    </label>
  )
}

function ChipSelector({
  control,
  name,
  options,
  error,
  label,
}: {
  control: any
  name: string
  options: string[]
  error?: string
  label: string
}) {
  const { field } = useController({ name, control })
  return (
    <div>
      <FieldLabel>{label}</FieldLabel>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const selected = field.value === opt
          return (
            <button
              key={opt}
              type="button"
              onClick={() => field.onChange(opt)}
              className={[
                'rounded-lg border px-3 py-1.5 text-sm font-medium transition-all',
                selected
                  ? 'border-success bg-success/10 text-success'
                  : 'border-divider bg-content1 text-muted hover:border-primary hover:text-foreground',
              ].join(' ')}
            >
              {selected && <CheckCircle className="mr-1.5 inline size-3.5" />}
              {opt}
            </button>
          )
        })}
      </div>
      {error && <p className="mt-1 text-xs text-danger">{error}</p>}
    </div>
  )
}

function MultiChipSelector({
  control,
  name,
  options,
  error,
  label,
}: {
  control: any
  name: string
  options: string[]
  error?: string
  label: string
}) {
  const { field } = useController({ name, control })
  const selected: string[] = field.value ?? []

  function toggle(opt: string) {
    if (selected.includes(opt)) {
      field.onChange(selected.filter((v) => v !== opt))
    } else {
      field.onChange([...selected, opt])
    }
  }

  return (
    <div>
      <FieldLabel>{label}</FieldLabel>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const active = selected.includes(opt)
          return (
            <button
              key={opt}
              type="button"
              onClick={() => toggle(opt)}
              className={[
                'rounded-lg border px-3 py-1.5 text-sm font-medium transition-all',
                active
                  ? 'border-success bg-success/10 text-success'
                  : 'border-divider bg-content1 text-muted hover:border-primary hover:text-foreground',
              ].join(' ')}
            >
              {active && <CheckCircle className="mr-1.5 inline size-3.5" />}
              {opt}
            </button>
          )
        })}
      </div>
      {error && <p className="mt-1 text-xs text-danger">{error}</p>}
    </div>
  )
}

export function HeroRequestDialog({ open, onClose, onSubmit, isSubmitting }: HeroRequestDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    control,
    watch,
    formState: { errors, touchedFields },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: 'onTouched',
    defaultValues: {
      languages: [],
      requiresProficiencyTest: false,
    },
  })

  const values = watch()

  function handleFormSubmit(data: FormValues) {
    onSubmit(data)
    reset()
    onClose()
  }

  function handleClose() {
    reset()
    onClose()
  }

  return (
    <Modal.Backdrop isOpen={open} onOpenChange={(isOpen) => { if (!isOpen) handleClose() }}>
      <Modal.Container>
        <Modal.Dialog className="sm:max-w-lg">
          <Modal.Header>
            <Modal.Heading>New Hero Request</Modal.Heading>
            <p className="mt-0.5 text-sm text-muted">
              Tell us what role you need and we'll find the right match.
            </p>
          </Modal.Header>

          <Modal.Body className="max-h-[65vh] overflow-y-auto">
            <form
              id="hero-request-form"
              onSubmit={handleSubmit(handleFormSubmit)}
              className="flex flex-col gap-4"
            >
              <div>
                <FieldLabel>Role Title</FieldLabel>
                <input
                  {...register('title')}
                  placeholder="e.g. Senior React Developer"
                  className={fieldClass(!!touchedFields.title, !!errors.title, !!values.title)}
                />
                <FieldError message={errors.title?.message} />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <FieldLabel>Number of Positions</FieldLabel>
                  <input
                    {...register('openPositions')}
                    type="number"
                    min={1}
                    placeholder="e.g. 2"
                    className={fieldClass(!!touchedFields.openPositions, !!errors.openPositions, !!values.openPositions)}
                  />
                  <FieldError message={errors.openPositions?.message} />
                </div>
                <div>
                  <FieldLabel>Estimated Start Date</FieldLabel>
                  <input
                    {...register('startDate')}
                    type="date"
                    className={fieldClass(!!touchedFields.startDate, !!errors.startDate, !!values.startDate)}
                  />
                  <FieldError message={errors.startDate?.message} />
                </div>
              </div>

              <div>
                <FieldLabel>Overall Responsibilities</FieldLabel>
                <textarea
                  {...register('description')}
                  placeholder="What will this person do? Describe the day-to-day responsibilities."
                  rows={3}
                  className={`resize-none ${fieldClass(!!touchedFields.description, !!errors.description, (values.description?.length ?? 0) >= 10)}`}
                />
                <FieldError message={errors.description?.message} />
              </div>

              <div>
                <FieldLabel>Must-have Skills and Proficiency</FieldLabel>
                <textarea
                  {...register('requirements')}
                  placeholder="e.g. React (Advanced), Node.js (Intermediate)..."
                  rows={3}
                  className={`resize-none ${fieldClass(!!touchedFields.requirements, !!errors.requirements, (values.requirements?.length ?? 0) >= 10)}`}
                />
                <FieldError message={errors.requirements?.message} />
              </div>

              <div>
                <FieldLabel>Good-to-have Skills and Proficiency</FieldLabel>
                <textarea
                  {...register('niceToHaveSkills')}
                  placeholder="e.g. GraphQL (Basic), Docker (Basic)..."
                  rows={3}
                  className={`resize-none ${fieldClass(!!touchedFields.niceToHaveSkills, !!errors.niceToHaveSkills, (values.niceToHaveSkills?.length ?? 0) >= 10)}`}
                />
                <FieldError message={errors.niceToHaveSkills?.message} />
              </div>

              <div>
                <FieldLabel>
                  Specific Tools / Software{' '}
                  <span className="text-xs font-normal text-muted">(optional)</span>
                </FieldLabel>
                <textarea
                  {...register('tools')}
                  placeholder="e.g. Excel, Salesforce, QuickBooks, Jira..."
                  rows={2}
                  className={`resize-none ${fieldClass(false, false, false)}`}
                />
              </div>

              <ChipSelector
                control={control}
                name="jobType"
                options={WORK_SHIFTS}
                label="Work Shift"
                error={errors.jobType?.message}
              />

              <div>
                <FieldLabel>Working Hours</FieldLabel>
                <input
                  {...register('workingHours')}
                  placeholder="e.g. 9:00 AM – 5:00 PM"
                  className={fieldClass(!!touchedFields.workingHours, !!errors.workingHours, !!values.workingHours)}
                />
                <FieldError message={errors.workingHours?.message} />
              </div>

              <ChipSelector
                control={control}
                name="timezone"
                options={TIMEZONES}
                label="Time Zone"
                error={errors.timezone?.message}
              />

              <div>
                <FieldLabel>Role Reports To</FieldLabel>
                <textarea
                  {...register('reportsTo')}
                  placeholder="Name, position and contact info of the direct manager..."
                  rows={2}
                  className={`resize-none ${fieldClass(!!touchedFields.reportsTo, !!errors.reportsTo, !!values.reportsTo)}`}
                />
                <FieldError message={errors.reportsTo?.message} />
              </div>

              <MultiChipSelector
                control={control}
                name="languages"
                options={LANGUAGES}
                label="Languages Needed"
                error={errors.languages?.message}
              />

              <ChipSelector
                control={control}
                name="seniority"
                options={SENIORITY_LEVELS}
                label="Candidate Seniority"
                error={errors.seniority?.message}
              />

              <div className="flex items-start gap-3 rounded-lg border border-divider bg-content1 p-3">
                <input
                  {...register('requiresProficiencyTest')}
                  id="proficiency-test"
                  type="checkbox"
                  className="mt-0.5 size-4 accent-primary"
                />
                <label htmlFor="proficiency-test" className="cursor-pointer text-sm text-foreground">
                  Require candidates to complete a proficiency test to confirm their skills
                </label>
              </div>

              <div>
                <FieldLabel>
                  Interview Questions{' '}
                  <span className="text-xs font-normal text-muted">(optional)</span>
                </FieldLabel>
                <textarea
                  {...register('interviewQuestions')}
                  placeholder="List 3–5 specific questions related to the role and tools..."
                  rows={3}
                  className={`resize-none ${fieldClass(false, false, false)}`}
                />
              </div>

              <div>
                <FieldLabel>
                  Testing Requirements{' '}
                  <span className="text-xs font-normal text-muted">(optional)</span>
                </FieldLabel>
                <textarea
                  {...register('testingRequirements')}
                  placeholder="Specific testing methods if a proficiency test is required..."
                  rows={2}
                  className={`resize-none ${fieldClass(false, false, false)}`}
                />
              </div>

              <div>
                <FieldLabel>
                  Additional Notes{' '}
                  <span className="text-xs font-normal text-muted">(optional)</span>
                </FieldLabel>
                <textarea
                  {...register('notes')}
                  placeholder="Anything else we should take into consideration for the search..."
                  rows={2}
                  className={`resize-none ${fieldClass(false, false, false)}`}
                />
              </div>
            </form>
          </Modal.Body>

          <Modal.Footer>
            <Button variant="secondary" onPress={handleClose}>
              Cancel
            </Button>
            <Button
              color="primary"
              type="submit"
              form="hero-request-form"
              isLoading={isSubmitting}
            >
              Send Request
            </Button>
          </Modal.Footer>
        </Modal.Dialog>
      </Modal.Container>
    </Modal.Backdrop>
  )
}
