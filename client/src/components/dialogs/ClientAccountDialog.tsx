import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  username: z.string().min(3, { message: "Username must be at least 3 characters" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  firstName: z.string().min(1, { message: "First name is required" }),
  lastName: z.string().min(1, { message: "Last name is required" }),
});

type FormValues = z.infer<typeof formSchema>;

interface ClientAccountDialogProps {
  clientId: number;
  clientName: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export default function ClientAccountDialog({
  clientId,
  clientName,
  isOpen,
  onOpenChange,
  onSuccess,
}: ClientAccountDialogProps) {
  const { toast } = useToast();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
      firstName: "",
      lastName: "",
    },
  });
  
  const createAccountMutation = useMutation({
    mutationFn: async (data: FormValues) => {
      const res = await apiRequest("POST", `/api/clients/${clientId}/create-account`, data);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Account created",
        description: `Client account created successfully for ${clientName}`,
      });
      form.reset();
      onOpenChange(false);
      if (onSuccess) onSuccess();
    },
    onError: (error: Error) => {
      toast({
        title: "Error creating account",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  const onSubmit = (data: FormValues) => {
    createAccountMutation.mutate(data);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create Client Account</DialogTitle>
          <DialogDescription>
            Create login credentials for {clientName} to access their client profile
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="johndoe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter className="mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                disabled={createAccountMutation.isPending}
              >
                {createAccountMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Account"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}