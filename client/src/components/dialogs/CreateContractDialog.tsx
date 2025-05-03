import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import CreateContractForm from "../forms/CreateContractForm";

type CreateContractDialogProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  hero: {
    id: number;
    name: string;
    clientId: number;
    companyId: number;
    position?: string;
  };
};

export default function CreateContractDialog({
  isOpen,
  onOpenChange,
  hero,
}: CreateContractDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Contract for {hero.name}</DialogTitle>
          <DialogDescription>
            Add contract details for this hero. The contract will be created as a draft and can be finalized later.
          </DialogDescription>
        </DialogHeader>
        <CreateContractForm 
          hero={hero} 
          onSuccess={() => onOpenChange(false)} 
        />
      </DialogContent>
    </Dialog>
  );
}