import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useQuery } from '@tanstack/react-query'
import { Modal, Button, Label, TextField } from '@heroui/react'
import { contractsApi } from '../../../api/contracts.api'
import { heroesApi } from '../../../api/heroes.api'
import { clientsApi } from '../../../api/clients.api'
import { companiesApi } from '../../../api/companies.api'
import type { Invoice } from '../../../types/invoice.types'

const todayStr = new Date().toISOString().split('T')[0]

const schema = z.object({
  invoiceNumber: z.string().min(1, 'Invoice number is required'),
  contractId: z.coerce.number().optional(),
  heroId: z.coerce.number().min(1, 'Hero is required'),
  clientId: z.coerce.number().min(1, 'Client is required'),
  companyId: z.coerce.number().min(1, 'Company is required'),
  amount: z.coerce.number().min(0.01, 'Amount must be greater than 0'),
  status: z.enum(['pending', 'paid', 'overdue', 'cancelled']),
  dueDate: z.string().min(1, 'Due date is required'),
  paidDate: z.string().optional(),
})

type FormValues = z.infer<typeof schema>

interface InvoiceFormDialogProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: Partial<Invoice>) => void
  defaultValues?: Partial<Invoice>
  title?: string
}

export function InvoiceFormDialog({
  open,
  onClose,
  onSubmit,
  defaultValues,
  title = 'Add Invoice',
}: InvoiceFormDialogProps) {
  const isEdit = !!defaultValues?.id

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, dirtyFields },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      invoiceNumber: defaultValues?.invoiceNumber ?? '',
      contractId: defaultValues?.contractId ?? undefined,
      heroId: defaultValues?.heroId ?? 0,
      clientId: defaultValues?.clientId ?? 0,
      companyId: defaultValues?.companyId ?? 0,
      amount: defaultValues?.amount ?? 0,
      status: defaultValues?.status ?? 'pending',
      dueDate: defaultValues?.dueDate ?? '',
      paidDate: defaultValues?.paidDate ?? '',
    },
  })

  const selectedContractId = watch('contractId')

  const ok = (n: keyof FormValues) => !!dirtyFields[n] && !errors[n]
  const cls = (n: keyof FormValues) => `input w-full${ok(n) ? ' input-valid' : ''}`

  const { data: contracts = [] } = useQuery({
    queryKey: ['contracts'],
    queryFn: () => contractsApi.list(),
    enabled: open,
  })

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
    queryKey: ['companies'],
    queryFn: () => companiesApi.list(),
    enabled: open,
  })

  useEffect(() => {
    if (open) {
      reset({
        invoiceNumber: defaultValues?.invoiceNumber ?? '',
        contractId: defaultValues?.contractId ?? undefined,
        heroId: defaultValues?.heroId ?? 0,
        clientId: defaultValues?.clientId ?? 0,
        companyId: defaultValues?.companyId ?? 0,
        amount: defaultValues?.amount ?? 0,
        status: defaultValues?.status ?? 'pending',
        dueDate: defaultValues?.dueDate ?? '',
        paidDate: defaultValues?.paidDate ?? '',
      })
    }
  }, [open])

  useEffect(() => {
    if (!selectedContractId) return
    const contract = contracts.find((c: any) => c.id === Number(selectedContractId))
    if (!contract) return
    setValue('heroId', contract.heroId)
    setValue('clientId', contract.clientId)
    setValue('companyId', contract.companyId)
  }, [selectedContractId, contracts, setValue])

  function handleFormSubmit(data: FormValues) {
    const payload: Partial<Invoice> = { ...data }
    if (!payload.paidDate) delete payload.paidDate
    if (!payload.contractId) delete payload.contractId
    onSubmit(payload)
    reset()
    onClose()
  }

  return (
    <Modal.Backdrop isOpen={open} onOpenChange={(isOpen) => { if (!isOpen) onClose() }}>
      <Modal.Container>
        <Modal.Dialog className="sm:max-w-md" data-testid="invoice-form-dialog">
          <Modal.Header>
            <Modal.Heading>{title}</Modal.Heading>
          </Modal.Header>
          <Modal.Body className="overflow-y-auto max-h-[60vh]">
            <form id="invoice-form" onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col gap-4">
              <TextField isInvalid={!!errors.invoiceNumber}>
                <Label className="field-required">Invoice Number</Label>
                <input {...register('invoiceNumber')} className={cls('invoiceNumber')} placeholder="INV-2026-001" />
                {errors.invoiceNumber && <p className="text-xs text-danger mt-1">{errors.invoiceNumber.message}</p>}
              </TextField>

              <TextField>
                <Label>Contract (optional)</Label>
                <select {...register('contractId')} className={cls('contractId')}>
                  <option value="">Select contract...</option>
                  {contracts.map((c: any) => (
                    <option key={c.id} value={c.id}>#{c.id} — {c.title}</option>
                  ))}
                </select>
                {selectedContractId && (
                  <p className="text-xs text-muted mt-1">Hero, client and company are populated from the contract.</p>
                )}
              </TextField>

              <TextField isInvalid={!!errors.clientId}>
                <Label className="field-required">Client</Label>
                <select {...register('clientId')} className={cls('clientId')}>
                  <option value="">Select client...</option>
                  {clients.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
                {errors.clientId && <p className="text-xs text-danger mt-1">{errors.clientId.message}</p>}
              </TextField>

              <TextField isInvalid={!!errors.heroId}>
                <Label className="field-required">Hero</Label>
                <select {...register('heroId')} className={cls('heroId')}>
                  <option value="">Select hero...</option>
                  {heroes.map((h: any) => (
                    <option key={h.id} value={h.id}>#{h.id} — {h.firstName} {h.lastName}</option>
                  ))}
                </select>
                {errors.heroId && <p className="text-xs text-danger mt-1">{errors.heroId.message}</p>}
              </TextField>

              <TextField isInvalid={!!errors.companyId}>
                <Label className="field-required">Company</Label>
                <select {...register('companyId')} className={cls('companyId')}>
                  <option value="">Select company...</option>
                  {companies.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
                {errors.companyId && <p className="text-xs text-danger mt-1">{errors.companyId.message}</p>}
              </TextField>

              <TextField isInvalid={!!errors.amount}>
                <Label className="field-required">Amount (USD)</Label>
                <input {...register('amount')} type="number" step="0.01" min="0.01" className={cls('amount')} placeholder="1000.00" />
                {errors.amount && <p className="text-xs text-danger mt-1">{errors.amount.message}</p>}
              </TextField>

              <TextField>
                <Label>Status</Label>
                <select {...register('status')} className={cls('status')}>
                  {(['pending', 'paid', 'overdue', 'cancelled'] as const).map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </TextField>

              <TextField isInvalid={!!errors.dueDate}>
                <Label className="field-required">Due Date</Label>
                <input
                  {...register('dueDate')}
                  type="date"
                  min={!isEdit ? todayStr : undefined}
                  className={cls('dueDate')}
                />
                {errors.dueDate && <p className="text-xs text-danger mt-1">{errors.dueDate.message}</p>}
              </TextField>

              <TextField>
                <Label>Paid Date (optional)</Label>
                <input {...register('paidDate')} type="date" className={cls('paidDate')} />
              </TextField>
            </form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" slot="close">Cancel</Button>
            <Button color="accent" type="submit" form="invoice-form">Save</Button>
          </Modal.Footer>
        </Modal.Dialog>
      </Modal.Container>
    </Modal.Backdrop>
  )
}
