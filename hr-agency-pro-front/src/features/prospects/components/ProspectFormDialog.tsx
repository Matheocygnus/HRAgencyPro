import { useEffect } from 'react'
import { useForm, Controller, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useQuery } from '@tanstack/react-query'
import { Modal, Button, Label, TextField } from '@heroui/react'
import { clientsApi } from '../../../api/clients.api'
import { SearchableSelect } from '../../../components/SearchableSelect'
import type { Prospect } from '../../../types/prospect.types'

const schema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email'),
  phone: z.string().regex(/^[0-9+\-\s\(\)]*$/, 'Only numbers and phone characters allowed').optional(),
  position: z.string().optional(),
  clientId: z.coerce.number().optional(),
  status: z.enum([
    'sourcing',
    'contacted',
    'interview',
    'client_review',
    'budget',
    'contract',
    'rejected',
  ]),
  rejectionReason: z.string().optional(),
})

type FormValues = z.infer<typeof schema>

interface ProspectFormDialogProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: Partial<Prospect>) => void
  defaultValues?: Partial<Prospect>
  title?: string
}

export function ProspectFormDialog({ open, onClose, onSubmit, defaultValues, title = 'Add Prospect' }: ProspectFormDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    formState: { errors, dirtyFields },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues ? { status: 'sourcing', rejectionReason: '', ...defaultValues } as FormValues : { status: 'sourcing', rejectionReason: '' },
  })

  const selectedStatus = useWatch({ control, name: 'status' })

  const ok = (n: keyof FormValues) => !!dirtyFields[n] && !errors[n]
  const cls = (n: keyof FormValues) => `input w-full${ok(n) ? ' input-valid' : ''}`

  const { data: clients = [] } = useQuery({
    queryKey: ['clients'],
    queryFn: () => clientsApi.list(),
    enabled: open,
  })

  useEffect(() => {
    if (open) {
      reset(defaultValues ? { status: 'sourcing', rejectionReason: '', ...defaultValues } as FormValues : { status: 'sourcing', rejectionReason: '' })
    }
  }, [open])

  useEffect(() => {
    if (selectedStatus !== 'rejected') setValue('rejectionReason', '')
  }, [selectedStatus, setValue])

  function handleFormSubmit(data: FormValues) {
    onSubmit(data as Partial<Prospect>)
    reset()
    onClose()
  }

  return (
    <Modal.Backdrop isOpen={open} onOpenChange={(isOpen) => { if (!isOpen) onClose() }}>
      <Modal.Container>
        <Modal.Dialog className="sm:max-w-md">
          <Modal.Header>
            <Modal.Heading>{title}</Modal.Heading>
          </Modal.Header>
          <Modal.Body className="overflow-y-auto max-h-[60vh]">
            <form
              id="prospect-form"
              onSubmit={handleSubmit(handleFormSubmit)}
              className="flex flex-col gap-4"
            >
              <TextField isInvalid={!!errors.firstName}>
                <Label className="field-required">First Name</Label>
                <input {...register('firstName')} className={cls('firstName')} placeholder="First name" />
                {errors.firstName && (
                  <p className="text-xs text-danger mt-1">{errors.firstName.message}</p>
                )}
              </TextField>

              <TextField isInvalid={!!errors.lastName}>
                <Label className="field-required">Last Name</Label>
                <input {...register('lastName')} className={cls('lastName')} placeholder="Last name" />
                {errors.lastName && (
                  <p className="text-xs text-danger mt-1">{errors.lastName.message}</p>
                )}
              </TextField>

              <TextField isInvalid={!!errors.email}>
                <Label className="field-required">Email</Label>
                <input {...register('email')} type="email" className={cls('email')} placeholder="email@example.com" />
                {errors.email && (
                  <p className="text-xs text-danger mt-1">{errors.email.message}</p>
                )}
              </TextField>

              <TextField isInvalid={!!errors.phone}>
                <Label>Phone</Label>
                <input
                  {...register('phone')}
                  type="tel"
                  className={cls('phone')}
                  placeholder="+1 555 000 0000"
                  onInput={e => {
                    const el = e.target as HTMLInputElement
                    el.value = el.value.replace(/[^0-9+\-\s\(\)]/g, '')
                  }}
                />
                {errors.phone && (
                  <p className="text-xs text-danger mt-1">{errors.phone.message}</p>
                )}
              </TextField>

              <TextField>
                <Label>Position</Label>
                <input {...register('position')} className={cls('position')} placeholder="Desired position" />
              </TextField>

              <TextField>
                <Label>Client</Label>
                <Controller
                  control={control}
                  name="clientId"
                  render={({ field }) => (
                    <SearchableSelect
                      options={clients.map((c: any) => ({ value: c.id, label: c.name }))}
                      value={field.value || undefined}
                      onChange={v => field.onChange(v ?? undefined)}
                      placeholder="Assign to client (optional)..."
                      dropUp
                    />
                  )}
                />
              </TextField>

              <TextField>
                <Label>Status</Label>
                <select {...register('status')} className={cls('status')}>
                  <option value="sourcing">Sourcing</option>
                  <option value="contacted">Screening</option>
                  <option value="interview">Company Review</option>
                  <option value="client_review">Client Interview</option>
                  <option value="budget">Budget / Negotiation</option>
                  <option value="contract">Contract & Hire</option>
                  <option value="rejected">Rejected</option>
                </select>
              </TextField>

              {selectedStatus === 'rejected' && (
                <TextField>
                  <Label>Rejection Reason</Label>
                  <textarea
                    {...register('rejectionReason')}
                    rows={6}
                    className={`${cls('rejectionReason')} resize-none`}
                    placeholder="Explain why this prospect was rejected..."
                  />
                </TextField>
              )}
            </form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" slot="close">Cancel</Button>
            <Button color="accent" type="submit" form="prospect-form">Save</Button>
          </Modal.Footer>
        </Modal.Dialog>
      </Modal.Container>
    </Modal.Backdrop>
  )
}
