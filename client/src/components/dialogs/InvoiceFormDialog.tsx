import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import InvoiceForm from '@/components/forms/InvoiceForm';

interface InvoiceFormDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  invoiceId?: number;
  onSuccess?: () => void;
  title?: string;
  description?: string;
}

export default function InvoiceFormDialog({
  isOpen,
  onOpenChange,
  invoiceId,
  onSuccess,
  title = invoiceId ? 'Edit Invoice' : 'Create New Invoice',
  description = invoiceId 
    ? 'Update invoice information in the form below.'
    : 'Fill out the form below to create a new invoice.',
}: InvoiceFormDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <InvoiceForm 
          invoiceId={invoiceId}
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