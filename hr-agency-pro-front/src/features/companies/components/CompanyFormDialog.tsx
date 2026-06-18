import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Modal, Button, Label, TextField } from '@heroui/react'
import type { Client } from '../../../types/client.types'
import type { Company } from '../../../types/company.types'

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  clientId: z.coerce.number().min(1, 'Client is required'),
})

type FormValues = z.infer<typeof schema>

interface CompanyFormDialogProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: Partial<Company>) => void
  clients: Client[]
  defaultValues?: Partial<Company>
  title?: string
}

export function CompanyFormDialog({ open, onClose, onSubmit, clients, defaultValues, title = 'Add Company' }: CompanyFormDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: defaultValues?.name ?? '',
      clientId: defaultValues?.clientId ?? 0,
    },
  })

  useEffect(() => {
    if (open) {
      reset({
        name: defaultValues?.name ?? '',
        clientId: defaultValues?.clientId ?? 0,
      })
    }
  }, [open])

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
            <Modal.Heading>{title}</Modal.Heading>
          </Modal.Header>
          <Modal.Body>
            <form
              id="company-form"
              onSubmit={handleSubmit(handleFormSubmit)}
              className="flex flex-col gap-4"
            >
              <TextField isInvalid={!!errors.name}>
                <Label>Name</Label>
                <input {...register('name')} className="input w-full" />
                {errors.name && (
                  <p className="text-xs text-danger mt-1">{errors.name.message}</p>
                )}
              </TextField>
              <TextField isInvalid={!!errors.clientId}>
                <Label>Client</Label>
                <select
                  {...register('clientId')}
                  className="input w-full"
                >
                  <option value="">Select client...</option>
                  {clients.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
                {errors.clientId && (
                  <p className="text-xs text-danger mt-1">{errors.clientId.message}</p>
                )}
              </TextField>
            </form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" slot="close">Cancel</Button>
            <Button color="accent" type="submit" form="company-form">Save</Button>
          </Modal.Footer>
        </Modal.Dialog>
      </Modal.Container>
    </Modal.Backdrop>
  )
}
