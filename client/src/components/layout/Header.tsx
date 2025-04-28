import { useState, useEffect } from "react";
import { useLocation, useRoute } from "wouter";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { Bell, Search, User, Settings, LogOut, Menu } from "lucide-react";

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
          <div className="relative mr-5">
            <button className="text-slate-600 hover:text-slate-900 p-1">
              <Bell className="h-5 w-5" />
            </button>
            <span className="absolute top-0 right-0 bg-red-500 w-2 h-2 rounded-full"></span>
          </div>
          
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
              <DropdownMenuItem className="cursor-pointer">
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
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
    </header>
  );
}
