import type { Contract } from '../../../types/contract.types'
import { ContractFormDialog } from './ContractFormDialog'

interface QuickEditDialogProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: Partial<Contract>) => void
  contract: Contract
}

export function QuickEditDialog({ open, onClose, onSubmit, contract }: QuickEditDialogProps) {
  return (
    <ContractFormDialog
      open={open}
      onClose={onClose}
      onSubmit={onSubmit}
      defaultValues={contract}
      title="Edit Contract"
    />
  )
}
