import { useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { Hero, Client, Company, Contract, InsertContract, insertContractSchema } from '@shared/schema';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Textarea } from '@/components/ui/textarea';

// Extend the insert schema for frontend validation
const contractFormSchema = insertContractSchema.extend({
  title: z.string().min(3, "Title is required"),
  heroId: z.number().min(1, "Hero is required"),
  clientId: z.number().min(1, "Client is required"),
  companyId: z.number().min(1, "Company is required"),
  compensation: z.number().min(0.01, "Compensation must be greater than 0"),
  companyPayment: z.number().min(0.01, "Company payment must be greater than 0").optional(),
  profit: z.number().optional(),
  startDate: z.date({
    required_error: "Start date is required",
  }),
  endDate: z.date().optional().nullable(),
  document: z.string().optional(),
  status: z.string().min(1, "Status is required"),
});

interface ContractFormProps {
  contractId?: number;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function ContractForm({ contractId, onSuccess, onCancel }: ContractFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [documentFile, setDocumentFile] = useState<File | null>(null);
  const { toast } = useToast();

  // Form setup
  const form = useForm<z.infer<typeof contractFormSchema>>({
    resolver: zodResolver(contractFormSchema),
    defaultValues: {
      title: '',
      heroId: undefined,
      clientId: undefined,
      companyId: undefined,
      startDate: new Date(),
      endDate: null,
      compensation: undefined,
      companyPayment: undefined,
      profit: undefined,
      status: 'draft',
      document: '',
    },
  });

  // Fetch related data for dropdowns
  const { data: heroes } = useQuery<Hero[]>({
    queryKey: ['/api/heroes'],
  });

  const { data: prospects } = useQuery<any[]>({
    queryKey: ['/api/prospects'],
  });

  const { data: clients } = useQuery<Client[]>({
    queryKey: ['/api/clients'],
  });

  const { data: companies } = useQuery<Company[]>({
    queryKey: ['/api/companies'],
  });

  // Filter companies based on selected client
  const clientId = form.watch('clientId');
  const filteredCompanies = companies?.filter(company => !clientId || company.clientId === clientId);
  
  // Fetch contract data if editing
  const { data: contractData, isLoading: isLoadingContract } = useQuery<Contract>({
    queryKey: ['/api/contracts', contractId],
    queryFn: async () => {
      if (!contractId) return undefined;
      const res = await apiRequest('GET', `/api/contracts/${contractId}`);
      return await res.json();
    },
    enabled: !!contractId,
  });

  // Mutation to create contract
  const createContractMutation = useMutation({
    mutationFn: async (data: z.infer<typeof contractFormSchema>) => {
      const formData = new FormData();
      
      // Add all form fields to formData
      Object.entries(data).forEach(([key, value]) => {
        if (value instanceof Date) {
          formData.append(key, value.toISOString());
        } else if (value !== null && value !== undefined) {
          formData.append(key, String(value));
        }
      });
      
      // Add document file if provided
      if (documentFile) {
        formData.append('documentFile', documentFile);
      }
      
      const res = await fetch('/api/contracts', {
        method: 'POST',
        body: formData,
      });
      
      if (!res.ok) {
        throw new Error('Failed to create contract');
      }
      
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/contracts'] });
      toast({
        title: 'Contract created',
        description: 'The contract has been successfully created.',
      });
      if (onSuccess) onSuccess();
      form.reset();
      setDocumentFile(null);
    },
    onError: (error: any) => {
      toast({
        title: 'Failed to create contract',
        description: error.message || 'There was an error creating the contract.',
        variant: 'destructive',
      });
    },
  });

  // Mutation to update contract
  const updateContractMutation = useMutation({
    mutationFn: async (data: z.infer<typeof contractFormSchema>) => {
      const formData = new FormData();
      
      // Add all form fields to formData
      Object.entries(data).forEach(([key, value]) => {
        if (value instanceof Date) {
          formData.append(key, value.toISOString());
        } else if (value !== null && value !== undefined) {
          formData.append(key, String(value));
        }
      });
      
      // Add document file if provided
      if (documentFile) {
        formData.append('documentFile', documentFile);
      }
      
      const res = await fetch(`/api/contracts/${contractId}`, {
        method: 'PUT',
        body: formData,
      });
      
      if (!res.ok) {
        throw new Error('Failed to update contract');
      }
      
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/contracts'] });
      queryClient.invalidateQueries({ queryKey: ['/api/contracts', contractId] });
      toast({
        title: 'Contract updated',
        description: 'The contract has been successfully updated.',
      });
      if (onSuccess) onSuccess();
      setDocumentFile(null);
    },
    onError: (error: any) => {
      toast({
        title: 'Failed to update contract',
        description: error.message || 'There was an error updating the contract.',
        variant: 'destructive',
      });
    },
  });

  // Handle hero selection to auto-fill related fields
  const handleHeroChange = (heroId: number) => {
    const selectedHero = heroes?.find(h => h.id === heroId);
    if (selectedHero) {
      form.setValue('clientId', selectedHero.clientId);
      form.setValue('companyId', selectedHero.companyId);
    }
  };

  // Update form when contract data is loaded
  useEffect(() => {
    if (contractData) {
      form.reset({
        title: contractData.title,
        heroId: contractData.heroId,
        clientId: contractData.clientId,
        companyId: contractData.companyId,
        startDate: new Date(contractData.startDate),
        endDate: contractData.endDate ? new Date(contractData.endDate) : undefined,
        compensation: contractData.compensation,
        companyPayment: contractData.companyPayment,
        profit: contractData.profit || (contractData.companyPayment ? contractData.companyPayment - contractData.compensation : undefined),
        status: contractData.status,
        document: contractData.document || '',
      });
    }
  }, [contractData, form]);

  // Handle file input change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setDocumentFile(e.target.files[0]);
    }
  };

  // Handle form submission
  const onSubmit = (data: z.infer<typeof contractFormSchema>) => {
    setIsLoading(true);
    
    if (contractId) {
      updateContractMutation.mutate(data);
    } else {
      createContractMutation.mutate(data);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contract Title</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Development Contract" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="heroId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Hero</FormLabel>
                <Select
                  onValueChange={(value) => {
                    const heroId = parseInt(value);
                    field.onChange(heroId);
                    handleHeroChange(heroId);
                  }}
                  defaultValue={field.value?.toString()}
                  value={field.value?.toString()}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a hero" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {heroes?.map((hero) => {
                      const prospect = prospects?.find((p: any) => p.id === hero.prospectId);
                      const heroName = prospect ? `${prospect.firstName} ${prospect.lastName}` : `Hero ${hero.id}`;
                      return (
                        <SelectItem key={hero.id} value={hero.id.toString()}>
                          {heroName}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="signed">Signed</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="terminated">Terminated</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="clientId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Client</FormLabel>
                <Select
                  onValueChange={(value) => {
                    field.onChange(parseInt(value));
                    // Reset company when client changes
                    form.setValue('companyId', 0);
                  }}
                  defaultValue={field.value?.toString()}
                  value={field.value?.toString()}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a client" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {clients?.map((client) => (
                      <SelectItem key={client.id} value={client.id.toString()}>
                        {client.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="companyId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company</FormLabel>
                <Select
                  onValueChange={(value) => field.onChange(parseInt(value))}
                  defaultValue={field.value?.toString()}
                  value={field.value?.toString()}
                  disabled={!clientId}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={clientId ? "Select a company" : "Select a client first"} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {filteredCompanies?.map((company) => (
                      <SelectItem key={company.id} value={company.id.toString()}>
                        {company.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="compensation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Hero Compensation</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="e.g. 5000.00" 
                    {...field}
                    onChange={(e) => {
                      const value = e.target.value;
                      const compensation = value === '' ? undefined : parseFloat(value);
                      field.onChange(compensation);
                      
                      // Automatically calculate profit if company payment exists
                      const companyPayment = form.getValues('companyPayment');
                      if (companyPayment && compensation) {
                        form.setValue('profit', companyPayment - compensation);
                      }
                    }}
                    value={field.value === undefined ? '' : field.value}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="companyPayment"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company Payment</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="e.g. 7000.00" 
                    onChange={(e) => {
                      const value = e.target.value;
                      const companyPayment = value === '' ? undefined : parseFloat(value);
                      field.onChange(companyPayment);
                      
                      // Automatically calculate profit
                      const compensation = form.getValues('compensation');
                      if (companyPayment && compensation) {
                        form.setValue('profit', companyPayment - compensation);
                      }
                    }}
                    value={field.value === undefined ? '' : field.value}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="profit"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Profit</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="Calculated automatically" 
                    {...field}
                    onChange={(e) => {
                      const value = e.target.value;
                      field.onChange(value === '' ? undefined : parseFloat(value));
                    }}
                    value={field.value === undefined ? '' : field.value}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Start Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="endDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>End Date (Optional)</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value || undefined}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date < (form.watch('startDate') || new Date())
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-2">
          <FormLabel>Contract Document</FormLabel>
          <div className="flex items-center gap-2">
            <Input
              type="file"
              onChange={handleFileChange}
              accept=".pdf,.doc,.docx"
              className="flex-1"
            />
            {documentFile && (
              <div className="text-sm text-muted-foreground">
                File selected: {documentFile.name}
              </div>
            )}
          </div>
          {contractData?.document && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <p>Current document: {contractData.document}</p>
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                onClick={() => window.open(`/api/contracts/${contractId}/document`, '_blank')}
              >
                View Document
              </Button>
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button 
            type="submit" 
            disabled={isLoading || isLoadingContract || createContractMutation.isPending || updateContractMutation.isPending}
          >
            {(isLoading || createContractMutation.isPending || updateContractMutation.isPending) ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {contractId ? 'Updating...' : 'Creating...'}
              </>
            ) : (
              contractId ? 'Update Contract' : 'Create Contract'
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}