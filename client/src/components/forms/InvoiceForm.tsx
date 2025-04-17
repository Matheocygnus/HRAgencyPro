import { useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { Contract, Hero, Client, Company, Invoice, InsertInvoice, insertInvoiceSchema, Prospect } from '@shared/schema';
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
import { 
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, Check, ChevronsUpDown, CalendarIcon, X } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';

// Define a type for the hero selection with extended information
type HeroOption = {
  id: number;
  name: string;
  companyName?: string;
  clientId?: number;
  companyId?: number;
  contractId?: number;
};

// Extend the insert schema for frontend validation
const invoiceFormSchema = insertInvoiceSchema.extend({
  contractId: z.number().min(1, "Contract is required"),
  heroIds: z.array(z.number()).min(1, "At least one hero is required"), // Multiple heroes
  heroId: z.number().optional(), // Keep for backward compatibility
  clientId: z.number().min(1, "Client is required"),
  companyId: z.number().min(1, "Company is required"),
  invoiceNumber: z.string().min(3, "Invoice number is required"),
  amount: z.number().min(0.01, "Amount must be greater than 0"),
  dueDate: z.date({
    required_error: "Due date is required",
  }),
  status: z.string().min(1, "Status is required"),
});

interface InvoiceFormProps {
  invoiceId?: number;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function InvoiceForm({ invoiceId, onSuccess, onCancel }: InvoiceFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Form setup
  const form = useForm<z.infer<typeof invoiceFormSchema>>({
    resolver: zodResolver(invoiceFormSchema),
    defaultValues: {
      invoiceNumber: '',
      contractId: undefined,
      heroId: undefined,
      heroIds: [], // Array for multiple heroes
      clientId: undefined,
      companyId: undefined,
      amount: undefined,
      status: 'pending',
      dueDate: new Date(),
      paidDate: undefined,
    },
  });

  // Fetch related data for dropdowns
  const { data: contracts } = useQuery<Contract[]>({
    queryKey: ['/api/contracts'],
  });

  const { data: heroes } = useQuery<Hero[]>({
    queryKey: ['/api/heroes'],
  });

  const { data: prospects } = useQuery<Prospect[]>({
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

  // Fetch invoice data if editing
  const { data: invoiceData, isLoading: isLoadingInvoice } = useQuery<Invoice>({
    queryKey: ['/api/invoices', invoiceId],
    queryFn: async () => {
      if (!invoiceId) return undefined;
      const res = await apiRequest('GET', `/api/invoices/${invoiceId}`);
      return await res.json();
    },
    enabled: !!invoiceId,
  });

  // Generate next invoice number for new invoices
  const { data: invoices } = useQuery<Invoice[]>({
    queryKey: ['/api/invoices'],
    enabled: !invoiceId,
  });

  useEffect(() => {
    if (!invoiceId && invoices && invoices.length > 0) {
      // Extract the numeric part of the last invoice number and increment it
      const lastInvoice = invoices.sort((a, b) => b.id - a.id)[0];
      if (lastInvoice && lastInvoice.invoiceNumber) {
        const match = lastInvoice.invoiceNumber.match(/(\D+)(\d+)/);
        if (match) {
          const prefix = match[1];
          const number = parseInt(match[2]) + 1;
          const paddedNumber = number.toString().padStart(4, '0');
          form.setValue('invoiceNumber', `${prefix}${paddedNumber}`);
        }
      } else {
        form.setValue('invoiceNumber', 'INV-0001');
      }
    }
  }, [invoices, invoiceId, form]);

  // Handle contract selection to auto-fill related fields
  const handleContractChange = (contractId: number) => {
    const selectedContract = contracts?.find(c => c.id === contractId);
    if (selectedContract) {
      form.setValue('heroId', selectedContract.heroId);
      form.setValue('clientId', selectedContract.clientId);
      form.setValue('companyId', selectedContract.companyId);
    }
  };

  // Mutation to create invoice
  const createInvoiceMutation = useMutation({
    mutationFn: async (data: z.infer<typeof invoiceFormSchema>) => {
      const res = await apiRequest('POST', '/api/invoices', data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/invoices'] });
      toast({
        title: 'Invoice created',
        description: 'The invoice has been successfully created.',
      });
      if (onSuccess) onSuccess();
      form.reset();
    },
    onError: (error: any) => {
      toast({
        title: 'Failed to create invoice',
        description: error.message || 'There was an error creating the invoice.',
        variant: 'destructive',
      });
    },
  });

  // Mutation to update invoice
  const updateInvoiceMutation = useMutation({
    mutationFn: async (data: z.infer<typeof invoiceFormSchema>) => {
      const res = await apiRequest('PUT', `/api/invoices/${invoiceId}`, data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/invoices'] });
      queryClient.invalidateQueries({ queryKey: ['/api/invoices', invoiceId] });
      toast({
        title: 'Invoice updated',
        description: 'The invoice has been successfully updated.',
      });
      if (onSuccess) onSuccess();
    },
    onError: (error: any) => {
      toast({
        title: 'Failed to update invoice',
        description: error.message || 'There was an error updating the invoice.',
        variant: 'destructive',
      });
    },
  });

  // Update form when invoice data is loaded
  useEffect(() => {
    if (invoiceData) {
      form.reset({
        invoiceNumber: invoiceData.invoiceNumber,
        contractId: invoiceData.contractId,
        heroId: invoiceData.heroId,
        heroIds: invoiceData.heroId ? [invoiceData.heroId] : [], // Convert single heroId to array for backwards compatibility
        clientId: invoiceData.clientId,
        companyId: invoiceData.companyId,
        amount: invoiceData.amount,
        status: invoiceData.status,
        dueDate: new Date(invoiceData.dueDate),
        paidDate: invoiceData.paidDate ? new Date(invoiceData.paidDate) : undefined,
      });
    }
  }, [invoiceData, form]);

  // Handle form submission
  const onSubmit = (data: z.infer<typeof invoiceFormSchema>) => {
    setIsLoading(true);
    
    if (invoiceId) {
      updateInvoiceMutation.mutate(data);
    } else {
      createInvoiceMutation.mutate(data);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="invoiceNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Invoice Number</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. INV-0001" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Amount</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="e.g. 1500.00" 
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
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="overdue">Overdue</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
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
            name="contractId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contract</FormLabel>
                <Select
                  onValueChange={(value) => {
                    const contractId = parseInt(value);
                    field.onChange(contractId);
                    handleContractChange(contractId);
                  }}
                  defaultValue={field.value?.toString()}
                  value={field.value?.toString()}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a contract" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {contracts?.map((contract) => (
                      <SelectItem key={contract.id} value={contract.id.toString()}>
                        {contract.title} (ID: {contract.id})
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
            name="heroIds"
            render={({ field }) => {
              // Prepare hero options with name/company info and related data
              const heroOptions: HeroOption[] = heroes?.map(hero => {
                const prospect = prospects?.find(p => p.id === hero.prospectId);
                const company = companies?.find(c => c.id === hero.companyId);
                const contract = contracts?.find(c => c.heroId === hero.id);
                
                return {
                  id: hero.id,
                  name: prospect ? `${prospect.firstName} ${prospect.lastName}` : `Hero #${hero.id}`,
                  companyName: company?.name,
                  clientId: company?.clientId,
                  companyId: company?.id,
                  contractId: contract?.id
                };
              }) || [];
              
              // Get selected heroes
              const selectedHeroes = heroOptions.filter(h => field.value.includes(h.id));
              
              // Auto-select common client and company if available
              useEffect(() => {
                if (selectedHeroes.length > 0) {
                  // Check if all heroes have the same client and company
                  const clientId = selectedHeroes[0].clientId;
                  const companyId = selectedHeroes[0].companyId;
                  const contractId = selectedHeroes[0].contractId;
                  
                  const allSameClient = selectedHeroes.every(h => h.clientId === clientId);
                  const allSameCompany = selectedHeroes.every(h => h.companyId === companyId);
                  
                  // Auto-set client and company if they're all the same
                  if (clientId && allSameClient) {
                    form.setValue('clientId', clientId);
                  }
                  
                  if (companyId && allSameCompany) {
                    form.setValue('companyId', companyId);
                  }
                  
                  // Set first hero's contract if only one hero is selected
                  if (selectedHeroes.length === 1 && contractId) {
                    form.setValue('contractId', contractId);
                  }
                  
                  // For backward compatibility, set the first hero as heroId
                  if (selectedHeroes.length > 0) {
                    form.setValue('heroId', selectedHeroes[0].id);
                  }
                }
              }, [field.value, form]);
              
              return (
                <FormItem className="flex flex-col">
                  <FormLabel>Heroes</FormLabel>
                  <div className="space-y-2">
                    <div className="relative">
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              role="combobox"
                              className={cn(
                                "w-full justify-between",
                                !field.value.length && "text-muted-foreground"
                              )}
                            >
                              {field.value.length > 0
                                ? `${field.value.length} hero${field.value.length > 1 ? 's' : ''} selected`
                                : "Select heroes"}
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0" align="start">
                          <Command>
                            <CommandInput placeholder="Search heroes..." />
                            <CommandEmpty>No hero found.</CommandEmpty>
                            <CommandGroup>
                              {heroOptions.map((hero) => (
                                <CommandItem
                                  key={hero.id}
                                  value={hero.name}
                                  onSelect={() => {
                                    const newValue = [...field.value];
                                    const index = newValue.indexOf(hero.id);
                                    
                                    if (index === -1) {
                                      newValue.push(hero.id);
                                    } else {
                                      newValue.splice(index, 1);
                                    }
                                    
                                    field.onChange(newValue);
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      field.value.includes(hero.id) ? "opacity-100" : "opacity-0"
                                    )}
                                  />
                                  {hero.name}
                                  {hero.companyName && (
                                    <span className="ml-1 text-muted-foreground"> - {hero.companyName}</span>
                                  )}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    </div>
                    
                    {/* Show selected heroes as badges */}
                    {selectedHeroes.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {selectedHeroes.map(hero => (
                          <Badge key={hero.id} variant="secondary" className="flex items-center gap-1">
                            {hero.name}
                            <X 
                              className="h-3 w-3 cursor-pointer"
                              onClick={() => {
                                const newValue = field.value.filter(id => id !== hero.id);
                                field.onChange(newValue);
                              }}
                            />
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                  <FormMessage />
                </FormItem>
              );
            }}
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
                    form.setValue('companyId', null as any);
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

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="dueDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Due Date</FormLabel>
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
                      disabled={(date) =>
                        date < new Date(new Date().setHours(0, 0, 0, 0))
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          {form.watch('status') === 'paid' && (
            <FormField
              control={form.control}
              name="paidDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Payment Date</FormLabel>
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
            disabled={isLoading || isLoadingInvoice || createInvoiceMutation.isPending || updateInvoiceMutation.isPending}
          >
            {(isLoading || createInvoiceMutation.isPending || updateInvoiceMutation.isPending) ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {invoiceId ? 'Updating...' : 'Creating...'}
              </>
            ) : (
              invoiceId ? 'Update Invoice' : 'Create Invoice'
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}