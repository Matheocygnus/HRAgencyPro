import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useQuery } from '@tanstack/react-query'
import { Modal, Button, Label, TextField } from '@heroui/react'
import { heroesApi } from '../../../api/heroes.api'
import { clientsApi } from '../../../api/clients.api'
import { companiesApi } from '../../../api/companies.api'
import type { Contract } from '../../../types/contract.types'

const schema = z.object({
  heroId: z.coerce.number().min(1, 'Hero is required'),
  clientId: z.coerce.number().min(1, 'Client is required'),
  companyId: z.coerce.number().min(1, 'Company is required'),
  title: z.string().min(1, 'Title is required'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().optional(),
  compensation: z.coerce.number().min(0, 'Compensation is required'),
  status: z.enum(['draft', 'signed', 'active', 'completed', 'terminated']),
  lengthMonths: z.coerce.number().optional(),
})

type FormValues = z.infer<typeof schema>

interface ContractFormDialogProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: Partial<Contract>) => void
  defaultValues?: Partial<Contract>
  title?: string
}

export function ContractFormDialog({
  open,
  onClose,
  onSubmit,
  defaultValues,
  title = 'Add Contract',
}: ContractFormDialogProps) {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, dirtyFields },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      heroId: defaultValues?.heroId ?? 0,
      clientId: defaultValues?.clientId ?? 0,
      companyId: defaultValues?.companyId ?? 0,
      title: defaultValues?.title ?? '',
      startDate: defaultValues?.startDate ?? '',
      endDate: defaultValues?.endDate ?? '',
      compensation: defaultValues?.compensation ?? 0,
      status: defaultValues?.status ?? 'draft',
      lengthMonths: defaultValues?.lengthMonths ?? undefined,
    },
  })

  const ok = (n: keyof FormValues) => !!dirtyFields[n] && !errors[n]
  const cls = (n: keyof FormValues) => `input w-full${ok(n) ? ' input-valid' : ''}`

  const selectedClientId = watch('clientId')

  const { data: heroes = [] } = useQuery({
    queryKey: ['heroes'],
    queryFn: () => heroesApi.list(),
    enabled: open,
  })

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
    if (open) {
      reset({
        heroId: defaultValues?.heroId ?? 0,
        clientId: defaultValues?.clientId ?? 0,
        companyId: defaultValues?.companyId ?? 0,
        title: defaultValues?.title ?? '',
        startDate: defaultValues?.startDate ?? '',
        endDate: defaultValues?.endDate ?? '',
        compensation: defaultValues?.compensation ?? 0,
        status: defaultValues?.status ?? 'draft',
        lengthMonths: defaultValues?.lengthMonths ?? undefined,
      })
    }
  }, [open])

  function handleFormSubmit(data: FormValues) {
    const payload = { ...data }
    if (!payload.endDate) delete payload.endDate
    onSubmit(payload as Partial<Contract>)
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
          className="sm:max-w-lg"
          data-testid="contract-form-dialog"
        >
          <Modal.Header>
            <Modal.Heading>{title}</Modal.Heading>
          </Modal.Header>
          <Modal.Body className="overflow-y-auto max-h-[60vh]">
            <form
              id="contract-form"
              onSubmit={handleSubmit(handleFormSubmit)}
              className="flex flex-col gap-4"
            >
              <TextField isInvalid={!!errors.title}>
                <Label className="field-required">Title</Label>
                <input {...register('title')} className={cls('title')} placeholder="Contract title" />
                {errors.title && (
                  <p className="text-xs text-danger mt-1">{errors.title.message}</p>
                )}
              </TextField>

              <TextField isInvalid={!!errors.heroId}>
                <Label className="field-required">Hero</Label>
                <select {...register('heroId')} className={cls('heroId')}>
                  <option value="">Select hero...</option>
                  {heroes.map((h: any) => (
                    <option key={h.id} value={h.id}>
                      #{h.id} — {h.prospect?.firstName} {h.prospect?.lastName}
                    </option>
                  ))}
                </select>
                {errors.heroId && (
                  <p className="text-xs text-danger mt-1">{errors.heroId.message}</p>
                )}
              </TextField>

              <TextField isInvalid={!!errors.clientId}>
                <Label className="field-required">Client</Label>
                <select {...register('clientId')} className={cls('clientId')}>
                  <option value="">Select client...</option>
                  {clients.map((c: any) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
                {errors.clientId && (
                  <p className="text-xs text-danger mt-1">{errors.clientId.message}</p>
                )}
              </TextField>

              <TextField isInvalid={!!errors.companyId}>
                <Label className="field-required">Company</Label>
                <select {...register('companyId')} className={cls('companyId')}>
                  <option value="">Select company...</option>
                  {companies.map((c: any) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
                {errors.companyId && (
                  <p className="text-xs text-danger mt-1">{errors.companyId.message}</p>
                )}
              </TextField>

              <TextField isInvalid={!!errors.compensation}>
                <Label className="field-required">Compensation (monthly USD)</Label>
                <input {...register('compensation')} type="number" step="0.01" className={cls('compensation')} placeholder="5000" />
                {errors.compensation && (
                  <p className="text-xs text-danger mt-1">{errors.compensation.message}</p>
                )}
              </TextField>

              <TextField>
                <Label>Status</Label>
                <select {...register('status')} className={cls('status')}>
                  {(['draft', 'signed', 'active', 'completed', 'terminated'] as const).map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </TextField>

              <TextField isInvalid={!!errors.startDate}>
                <Label className="field-required">Start Date</Label>
                <input {...register('startDate')} type="date" className={cls('startDate')} />
                {errors.startDate && (
                  <p className="text-xs text-danger mt-1">{errors.startDate.message}</p>
                )}
              </TextField>

              <TextField>
                <Label>End Date (optional)</Label>
                <input {...register('endDate')} type="date" className={cls('endDate')} />
              </TextField>

              <TextField>
                <Label>Length (months, optional)</Label>
                <input {...register('lengthMonths')} type="number" className={cls('lengthMonths')} />
              </TextField>
            </form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" slot="close">Cancel</Button>
            <Button color="accent" type="submit" form="contract-form">Save</Button>
          </Modal.Footer>
        </Modal.Dialog>
      </Modal.Container>
    </Modal.Backdrop>
  )
}
