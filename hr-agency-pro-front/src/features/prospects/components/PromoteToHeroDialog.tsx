import { useState, useEffect } from 'react'
import { useForm, Controller, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useQuery } from '@tanstack/react-query'
import { Modal, Button, Label, TextField } from '@heroui/react'
import { CheckCircle } from 'lucide-react'
import { prospectsApi } from '../../../api/prospects.api'
import { clientsApi } from '../../../api/clients.api'
import { companiesApi } from '../../../api/companies.api'
import { SearchableSelect } from '../../../components/SearchableSelect'
import type { Prospect } from '../../../types/prospect.types'

const schema = z.object({
  clientId: z.coerce.number().min(1, 'Client is required'),
  companyId: z.coerce.number().min(1, 'Company is required'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().optional(),
  compensation: z.coerce.number().min(0, 'Enter the hero compensation'),
  companyPayment: z.coerce.number().min(0).optional(),
})

type FormValues = z.infer<typeof schema>

interface PromoteToHeroDialogProps {
  open: boolean
  prospect: Prospect | null
  onClose: () => void
  onSuccess: () => void
}

export function PromoteToHeroDialog({ open, prospect, onClose, onSuccess }: PromoteToHeroDialogProps) {
  const [done, setDone] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const today = new Date().toISOString().split('T')[0]

  const { register, handleSubmit, reset, control, setValue, getValues, formState: { errors, dirtyFields } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      clientId: 0,
      companyId: 0,
      startDate: today,
      compensation: 0,
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

  useEffect(() => {
    if (open && prospect) {
      reset({
        clientId: prospect.clientId ?? 0,
        companyId: prospect.companyId ?? 0,
        startDate: today,
        compensation: 0,
      })
    }
  }, [open, prospect?.id])

  const watchedClientId = useWatch({ control, name: 'clientId' })

  useEffect(() => {
    if (!watchedClientId || !companies.length) return
    if (getValues('companyId')) return
    const match = companies.find((c: any) => c.clientId === watchedClientId)
    if (match) setValue('companyId', match.id)
  }, [watchedClientId, companies])

  const ok = (n: keyof FormValues) => !!dirtyFields[n] && !errors[n]
  const cls = (n: keyof FormValues) => `input w-full${ok(n) ? ' input-valid' : ''}`

  async function onSubmit(data: FormValues) {
    if (!prospect) return
    setIsLoading(true)
    setError(null)
    try {
      await prospectsApi.update(prospect.id, {
        clientId: data.clientId,
        companyId: data.companyId,
      })
      await prospectsApi.promote(prospect.id, {
        startDate: data.startDate,
        endDate: data.endDate || undefined,
        compensation: data.compensation,
        companyPayment: data.companyPayment || data.compensation,
      })
      setDone(true)
      onSuccess()
    } catch (e: any) {
      setError(e?.response?.data?.message ?? 'Failed to promote prospect')
    } finally {
      setIsLoading(false)
    }
  }

  function handleClose() {
    if (!isLoading) {
      setDone(false)
      setError(null)
      reset({ clientId: 0, companyId: 0, startDate: today, compensation: 0 })
      onClose()
    }
  }

  return (
    <Modal.Backdrop isOpen={open} onOpenChange={(isOpen) => { if (!isOpen) handleClose() }}>
      <Modal.Container>
        <Modal.Dialog className="sm:max-w-md">
          <Modal.Header>
            <Modal.Heading>{done ? 'Hero Created!' : 'Promote to Hero'}</Modal.Heading>
            {prospect && !done && (
              <p className="mt-1 text-sm text-muted">
                {prospect.firstName} {prospect.lastName}
              </p>
            )}
          </Modal.Header>

          <Modal.Body>
            {error && (
              <div className="mb-4 rounded-lg bg-danger/10 p-3 text-sm text-danger">{error}</div>
            )}

            {!done ? (
              <form id="promote-form" onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                <p className="text-sm text-muted">
                  This will create a Hero record, a draft contract, and the first invoice — all in one step.
                </p>

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
                      />
                    )}
                  />
                  {errors.clientId && (
                    <p className="mt-1 text-xs text-danger">{errors.clientId.message}</p>
                  )}
                </TextField>

                <TextField isInvalid={!!errors.companyId}>
                  <Label className="field-required">Company</Label>
                  <select {...register('companyId')} className={cls('companyId')}>
                    <option value={0}>Select company...</option>
                    {companies.map((c: any) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                  {errors.companyId && (
                    <p className="mt-1 text-xs text-danger">{errors.companyId.message}</p>
                  )}
                </TextField>

                <TextField isInvalid={!!errors.startDate}>
                  <Label className="field-required">Start Date</Label>
                  <input {...register('startDate')} type="date" className={cls('startDate')} />
                  {errors.startDate && (
                    <p className="mt-1 text-xs text-danger">{errors.startDate.message}</p>
                  )}
                </TextField>

                <TextField>
                  <Label>End Date (optional)</Label>
                  <input {...register('endDate')} type="date" className={cls('endDate')} />
                </TextField>

                <TextField isInvalid={!!errors.compensation}>
                  <Label className="field-required">Hero Compensation / month (USD)</Label>
                  <input {...register('compensation')} type="number" min="0" step="0.01" className={cls('compensation')} placeholder="0.00" />
                  {errors.compensation && (
                    <p className="mt-1 text-xs text-danger">{errors.compensation.message}</p>
                  )}
                </TextField>

                <TextField>
                  <Label>Client Billing / month (USD) — leave empty to match compensation</Label>
                  <input {...register('companyPayment')} type="number" min="0" step="0.01" className={cls('companyPayment')} placeholder="0.00" />
                </TextField>
              </form>
            ) : (
              <div className="flex flex-col items-center gap-3 py-4 text-center">
                <CheckCircle className="size-12 text-success" />
                <p className="font-semibold text-foreground">
                  {prospect?.firstName} {prospect?.lastName} is now a Hero!
                </p>
                <p className="text-sm text-muted">
                  Hero record, draft contract, and first invoice created successfully.
                </p>
              </div>
            )}
          </Modal.Body>

          <Modal.Footer>
            {!done ? (
              <>
                <Button variant="secondary" onPress={handleClose} isDisabled={isLoading}>
                  Cancel
                </Button>
                <Button color="primary" type="submit" form="promote-form" isLoading={isLoading}>
                  Promote to Hero
                </Button>
              </>
            ) : (
              <Button color="primary" onPress={handleClose}>
                Close
              </Button>
            )}
          </Modal.Footer>
        </Modal.Dialog>
      </Modal.Container>
    </Modal.Backdrop>
  )
}
