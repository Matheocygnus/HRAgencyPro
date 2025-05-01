import { useState, useEffect } from "react";
import { useLocation, useRoute } from "wouter";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { Search, User, LogOut, Menu, KeyRound, Save } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Map of route to header title
const routeTitles: Record<string, string> = {
  "/": "Dashboard",
  "/clients": "Clients & Companies",
  "/prospects": "Prospects",
  "/heroes": "Heroes",
  "/contracts": "Contracts",
  "/invoices": "Invoices",
  "/users": "User Management",
  "/settings": "System Settings",
};

export default function Header({ 
  setMobileOpen 
}: { 
  setMobileOpen: (open: boolean) => void;
}) {
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  const [userData, setUserData] = useState<any>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isUserInfoDialogOpen, setIsUserInfoDialogOpen] = useState(false);
  const [isChangePasswordDialogOpen, setIsChangePasswordDialogOpen] = useState(false);
  const pageTitle = routeTitles[location] || "Not Found";
  
  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('/api/user');
        if (response.ok) {
          const data = await response.json();
          setUserData(data);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    
    fetchUserData();
  }, []);
  
  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      const response = await fetch('/api/logout', {
        method: 'POST',
      });
      
      if (response.ok) {
        toast({
          title: "Logged out successfully",
          description: "You have been signed out.",
        });
        
        // Force reload and redirect to login
        window.location.href = "/login";
      } else {
        throw new Error("Logout failed");
      }
    } catch (error) {
      toast({
        title: "Logout failed",
        description: "Please try again",
        variant: "destructive"
      });
    } finally {
      setIsLoggingOut(false);
    }
  };
  
  const userInitials = userData ? 
    `${userData.firstName?.charAt(0) || ''}${userData.lastName?.charAt(0) || ''}` : 
    "?";
  
  const userFullName = userData ? 
    `${userData.firstName || ''} ${userData.lastName || ''}` : 
    "User";

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center">
          <button 
            className="md:hidden text-slate-700 mr-3"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="h-6 w-6" />
          </button>
          <h1 className="text-xl font-semibold md:hidden">{pageTitle}</h1>
        </div>
        
        <div className="hidden md:flex md:w-96 lg:w-[500px] items-center relative">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search..."
              className="w-full rounded-full bg-slate-100 border-transparent px-10 py-2 focus-visible:ring-1"
            />
          </div>
        </div>
        
        <div className="flex items-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center">
                <Avatar className="w-8 h-8 ring-2 ring-slate-100">
                  <AvatarImage src={userData?.avatar || undefined} />
                  <AvatarFallback className="bg-primary text-white font-medium">{userInitials}</AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="px-3 py-2 text-sm font-medium">
                {userData && (
                  <div className="flex flex-col">
                    <span className="font-semibold">{userFullName}</span>
                    <span className="text-xs text-slate-500 mt-0.5">{userData.email}</span>
                  </div>
                )}
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer" onClick={() => setIsUserInfoDialogOpen(true)}>
                <User className="mr-2 h-4 w-4" />
                <span>User Info</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer" onClick={() => setIsChangePasswordDialogOpen(true)}>
                <KeyRound className="mr-2 h-4 w-4" />
                <span>Change Password</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="cursor-pointer text-red-600" 
                onClick={handleLogout}
                disabled={isLoggingOut}
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sign out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      {/* User Info Dialog */}
      <Dialog open={isUserInfoDialogOpen} onOpenChange={setIsUserInfoDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>User Information</DialogTitle>
            <DialogDescription>
              View and update your profile information.
            </DialogDescription>
          </DialogHeader>
          
          {userData && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="username" className="text-right">
                  Username
                </Label>
                <Input id="username" value={userData.username} disabled className="col-span-3 bg-gray-100" />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  Email
                </Label>
                <Input id="email" value={userData.email} disabled className="col-span-3 bg-gray-100" />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="firstName" className="text-right">
                  First Name
                </Label>
                <Input 
                  id="firstName" 
                  value={userData.firstName || ''} 
                  className="col-span-3"
                  onChange={(e) => setUserData({...userData, firstName: e.target.value})}
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="lastName" className="text-right">
                  Last Name
                </Label>
                <Input 
                  id="lastName" 
                  value={userData.lastName || ''} 
                  className="col-span-3"
                  onChange={(e) => setUserData({...userData, lastName: e.target.value})}
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="avatar" className="text-right">
                  Avatar URL
                </Label>
                <Input 
                  id="avatar" 
                  value={userData.avatar || ''} 
                  className="col-span-3"
                  onChange={(e) => setUserData({...userData, avatar: e.target.value})}
                  placeholder="https://example.com/avatar.jpg"
                />
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button 
              type="submit"
              onClick={async () => {
                try {
                  const response = await fetch(`/api/users/${userData.id}`, {
                    method: 'PATCH',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                      firstName: userData.firstName,
                      lastName: userData.lastName,
                      avatar: userData.avatar,
                    }),
                  });
                  
                  if (response.ok) {
                    toast({
                      title: "Profile updated",
                      description: "Your profile information has been updated successfully.",
                    });
                    setIsUserInfoDialogOpen(false);
                  } else {
                    throw new Error("Failed to update profile");
                  }
                } catch (error) {
                  toast({
                    title: "Update failed",
                    description: "There was a problem updating your profile.",
                    variant: "destructive"
                  });
                }
              }}
            >
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Change Password Dialog */}
      <Dialog open={isChangePasswordDialogOpen} onOpenChange={setIsChangePasswordDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
            <DialogDescription>
              Update your password to a new secure one.
            </DialogDescription>
          </DialogHeader>
          
          {userData && (
            <PasswordChangeForm userId={userData.id} onComplete={() => setIsChangePasswordDialogOpen(false)} />
          )}
        </DialogContent>
      </Dialog>
    </header>
  );
}

// Password change form with validation
const passwordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
  confirmPassword: z.string().min(1, "Please confirm your password"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

function PasswordChangeForm({ userId, onComplete }: { userId: number, onComplete: () => void }) {
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
    },
  });
  
  async function onSubmit(values: z.infer<typeof passwordSchema>) {
    try {
      const response = await fetch(`/api/users/${userId}/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword: values.currentPassword,
          newPassword: values.newPassword,
        }),
      });
      
      if (response.ok) {
        toast({
          title: "Password updated",
          description: "Your password has been changed successfully.",
        });
        onComplete();
      } else {
        const data = await response.json();
        throw new Error(data.message || "Failed to update password");
      }
    } catch (error: any) {
      toast({
        title: "Password change failed",
        description: error.message || "There was a problem updating your password.",
        variant: "destructive"
      });
    }
  }
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="currentPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Current Password</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="newPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>New Password</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm New Password</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <DialogFooter>
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? (
              <>
                <span className="mr-2">Updating...</span>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></span>
              </>
            ) : (
              "Update Password"
            )}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
