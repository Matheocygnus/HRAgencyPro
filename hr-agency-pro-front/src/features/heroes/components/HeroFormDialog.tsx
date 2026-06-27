import { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useQuery } from '@tanstack/react-query'
import { Modal, Button, Label, TextField } from '@heroui/react'
import { prospectsApi } from '../../../api/prospects.api'
import { clientsApi } from '../../../api/clients.api'
import { companiesApi } from '../../../api/companies.api'
import { SearchableSelect } from '../../../components/SearchableSelect'

function buildSchema(isEditing: boolean) {
  return z.object({
    prospectId: isEditing
      ? z.coerce.number().optional()
      : z.coerce.number().min(1, 'Prospect is required'),
    clientId: z.coerce.number().min(1, 'Client is required'),
    companyId: z.coerce.number().min(1, 'Company is required'),
    startDate: z.string().optional(),
  })
}

type FormValues = {
  prospectId?: number
  clientId: number
  companyId: number
  startDate?: string
}

interface HeroFormDialogProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: Partial<FormValues>) => void
  defaultValues?: { clientId?: number; companyId?: number; startDate?: string }
  isEditing?: boolean
  title?: string
}

export function HeroFormDialog({ open, onClose, onSubmit, defaultValues, isEditing = false, title }: HeroFormDialogProps) {
  const resolvedTitle = title ?? (isEditing ? 'Edit Hero' : 'Add Hero')

  const schema = buildSchema(isEditing)

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    control,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues as FormValues | undefined,
  })

  const selectedClientId = watch('clientId')

  const { data: prospects = [] } = useQuery({
    queryKey: ['prospects'],
    queryFn: () => prospectsApi.list(),
    enabled: open && !isEditing,
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
        clientId: defaultValues?.clientId ?? ('' as any),
        companyId: defaultValues?.companyId ?? ('' as any),
        startDate: defaultValues?.startDate ?? '',
      })
    } else {
      reset()
    }
    // defaultValues intentionally excluded — open is the trigger
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, reset])

  // Re-apply after async queries load (uncontrolled selects can't match options before they exist)
  useEffect(() => {
    if (open && isEditing && clients.length > 0 && defaultValues?.clientId != null) {
      setValue('clientId', defaultValues.clientId)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clients, open, isEditing, setValue])

  useEffect(() => {
    if (open && isEditing && companies.length > 0 && defaultValues?.companyId != null) {
      setValue('companyId', defaultValues.companyId)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [companies, open, isEditing, setValue])

  function handleFormSubmit(data: FormValues) {
    const payload: Partial<FormValues> = {
      clientId: data.clientId,
      companyId: data.companyId,
    }
    if (!isEditing) payload.prospectId = data.prospectId
    if (data.startDate) payload.startDate = data.startDate
    onSubmit(payload)
    reset()
    onClose()
  }

  return (
    <Modal.Backdrop isOpen={open} onOpenChange={(isOpen) => { if (!isOpen) onClose() }}>
      <Modal.Container>
        <Modal.Dialog className="sm:max-w-md" aria-label={resolvedTitle}>
          <Modal.Header>
            <Modal.Heading>{resolvedTitle}</Modal.Heading>
          </Modal.Header>
          <Modal.Body>
            <form
              id="hero-form"
              onSubmit={handleSubmit(handleFormSubmit)}
              className="flex flex-col gap-4"
            >
              {!isEditing && (
                <TextField isInvalid={!!errors.prospectId}>
                  <Label>Prospect</Label>
                  <select {...register('prospectId')} className="input w-full">
                    <option value="">Select prospect...</option>
                    {prospects.map((p: any) => (
                      <option key={p.id} value={p.id}>
                        {p.firstName} {p.lastName} — {p.email}
                      </option>
                    ))}
                  </select>
                  {errors.prospectId && (
                    <p className="text-xs text-danger mt-1">{errors.prospectId.message}</p>
                  )}
                </TextField>
              )}

              <TextField isInvalid={!!errors.clientId}>
                <Label>Client</Label>
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
                  <p className="text-xs text-danger mt-1">{errors.clientId.message}</p>
                )}
              </TextField>

              <TextField isInvalid={!!errors.companyId}>
                <Label>Company</Label>
                <select {...register('companyId')} className="input w-full">
                  <option value="">Select company...</option>
                  {companies.map((c: any) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
                {errors.companyId && (
                  <p className="text-xs text-danger mt-1">{errors.companyId.message}</p>
                )}
              </TextField>

              <TextField>
                <Label>Start Date (optional)</Label>
                <input {...register('startDate')} type="date" className="input w-full" />
              </TextField>
            </form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" slot="close">Cancel</Button>
            <Button color="accent" type="submit" form="hero-form">Save</Button>
          </Modal.Footer>
        </Modal.Dialog>
      </Modal.Container>
    </Modal.Backdrop>
  )
}
