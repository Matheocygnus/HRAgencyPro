import { useState, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/hooks/use-toast';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { apiRequest } from '@/lib/queryClient';
import { Hero, Prospect } from '@shared/schema';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';

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

interface HeroEditDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  heroId?: number;
  onSuccess?: () => void;
}

// Schema for hero data
const heroFormSchema = z.object({
  prospectId: z.number().optional(),
  name: z.string().min(1, "Name is required"),
  position: z.string().min(1, "Position is required"),
  email: z.string().email("Invalid email format"),
  phone: z.string().optional(),
  clientId: z.number().optional(),
  companyId: z.number().optional(),
  startDate: z.date().optional(),
});

export default function HeroEditDialog({
  isOpen,
  onOpenChange,
  heroId,
  onSuccess
}: HeroEditDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();

  // Fetch hero data
  const { data: heroData, isLoading: isLoadingHero } = useQuery<Hero & { name?: string; position?: string; email?: string; phone?: string }>({
    queryKey: ['/api/heroes', heroId],
    queryFn: async () => {
      if (!heroId) return undefined;
      const res = await apiRequest('GET', `/api/heroes/${heroId}`);
      return await res.json();
    },
    enabled: !!heroId && isOpen,
  });

  // Fetch related prospect data
  const { data: prospectData, isLoading: isLoadingProspect } = useQuery<Prospect>({
    queryKey: ['/api/prospects', heroData?.prospectId],
    queryFn: async () => {
      if (!heroData?.prospectId) return undefined;
      const res = await apiRequest('GET', `/api/prospects/${heroData.prospectId}`);
      return await res.json();
    },
    enabled: !!heroData?.prospectId && isOpen,
  });

  // Form setup
  const form = useForm<z.infer<typeof heroFormSchema>>({
    resolver: zodResolver(heroFormSchema),
    defaultValues: {
      prospectId: undefined,
      name: '',
      position: '',
      email: '',
      phone: '',
      clientId: undefined,
      companyId: undefined,
      startDate: undefined,
    },
  });

  // Mutation for updating hero data
  const updateHeroMutation = useMutation({
    mutationFn: async (data: z.infer<typeof heroFormSchema>) => {
      const response = await apiRequest('PATCH', `/api/heroes/${heroId}`, data);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update hero');
      }
      return response.json();
    },
    onSuccess: () => {
      setIsLoading(false);
      toast({
        title: 'Success',
        description: 'Hero information updated successfully',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/heroes'] });
      queryClient.invalidateQueries({ queryKey: ['/api/heroes', heroId] });
      if (heroData?.prospectId) {
        queryClient.invalidateQueries({ queryKey: ['/api/prospects', heroData.prospectId] });
      }
      if (onSuccess) onSuccess();
      onOpenChange(false);
    },
    onError: (error: Error) => {
      setIsLoading(false);
      toast({
        title: 'Error',
        description: error.message || 'Failed to update hero',
        variant: 'destructive',
      });
    },
  });

  // Update form when hero data is loaded
  useEffect(() => {
    if (heroData && prospectData) {
      form.reset({
        prospectId: heroData.prospectId,
        name: `${prospectData.firstName} ${prospectData.lastName}`,
        position: prospectData.position,
        email: prospectData.email,
        phone: prospectData.phone || '',
        clientId: heroData.clientId,
        companyId: heroData.companyId,
        startDate: heroData.startDate ? new Date(heroData.startDate) : undefined,
      });
    }
  }, [heroData, prospectData, form]);

  // Handle form submission
  const onSubmit = (data: z.infer<typeof heroFormSchema>) => {
    setIsLoading(true);
    updateHeroMutation.mutate(data);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Hero Information</DialogTitle>
          <DialogDescription>
            Update hero details including contact information and position.
          </DialogDescription>
        </DialogHeader>

        {(isLoadingHero || isLoadingProspect) ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input disabled {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="position"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Position</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Date</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        value={field.value ? new Date(field.value).toISOString().slice(0, 10) : ''}
                        onChange={(e) => field.onChange(e.target.value ? new Date(e.target.value) : undefined)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading || updateHeroMutation.isPending}>
                  {(isLoading || updateHeroMutation.isPending) ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Updating...
                    </>
                  ) : 'Update Hero'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}