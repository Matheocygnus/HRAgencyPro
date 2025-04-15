import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import ContractForm from '@/components/forms/ContractForm';

interface ContractFormDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  contractId?: number;
  onSuccess?: () => void;
  title?: string;
  description?: string;
}

export default function ContractFormDialog({
  isOpen,
  onOpenChange,
  contractId,
  onSuccess,
  title = contractId ? 'Edit Contract' : 'Create New Contract',
  description = contractId 
    ? 'Update contract information in the form below.'
    : 'Fill out the form below to create a new contract.',
}: ContractFormDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <ContractForm 
          contractId={contractId}
          onSuccess={() => {
            if (onSuccess) onSuccess();
            onOpenChange(false);
          }}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}