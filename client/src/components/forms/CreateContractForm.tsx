import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { insertContractSchema } from "@shared/schema";
import { Loader2 } from "lucide-react";

// Form schema with default values and validation
const formSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  heroId: z.number(),
  clientId: z.number(),
  companyId: z.number(),
  startDate: z.string(),
  endDate: z.string().optional().nullable(),
  isIndefinite: z.boolean().default(false),
  compensation: z.coerce.number().min(0, "Compensation must be a positive number"),
  companyPayment: z.coerce.number().min(0, "Company payment must be a positive number"),
  profit: z.number(),
  notes: z.string().optional(),
  status: z.enum(["draft", "signed", "active", "completed", "terminated"]).default("draft"),
  document: z.string().nullable().optional(),
}).transform(data => ({
  ...data,
  profit: data.companyPayment - data.compensation,
  // If indefinite contract, set endDate to null
  endDate: data.isIndefinite ? null : data.endDate
}));

type CreateContractFormProps = {
  hero: {
    id: number;
    prospectId: number;
    clientId: number;
    companyId: number;
    name: string;
    position: string;
  };
  onSuccess?: () => void;
};

export default function CreateContractForm({ hero, onSuccess }: CreateContractFormProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  // Current date for default values
  const today = new Date();
  const startDate = today.toISOString().split('T')[0];
  
  // End date default (3 months from now)
  const endDate = new Date(today);
  endDate.setMonth(endDate.getMonth() + 3);
  const defaultEndDate = endDate.toISOString().split('T')[0];
  
  // Create form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: `${hero.position} Contract - ${hero.name}`,
      heroId: hero.id,
      clientId: hero.clientId,
      companyId: hero.companyId,
      startDate: startDate,
      endDate: defaultEndDate,
      compensation: 0,
      companyPayment: 0,
      profit: 0,
      notes: "",
      status: "draft",
      document: null,
      isIndefinite: false,
    },
  });
  
  // Create contract mutation
  const createContractMutation = useMutation({
    mutationFn: async (formData: z.infer<typeof formSchema>) => {
      const response = await apiRequest("POST", "/api/contracts", formData);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Contract created",
        description: "Contract has been created successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/contracts"] });
      queryClient.invalidateQueries({ queryKey: ["/api/heroes"] });
      if (onSuccess) onSuccess();
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: `Failed to create contract: ${error.message}`,
        variant: "destructive",
      });
    },
  });
  
  // Auto calculate profit when compensation or company payment changes
  const updateProfit = () => {
    const compensation = form.watch("compensation");
    const companyPayment = form.watch("companyPayment");
    const profit = companyPayment - compensation;
    form.setValue("profit", profit);
  };
  
  // Handle form submission
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    
    try {
      // Convert string dates to ISO date format for the server
      const formattedValues = {
        ...values,
        // Convert start date to ISO string format
        startDate: new Date(values.startDate).toISOString(),
        // Handle end date based on isIndefinite flag
        endDate: values.isIndefinite || !values.endDate ? null : new Date(values.endDate).toISOString()
      };
      
      await createContractMutation.mutateAsync(formattedValues);
    } catch (error) {
      console.error("Error creating contract:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 gap-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contract Title</FormLabel>
                <FormControl>
                  <Input placeholder="Enter contract title" {...field} />
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
                <FormItem>
                  <FormLabel>Start Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="space-y-2">
              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Date</FormLabel>
                    <FormControl>
                      <Input 
                        type="date" 
                        {...field} 
                        disabled={form.watch("isIndefinite")}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="isIndefinite"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-2 space-y-0 mt-1">
                    <FormControl>
                      <Checkbox 
                        checked={field.value} 
                        onCheckedChange={(checked) => {
                          field.onChange(checked);
                          if (checked) {
                            form.setValue("endDate", "");
                          }
                        }} 
                      />
                    </FormControl>
                    <FormLabel className="text-sm font-normal">Indefinite contract (no end date)</FormLabel>
                  </FormItem>
                )}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="compensation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hero Compensation</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="0.00" 
                      {...field} 
                      onChange={(e) => {
                        field.onChange(e);
                        updateProfit();
                      }}
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
                      placeholder="0.00" 
                      {...field} 
                      onChange={(e) => {
                        field.onChange(e);
                        updateProfit();
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <FormField
            control={form.control}
            name="profit"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Profit (Calculated)</FormLabel>
                <FormControl>
                  <Input type="number" readOnly {...field} />
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
          
          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Notes</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Enter any additional notes here" 
                    className="min-h-[100px]" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <Button type="submit" className="w-full" disabled={isLoading || createContractMutation.isPending}>
          {(isLoading || createContractMutation.isPending) ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating...
            </>
          ) : (
            'Create Contract'
          )}
        </Button>
      </form>
    </Form>
  );
}