import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import CompanyForm from '@/components/forms/CompanyForm';

interface CompanyFormDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  companyId?: number;
  onSuccess?: () => void;
  title?: string;
  description?: string;
}

export default function CompanyFormDialog({
  isOpen,
  onOpenChange,
  companyId,
  onSuccess,
  title = companyId ? 'Edit Company' : 'Add New Company',
  description = companyId 
    ? 'Update company information in the form below.'
    : 'Fill out the form below to add a new company.',
}: CompanyFormDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <CompanyForm 
          companyId={companyId}
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