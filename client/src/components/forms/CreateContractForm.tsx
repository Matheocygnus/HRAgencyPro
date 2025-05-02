import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { insertContractSchema } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { format } from "date-fns";
import { CalendarIcon, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

// Extend the contract schema with validation
const createContractSchema = insertContractSchema.extend({
  startDate: z.coerce.date({
    required_error: "Start date is required",
  }),
  endDate: z.coerce.date().optional(),
  compensation: z.coerce.number().min(0, {
    message: "Compensation must be a non-negative number",
  }),
  companyPayment: z.coerce.number().min(0, {
    message: "Company payment must be a non-negative number",
  }),
});

type CreateContractFormProps = {
  hero: {
    id: number;
    name: string;
    clientId: number;
    companyId: number;
    position?: string;
  };
  onSuccess: () => void;
};

export default function CreateContractForm({ hero, onSuccess }: CreateContractFormProps) {
  const [clients, setClients] = useState<any[]>([]);
  const [companies, setCompanies] = useState<any[]>([]);
  const { toast } = useToast();
  
  // Set up form with default values
  const form = useForm<z.infer<typeof createContractSchema>>({
    resolver: zodResolver(createContractSchema),
    defaultValues: {
      title: `${hero.position || "Professional"} Services Agreement - ${hero.name}`,
      heroId: hero.id,
      clientId: hero.clientId,
      companyId: hero.companyId,
      startDate: new Date(),
      compensation: 0,
      companyPayment: 0,
      status: "draft",
    },
  });

  const isPending = form.formState.isSubmitting;

  useEffect(() => {
    // Fetch clients and companies for the form
    const fetchData = async () => {
      try {
        const clientsResponse = await fetch('/api/clients');
        if (clientsResponse.ok) {
          const clientsData = await clientsResponse.json();
          setClients(clientsData);
        }
        
        const companiesResponse = await fetch('/api/companies');
        if (companiesResponse.ok) {
          const companiesData = await companiesResponse.json();
          setCompanies(companiesData);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    
    fetchData();
  }, []);

  const onSubmit = async (data: z.infer<typeof createContractSchema>) => {
    try {
      // Calculate profit
      data.profit = data.companyPayment - data.compensation;
      
      const response = await apiRequest("POST", "/api/contracts", data);
      
      if (response.ok) {
        const result = await response.json();
        toast({
          title: "Contract created successfully",
          description: `Contract for ${hero.name} has been created.`,
        });
        
        // Invalidate relevant queries
        queryClient.invalidateQueries({ queryKey: ['/api/contracts'] });
        queryClient.invalidateQueries({ queryKey: ['/api/heroes'] });
        
        // Call success callback
        onSuccess();
      } else {
        const error = await response.json();
        throw new Error(error.message || "Failed to create contract");
      }
    } catch (error: any) {
      toast({
        title: "Failed to create contract",
        description: error.message,
        variant: "destructive",
      });
    }
  };

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
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      selected={field.value as Date}
                      onSelect={field.onChange}
                      disabled={(date) => {
                        const startDate = form.getValues("startDate");
                        return startDate && date < startDate;
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="compensation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Hero Compensation ($)</FormLabel>
                <FormControl>
                  <Input type="number" min="0" step="0.01" placeholder="0.00" {...field} />
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
                <FormLabel>Company Payment ($)</FormLabel>
                <FormControl>
                  <Input type="number" min="0" step="0.01" placeholder="0.00" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="pt-2">
          <Button type="submit" disabled={isPending} className="w-full">
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Contract...
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