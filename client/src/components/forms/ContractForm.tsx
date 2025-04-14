import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { insertContractSchema, Hero, Client, Company } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

// Extend the schema with validations
const formSchema = insertContractSchema.extend({
  title: z.string().min(5, "Contract title must be at least 5 characters"),
  startDate: z.string().refine((val) => !isNaN(Date.parse(val)), "Please enter a valid date"),
  compensation: z.preprocess(
    (val) => parseFloat(val as string),
    z.number().min(0, "Compensation must be a positive number")
  ),
});

interface ContractFormProps {
  onSuccess?: () => void;
}

export default function ContractForm({ onSuccess }: ContractFormProps) {
  const { toast } = useToast();
  const [selectedClient, setSelectedClient] = useState<number | null>(null);
  
  // Fetch heroes (hired prospects)
  const { data: heroes = [] } = useQuery<Hero[]>({
    queryKey: ["/api/heroes"],
  });
  
  // Fetch clients
  const { data: clients = [] } = useQuery<Client[]>({
    queryKey: ["/api/clients"],
  });
  
  // Fetch companies for the selected client
  const { data: companies = [] } = useQuery<Company[]>({
    queryKey: ["/api/clients", selectedClient, "companies"],
    queryFn: async () => {
      if (!selectedClient) return [];
      const res = await fetch(`/api/clients/${selectedClient}/companies`);
      if (!res.ok) throw new Error("Failed to fetch companies");
      return res.json();
    },
    enabled: !!selectedClient,
  });
  
  // Form definition
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      heroId: undefined,
      clientId: undefined,
      companyId: undefined,
      startDate: new Date().toISOString().split('T')[0], // Today's date
      endDate: "",
      compensation: "",
      status: "draft",
      document: "",
    },
  });
  
  // Submit mutation
  const createContract = useMutation({
    mutationFn: async (data: z.infer<typeof formSchema>) => {
      const res = await apiRequest("POST", "/api/contracts", data);
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Success!",
        description: "Contract has been created successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/contracts"] });
      form.reset();
      if (onSuccess) onSuccess();
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // Form submission
  function onSubmit(values: z.infer<typeof formSchema>) {
    createContract.mutate(values);
  }
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contract Title</FormLabel>
              <FormControl>
                <Input placeholder="Contract title" {...field} />
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
                onValueChange={(value) => field.onChange(parseInt(value))}
                value={field.value?.toString()}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a hero" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {heroes.map((hero) => (
                    <SelectItem key={hero.id} value={hero.id.toString()}>
                      {`Hero #${hero.id} (Prospect #${hero.prospectId})`}
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
          name="clientId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Client</FormLabel>
              <Select 
                onValueChange={(value) => {
                  const numValue = parseInt(value);
                  field.onChange(numValue);
                  setSelectedClient(numValue);
                  // Reset company when client changes
                  form.setValue("companyId", undefined);
                }}
                value={field.value?.toString()}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a client" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {clients.map((client) => (
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
                value={field.value?.toString()}
                disabled={!selectedClient || companies.length === 0}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={!selectedClient ? "Select a client first" : "Select a company"} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {companies.map((company) => (
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
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Start Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="endDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>End Date (Optional)</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="compensation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Compensation Amount</FormLabel>
              <FormControl>
                <Input type="number" min="0" step="0.01" placeholder="0.00" {...field} />
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
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select contract status" />
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
        
        <FormField
          control={form.control}
          name="document"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Document Link (optional)</FormLabel>
              <FormControl>
                <Input placeholder="Link to contract document" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex justify-end space-x-2 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => form.reset()}
            disabled={createContract.isPending}
          >
            Cancel
          </Button>
          <Button 
            type="submit"
            disabled={createContract.isPending}
          >
            {createContract.isPending ? (
              <>
                <i className="fas fa-spinner fa-spin mr-2"></i>
                Creating...
              </>
            ) : (
              "Create Contract"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
