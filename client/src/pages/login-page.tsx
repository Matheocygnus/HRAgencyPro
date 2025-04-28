import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Redirect, Link, useLocation } from "wouter";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";

const formSchema = z.object({
  username: z.string().min(2, "Email must be at least 2 characters").email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function LoginPage() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<any>(null);

  // Check if user is already logged in
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/user');
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        }
      } catch (error) {
        console.error("Error checking auth status:", error);
      }
    };
    checkAuth();
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "brunov@catalystgrowthsystems.com",
      password: "AAbb+1234",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      console.log("Attempting login with:", values.username);
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });
      
      console.log("Login response status:", response.status);
      
      if (response.ok) {
        const userData = await response.json();
        console.log("Login successful, user data:", userData);
        
        // Update cache for react-query
        queryClient.setQueryData(["/api/user"], userData);
        
        toast({
          title: "Login successful",
          description: "Welcome back!",
        });
        
        // Force set the user
        setUser(userData);
        console.log("User logged in:", userData);
        
        // Determine which dashboard to send the user to based on their role
        let dashboardPath = "/";
        
        if (userData.role === "super_admin" || userData.role === "admin") {
          dashboardPath = "/"; // Admin dashboard
        } else if (userData.role === "client") {
          dashboardPath = "/client-dashboard";
        } else if (userData.role === "hero") {
          dashboardPath = "/hero-dashboard";
        } else if (userData.role === "prospect") {
          dashboardPath = "/prospect-dashboard";
        }
        
        console.log("Redirecting to dashboard:", dashboardPath);
        
        // Use window.location for a hard redirect
        window.location.href = dashboardPath;
      } else {
        let errorMessage = "Invalid credentials";
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (e) {
          console.error("Failed to parse error response:", e);
        }
        
        throw new Error(errorMessage);
      }
    } catch (error: any) {
      console.error("Login error:", error);
      toast({
        title: "Login failed",
        description: error.message || "Invalid credentials",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  // If already logged in, redirect to appropriate dashboard
  if (user) {
    // Determine which dashboard to send the user to based on their role
    let dashboardPath = "/";
    
    if (user.role === "super_admin" || user.role === "admin") {
      dashboardPath = "/"; // Admin dashboard
    } else if (user.role === "client") {
      dashboardPath = "/client-dashboard";
    } else if (user.role === "hero") {
      dashboardPath = "/hero-dashboard";
    } else if (user.role === "prospect") {
      dashboardPath = "/prospect-dashboard";
    }
    
    return <Redirect to={dashboardPath} />;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex flex-1 flex-col items-center justify-center px-4 py-12">
        <Link href="/" className="absolute left-4 top-4 flex items-center gap-2 md:left-8 md:top-8">
          <ArrowLeft className="h-4 w-4" />
          <span className="text-sm font-medium">Back to Home</span>
        </Link>
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col items-center space-y-2 text-center">
            <div className="mx-auto w-12 h-12 bg-primary text-white flex items-center justify-center rounded-lg mb-4">
              <span className="text-xl font-bold">RH</span>
            </div>
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            <p className="text-sm text-muted-foreground">Enter your credentials to access the dashboard</p>
          </div>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="name@remotehero.com" {...field} />
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
                    <div className="flex items-center justify-between">
                      <FormLabel>Password</FormLabel>
                      <Link href="#" className="text-sm font-medium text-primary hover:underline">
                        Forgot password?
                      </Link>
                    </div>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>
          </Form>

          <div className="mt-4 text-center text-sm">
            <p className="text-muted-foreground">
              Need help? Contact{" "}
              <a href="mailto:support@remotehero.com" className="text-primary hover:underline">
                IT Support
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}