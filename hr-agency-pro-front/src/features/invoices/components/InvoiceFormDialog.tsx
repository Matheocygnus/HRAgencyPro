import { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useQuery } from '@tanstack/react-query'
import { Modal, Button, Label, TextField } from '@heroui/react'
import { contractsApi } from '../../../api/contracts.api'
import { heroesApi } from '../../../api/heroes.api'
import { clientsApi } from '../../../api/clients.api'
import { companiesApi } from '../../../api/companies.api'
import { invoicesApi } from '../../../api/invoices.api'
import { SearchableSelect } from '../../../components/SearchableSelect'
import type { Invoice } from '../../../types/invoice.types'

const todayStr = new Date().toISOString().split('T')[0]

const schema = z.object({
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
    control,
    formState: { errors, dirtyFields },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
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
  const isLocked = !!selectedContractId

  const ok = (n: keyof FormValues) => !!dirtyFields[n] && !errors[n]
  const cls = (n: keyof FormValues) => `input w-full${ok(n) ? ' input-valid' : ''}`

  const { data: nextNumberData, isLoading: isLoadingNumber } = useQuery({
    queryKey: ['invoices', 'next-number'],
    queryFn: () => invoicesApi.nextNumber(),
    enabled: open && !isEdit,
    staleTime: 0,
  })

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
    if (contract.compensation) setValue('amount', contract.compensation)
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
        <Modal.Dialog className="sm:max-w-md" data-testid="invoice-form-dialog" aria-label={title}>
          <Modal.Header>
            <Modal.Heading>{title}</Modal.Heading>
          </Modal.Header>
          <Modal.Body className="overflow-y-auto max-h-[60vh]">
            <form id="invoice-form" onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col gap-4">

              <TextField>
                <Label>Invoice Number</Label>
                {isEdit ? (
                  <input
                    value={defaultValues?.invoiceNumber ?? ''}
                    readOnly
                    className="input w-full opacity-60 cursor-not-allowed"
                  />
                ) : (
                  <div className="input w-full flex items-center justify-between">
                    <span className={`font-mono text-sm ${isLoadingNumber ? 'text-muted' : 'text-foreground'}`}>
                      {isLoadingNumber ? 'Calculating...' : (nextNumberData?.invoiceNumber ?? '—')}
                    </span>
                    <span className="text-xs text-muted ml-3 shrink-0">Auto-assigned</span>
                  </div>
                )}
                <p className="text-xs text-muted mt-1">
                  {isEdit ? 'Invoice number cannot be changed.' : 'Assigned automatically on save.'}
                </p>
              </TextField>

              <TextField>
                <Label>Contract (optional)</Label>
                <select {...register('contractId')} className={cls('contractId')}>
                  <option value="">Select contract...</option>
                  {contracts.map((c: any) => (
                    <option key={c.id} value={c.id}>#{c.id} — {c.title}</option>
                  ))}
                </select>
                {isLocked && (
                  <p className="text-xs text-muted mt-1">Client, hero and company are locked to this contract.</p>
                )}
              </TextField>

              <TextField isInvalid={!!errors.clientId}>
                <Label className="field-required">Client</Label>
                <Controller
                  control={control}
                  name="clientId"
                  render={({ field }) => (
                    <SearchableSelect
                      options={clients.map((c: any) => ({ value: c.id, label: c.name }))}
                      value={field.value || undefined}
                      onChange={v => field.onChange(v ?? 0)}
                      placeholder="Search client..."
                      isInvalid={!!errors.clientId}
                      disabled={isLocked}
                    />
                  )}
                />
                {errors.clientId && <p className="text-xs text-danger mt-1">{errors.clientId.message}</p>}
              </TextField>

              <TextField isInvalid={!!errors.heroId}>
                <Label className="field-required">Hero</Label>
                <Controller
                  control={control}
                  name="heroId"
                  render={({ field }) => (
                    <SearchableSelect
                      options={heroes.map((h: any) => ({
                        value: h.id,
                        label: `#${h.id} — ${h.firstName ?? ''} ${h.lastName ?? ''}`.trim(),
                      }))}
                      value={field.value || undefined}
                      onChange={v => field.onChange(v ?? 0)}
                      placeholder="Search hero..."
                      isInvalid={!!errors.heroId}
                      disabled={isLocked}
                    />
                  )}
                />
                {errors.heroId && <p className="text-xs text-danger mt-1">{errors.heroId.message}</p>}
              </TextField>

              <TextField isInvalid={!!errors.companyId}>
                <Label className="field-required">Company</Label>
                <select
                  {...register('companyId')}
                  disabled={isLocked}
                  className={`${cls('companyId')}${isLocked ? ' opacity-60 cursor-not-allowed' : ''}`}
                >
                  <option value="">Select company...</option>
                  {companies.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
                {errors.companyId && <p className="text-xs text-danger mt-1">{errors.companyId.message}</p>}
              </TextField>

              <TextField isInvalid={!!errors.amount}>
                <Label className="field-required">Amount (USD)</Label>
                <input {...register('amount')} type="number" step="0.01" min="0.01" className={cls('amount')} placeholder="1000.00" />
                {isLocked && <p className="text-xs text-muted mt-1">Pre-filled from contract compensation. Editable for adjustments.</p>}
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
