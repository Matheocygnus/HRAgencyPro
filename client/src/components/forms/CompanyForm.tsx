import { useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { Client, Company, InsertCompany, insertCompanySchema } from '@shared/schema';
import { useToast } from '@/hooks/use-toast';
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

// Extend the insert schema for frontend validation
const companyFormSchema = insertCompanySchema.extend({
  clientId: z.number().min(1, "Client is required"),
});

interface CompanyFormProps {
  companyId?: number;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function CompanyForm({ companyId, onSuccess, onCancel }: CompanyFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Form setup
  const form = useForm<z.infer<typeof companyFormSchema>>({
    resolver: zodResolver(companyFormSchema),
    defaultValues: {
      name: '',
      clientId: undefined,
      industry: '',
      size: '',
      location: '',
    },
  });

  // Fetch clients for dropdown
  const { data: clients } = useQuery<Client[]>({
    queryKey: ['/api/clients'],
  });

  // Fetch company data if editing
  const { data: companyData, isLoading: isLoadingCompany } = useQuery<Company>({
    queryKey: ['/api/companies', companyId],
    queryFn: async () => {
      if (!companyId) return undefined;
      const res = await apiRequest('GET', `/api/companies/${companyId}`);
      return await res.json();
    },
    enabled: !!companyId,
  });

  // Mutation to create company
  const createCompanyMutation = useMutation({
    mutationFn: async (data: z.infer<typeof companyFormSchema>) => {
      const res = await apiRequest('POST', '/api/companies', data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/companies'] });
      toast({
        title: 'Company created',
        description: 'The company has been successfully created.',
      });
      if (onSuccess) onSuccess();
      form.reset();
    },
    onError: (error: any) => {
      toast({
        title: 'Failed to create company',
        description: error.message || 'There was an error creating the company.',
        variant: 'destructive',
      });
    },
  });

  // Mutation to update company
  const updateCompanyMutation = useMutation({
    mutationFn: async (data: z.infer<typeof companyFormSchema>) => {
      const res = await apiRequest('PUT', `/api/companies/${companyId}`, data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/companies'] });
      queryClient.invalidateQueries({ queryKey: ['/api/companies', companyId] });
      toast({
        title: 'Company updated',
        description: 'The company has been successfully updated.',
      });
      if (onSuccess) onSuccess();
    },
    onError: (error: any) => {
      toast({
        title: 'Failed to update company',
        description: error.message || 'There was an error updating the company.',
        variant: 'destructive',
      });
    },
  });

  // Update form when company data is loaded
  useEffect(() => {
    if (companyData) {
      form.reset({
        name: companyData.name,
        clientId: companyData.clientId,
        industry: companyData.industry || '',
        size: companyData.size || '',
        location: companyData.location || '',
      });
    }
  }, [companyData, form]);

  // Handle form submission
  const onSubmit = (data: z.infer<typeof companyFormSchema>) => {
    setIsLoading(true);
    
    if (companyId) {
      updateCompanyMutation.mutate(data);
    } else {
      createCompanyMutation.mutate(data);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter company name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="clientId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Client</FormLabel>
                <Select
                  onValueChange={(value) => field.onChange(parseInt(value))}
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
            name="industry"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Industry</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Technology, Healthcare, Finance" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="size"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company Size</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. 1-10, 11-50, 51-200, 201-500, 500+" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. New York, Remote" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button 
            type="submit" 
            disabled={isLoading || isLoadingCompany || createCompanyMutation.isPending || updateCompanyMutation.isPending}
          >
            {(isLoading || createCompanyMutation.isPending || updateCompanyMutation.isPending) ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {companyId ? 'Updating...' : 'Creating...'}
              </>
            ) : (
              companyId ? 'Update Company' : 'Create Company'
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}