import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Modal, Button, Label, TextField } from '@heroui/react'
import type { Role } from '../../../types/role.types'

const ALL_PERMISSIONS = [
  'prospects',
  'heroes',
  'contracts',
  'invoices',
  'interviews',
  'companies',
  'job_management',
  'user_management',
  'role_management',
  'settings',
  'client_dashboard',
  'hero_dashboard',
  'prospect_dashboard',
  'dashboard',
] as const

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  permissions: z.array(z.string()),
})

type FormValues = z.infer<typeof schema>

interface RoleFormDialogProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: Partial<Role>) => void
  defaultValues?: Partial<Role>
  title?: string
}

export function RoleFormDialog({
  open,
  onClose,
  onSubmit,
  defaultValues,
  title = 'Add Role',
}: RoleFormDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: defaultValues?.name ?? '',
      permissions: defaultValues?.permissions ?? [],
    },
  })

  useEffect(() => {
    reset({
      name: defaultValues?.name ?? '',
      permissions: defaultValues?.permissions ?? [],
    })
  }, [defaultValues, reset])

  const selectedPermissions = watch('permissions') ?? []

  function togglePermission(perm: string) {
    if (selectedPermissions.includes(perm)) {
      setValue('permissions', selectedPermissions.filter(p => p !== perm))
    } else {
      setValue('permissions', [...selectedPermissions, perm])
    }
  }

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
          className="sm:max-w-lg"
          data-testid="role-form-dialog"
        >
          <Modal.Header>
            <Modal.Heading>{title}</Modal.Heading>
          </Modal.Header>
          <Modal.Body className="overflow-y-auto max-h-[70vh]">
            <form
              id="role-form"
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

              <div>
                <p className="text-sm font-medium mb-2">Permissions</p>
                <div className="grid grid-cols-2 gap-2">
                  {ALL_PERMISSIONS.map(perm => (
                    <label key={perm} className="flex items-center gap-2 text-sm cursor-pointer">
                      <input
                        type="checkbox"
                        value={perm}
                        aria-label={perm}
                        checked={selectedPermissions.includes(perm)}
                        onChange={() => togglePermission(perm)}
                        className="rounded"
                      />
                      {perm}
                    </label>
                  ))}
                </div>
              </div>
            </form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" slot="close">Cancel</Button>
            <Button color="accent" type="submit" form="role-form">Save</Button>
          </Modal.Footer>
        </Modal.Dialog>
      </Modal.Container>
    </Modal.Backdrop>
  )
}
