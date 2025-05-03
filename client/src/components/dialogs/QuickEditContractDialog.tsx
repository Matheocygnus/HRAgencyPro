import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useQuery, useMutation } from '@tanstack/react-query';
import { queryClient, apiRequest } from '@/lib/queryClient';
import { Contract } from '@shared/schema';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Loader2, Calendar as CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface QuickEditContractDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  contractId?: number;
  onSuccess?: () => void;
}

export default function QuickEditContractDialog({
  isOpen,
  onOpenChange,
  contractId,
  onSuccess,
}: QuickEditContractDialogProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<Contract>>({});
  
  // Fetch contract data
  const { data: contract, isLoading: isLoadingContract } = useQuery<Contract>({
    queryKey: ['/api/contracts', contractId],
    queryFn: async () => {
      if (!contractId) return undefined;
      const res = await apiRequest('GET', `/api/contracts/${contractId}`);
      return await res.json();
    },
    enabled: !!contractId && isOpen,
  });
  
  // Set form data when contract is loaded
  useEffect(() => {
    if (contract) {
      setFormData({
        startDate: new Date(contract.startDate),
        endDate: contract.endDate ? new Date(contract.endDate) : null,
        compensation: contract.compensation,
        companyPayment: contract.companyPayment,
        profit: contract.profit,
      });
    }
  }, [contract]);
  
  // Update contract mutation
  const updateContractMutation = useMutation({
    mutationFn: async (data: Partial<Contract>) => {
      setIsLoading(true);
      const res = await apiRequest('PATCH', `/api/contracts/${contractId}`, data);
      return await res.json();
    },
    onSuccess: () => {
      setIsLoading(false);
      queryClient.invalidateQueries({ queryKey: ['/api/contracts'] });
      toast({
        title: 'Contract updated',
        description: 'The contract has been successfully updated.',
      });
      if (onSuccess) onSuccess();
      onOpenChange(false);
    },
    onError: (error: any) => {
      setIsLoading(false);
      toast({
        title: 'Failed to update contract',
        description: error.message || 'There was an error updating the contract.',
        variant: 'destructive',
      });
    },
  });
  
  // Calculate profit when compensation or company payment changes
  useEffect(() => {
    if (formData.compensation !== undefined && formData.companyPayment !== undefined) {
      setFormData(prev => ({
        ...prev,
        profit: formData.companyPayment! - formData.compensation!
      }));
    }
  }, [formData.compensation, formData.companyPayment]);
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateContractMutation.mutate(formData);
  };
  
  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numericValue = name === 'compensation' || name === 'companyPayment' || name === 'profit' 
      ? parseFloat(value) 
      : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: numericValue
    }));
  };
  
  // Format currency
  const formatCurrency = (amount: number | undefined) => {
    if (amount === undefined) return '';
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };
  
  if (isLoadingContract) {
    return (
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <div className="flex justify-center items-center h-40">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </DialogContent>
      </Dialog>
    );
  }
  
  if (!contract) {
    return null;
  }
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Contract</DialogTitle>
          <DialogDescription>
            Make changes to the contract details below.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Title
              </Label>
              <div className="col-span-3">
                <div className="font-medium">{contract.title}</div>
                <Badge className="mt-1">{contract.status}</Badge>
              </div>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="startDate" className="text-right">
                Start Date
              </Label>
              <div className="col-span-3">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !formData.startDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.startDate ? format(formData.startDate, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.startDate || undefined}
                      onSelect={(date) => setFormData(prev => ({ ...prev, startDate: date || new Date() }))}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="endDate" className="text-right">
                End Date
              </Label>
              <div className="col-span-3">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !formData.endDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.endDate ? format(formData.endDate, "PPP") : <span>Optional</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.endDate || undefined}
                      onSelect={(date) => setFormData(prev => ({ ...prev, endDate: date }))}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="compensation" className="text-right">
                Compensation
              </Label>
              <div className="col-span-3">
                <Input
                  id="compensation"
                  name="compensation"
                  type="number"
                  step="0.01"
                  value={formData.compensation || ''}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="companyPayment" className="text-right">
                Payment
              </Label>
              <div className="col-span-3">
                <Input
                  id="companyPayment"
                  name="companyPayment"
                  type="number"
                  step="0.01"
                  value={formData.companyPayment || ''}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="profit" className="text-right">
                Profit
              </Label>
              <div className="col-span-3">
                <Input
                  id="profit"
                  name="profit"
                  type="number"
                  step="0.01"
                  value={formData.profit || ''}
                  disabled
                  className="col-span-3 bg-muted"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Calculated automatically (Payment - Compensation)
                </p>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}