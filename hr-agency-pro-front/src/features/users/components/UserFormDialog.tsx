import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Modal, Button, Label, TextField } from '@heroui/react'
import type { UserRecord } from '../../../types/user.types'
import type { Role } from '../../../types/role.types'

const schema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  username: z.string().min(1, 'Username is required'),
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  roleId: z.coerce.number().min(1, 'Role is required'),
})

type FormValues = z.infer<typeof schema>

interface UserFormDialogProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: Partial<UserRecord>) => void
  defaultValues?: Partial<UserRecord>
  roles: Role[]
  title?: string
}

export function UserFormDialog({
  open,
  onClose,
  onSubmit,
  defaultValues,
  roles,
  title = 'Add User',
}: UserFormDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      firstName: defaultValues?.firstName ?? '',
      lastName: defaultValues?.lastName ?? '',
      username: defaultValues?.username ?? '',
      email: defaultValues?.email ?? '',
      password: '',
      roleId: (defaultValues as any)?.roleId ?? 0,
    },
  })

  useEffect(() => {
    if (open) {
      reset({
        firstName: defaultValues?.firstName ?? '',
        lastName: defaultValues?.lastName ?? '',
        username: defaultValues?.username ?? '',
        email: defaultValues?.email ?? '',
        password: '',
        roleId: (defaultValues as any)?.roleId ?? 0,
      })
    }
  }, [open])

  function handleFormSubmit(data: FormValues) {
    onSubmit(data)
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
          className="sm:max-w-md"
          data-testid="user-form-dialog"
        >
          <Modal.Header>
            <Modal.Heading>{title}</Modal.Heading>
          </Modal.Header>
          <Modal.Body>
            <form
              id="user-form"
              onSubmit={handleSubmit(handleFormSubmit)}
              className="flex flex-col gap-4"
            >
              <TextField isInvalid={!!errors.firstName}>
                <Label>First Name</Label>
                <input {...register('firstName')} className="input w-full" />
                {errors.firstName && (
                  <p className="text-xs text-danger mt-1">{errors.firstName.message}</p>
                )}
              </TextField>
              <TextField isInvalid={!!errors.lastName}>
                <Label>Last Name</Label>
                <input {...register('lastName')} className="input w-full" />
                {errors.lastName && (
                  <p className="text-xs text-danger mt-1">{errors.lastName.message}</p>
                )}
              </TextField>
              <TextField isInvalid={!!errors.username}>
                <Label>Username</Label>
                <input {...register('username')} className="input w-full" />
                {errors.username && (
                  <p className="text-xs text-danger mt-1">{errors.username.message}</p>
                )}
              </TextField>
              <TextField isInvalid={!!errors.email}>
                <Label>Email</Label>
                <input {...register('email')} type="email" className="input w-full" />
                {errors.email && (
                  <p className="text-xs text-danger mt-1">{errors.email.message}</p>
                )}
              </TextField>
              <TextField isInvalid={!!errors.password}>
                <Label>Password</Label>
                <input {...register('password')} type="password" className="input w-full" />
                {errors.password && (
                  <p className="text-xs text-danger mt-1">{errors.password.message}</p>
                )}
              </TextField>
              <TextField isInvalid={!!errors.roleId}>
                <Label>Role</Label>
                <select {...register('roleId')} className="input w-full">
                  <option value="">Select role...</option>
                  {roles.map(role => (
                    <option key={role.id} value={role.id}>{role.name}</option>
                  ))}
                </select>
                {errors.roleId && (
                  <p className="text-xs text-danger mt-1">{errors.roleId.message}</p>
                )}
              </TextField>
            </form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" slot="close">Cancel</Button>
            <Button color="accent" type="submit" form="user-form">Save</Button>
          </Modal.Footer>
        </Modal.Dialog>
      </Modal.Container>
    </Modal.Backdrop>
  )
}
