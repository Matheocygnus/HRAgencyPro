import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Modal, Button, Label, TextField } from '@heroui/react'
import type { Client } from '../../../types/client.types'

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  contactPerson: z.string().min(1, 'Contact person is required'),
  email: z.string().email('Invalid email'),
  phone: z.string().optional(),
})

type FormValues = z.infer<typeof schema>

interface ClientFormDialogProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: Partial<Client>) => void
  defaultValues?: Partial<Client>
  title?: string
}

export function ClientFormDialog({ open, onClose, onSubmit, defaultValues, title = 'Add Client' }: ClientFormDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: defaultValues?.name ?? '',
      contactPerson: defaultValues?.contactPerson ?? '',
      email: defaultValues?.email ?? '',
      phone: defaultValues?.phone ?? '',
    },
  })

  useEffect(() => {
    if (open) {
      reset({
        name: defaultValues?.name ?? '',
        contactPerson: defaultValues?.contactPerson ?? '',
        email: defaultValues?.email ?? '',
        phone: defaultValues?.phone ?? '',
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
              id="client-form"
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
              <TextField isInvalid={!!errors.contactPerson}>
                <Label>Contact Person</Label>
                <input {...register('contactPerson')} className="input w-full" />
                {errors.contactPerson && (
                  <p className="text-xs text-danger mt-1">{errors.contactPerson.message}</p>
                )}
              </TextField>
              <TextField isInvalid={!!errors.email}>
                <Label>Email</Label>
                <input {...register('email')} type="email" className="input w-full" />
                {errors.email && (
                  <p className="text-xs text-danger mt-1">{errors.email.message}</p>
                )}
              </TextField>
              <TextField>
                <Label>Phone</Label>
                <input {...register('phone')} type="tel" className="input w-full" />
              </TextField>
            </form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" slot="close">Cancel</Button>
            <Button color="accent" type="submit" form="client-form">Save</Button>
          </Modal.Footer>
        </Modal.Dialog>
      </Modal.Container>
    </Modal.Backdrop>
  )
}
