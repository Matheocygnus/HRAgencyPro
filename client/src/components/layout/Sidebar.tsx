import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { MODULES } from "@/hooks/use-auth";
import { 
  LayoutDashboard, 
  Building2, 
  UserRound, 
  Medal, 
  FileCheck, 
  FileText, 
  Users, 
  Settings, 
  LogOut,
  Briefcase,
  FileSignature,
  ClipboardCheck,
  Shield,
  Building,
  UserCircle,
  UserCog
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Define sidebar navigation items with their corresponding permission modules
const navigation = [
  // Admin dashboards
  { name: "Admin Dashboard", path: "/", icon: LayoutDashboard, module: MODULES.DASHBOARD },
  { name: "Prospects", path: "/prospects", icon: UserRound, module: MODULES.PROSPECTS },
  { name: "Interviews", path: "/interviews", icon: FileCheck, module: MODULES.INTERVIEWS },
  { name: "Heroes", path: "/heroes", icon: Medal, module: MODULES.HEROES },
  { name: "Companies", path: "/clients", icon: Building2, module: MODULES.COMPANIES },
  { name: "Contracts", path: "/contracts", icon: FileSignature, module: MODULES.CONTRACTS },
  { name: "Invoices", path: "/invoices", icon: FileText, module: MODULES.INVOICES },
  
  // Role-specific dashboards
  { name: "Client Dashboard", path: "/client-dashboard", icon: Building, module: MODULES.CLIENT_DASHBOARD },
  { name: "Hero Dashboard", path: "/hero-dashboard", icon: UserCircle, module: MODULES.HERO_DASHBOARD },
  { name: "Prospect Dashboard", path: "/prospect-dashboard", icon: UserCog, module: MODULES.PROSPECT_DASHBOARD },
  
  // Admin management pages
  { name: "User Management", path: "/users", icon: Users, module: MODULES.USER_MANAGEMENT },
  { name: "Job Management", path: "/jobs", icon: Briefcase, module: MODULES.JOB_MANAGEMENT },
  { name: "Role Management", path: "/roles", icon: Shield, module: MODULES.ROLE_MANAGEMENT },
  { name: "System Settings", path: "/settings", icon: Settings, module: MODULES.SYSTEM_SETTINGS },
];

export default function Sidebar({ isMobileOpen, setMobileOpen }: { 
  isMobileOpen: boolean; 
  setMobileOpen: (open: boolean) => void;
}) {
  const [location] = useLocation();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  
  // Fetch user on component mount
  useEffect(() => {
    async function fetchUser() {
      try {
        const response = await fetch('/api/user');
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    }
    
    fetchUser();
  }, []);
  
  // Function to check permissions based on role
  const hasPermission = (module: string) => {
    if (!user) return false;
    
    // Super admins can access everything
    if (user.role === "super_admin") {
      return true;
    }
    
    // For now, admins have most permissions too
    if (user.role === "admin") {
      return true;
    }
    
    // Default fallback - show limited modules for other roles
    return ["dashboard", "client_dashboard", "prospect_dashboard", "hero_dashboard"].includes(module);
  };
  
  // Filter navigation items based on user permissions
  const mainNavigation = navigation.filter(item => hasPermission(item.module));

  const handleNavClick = () => {
    setMobileOpen(false);
  };

  const sidebarClasses = cn(
    "bg-primary w-64 flex-shrink-0 overflow-y-auto h-screen transition-all duration-300 ease-in-out z-40",
    isMobileOpen ? "fixed inset-y-0 left-0" : "hidden md:block"
  );

  return (
    <>
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}
      <aside className={sidebarClasses}>
        <div className="p-4 border-b border-blue-800 flex items-center">
          <div className="bg-white rounded-lg p-1.5 mr-3 flex items-center justify-center w-10 h-10">
            <span className="text-primary font-bold text-lg">RH</span>
          </div>
          <div className="text-white font-semibold text-lg">Remote <span className="font-bold">Hero</span></div>
        </div>
        
        <nav className="py-4">
          <ul>
            {mainNavigation.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.path} className="px-3 mb-1">
                  <div 
                    onClick={() => {
                      handleNavClick();
                      window.location.href = item.path;
                    }}
                    className={cn(
                      "flex items-center px-3 py-2.5 rounded-md text-sm font-medium cursor-pointer",
                      location === item.path
                        ? "bg-blue-700 text-white"
                        : "text-blue-100 hover:text-white hover:bg-blue-700"
                    )}
                  >
                    <Icon className="w-5 h-5 mr-3" />
                    <span>{item.name}</span>
                  </div>
                </li>
              );
            })}
          </ul>
          
          <div className="border-t border-blue-800 my-4 mx-4"></div>
          <div className="px-3">
            <button 
              onClick={async () => {
                setIsLoggingOut(true);
                try {
                  const response = await fetch('/api/logout', {
                    method: 'POST',
                  });
                  
                  if (response.ok) {
                    toast({
                      title: "Logged out successfully",
                      description: "You have been logged out of your account"
                    });
                    
                    // Hard redirect to login page
                    window.location.href = '/login';
                  } else {
                    throw new Error('Logout failed');
                  }
                } catch (error) {
                  toast({
                    title: "Logout failed",
                    description: "There was a problem logging out. Please try again.",
                    variant: "destructive"
                  });
                } finally {
                  setIsLoggingOut(false);
                }
              }}
              disabled={isLoggingOut}
              className="flex items-center px-3 py-2.5 rounded-md text-sm font-medium text-blue-100 hover:text-white hover:bg-blue-700 w-full"
            >
              <LogOut className="w-5 h-5 mr-3" />
              <span>{isLoggingOut ? "Signing out..." : "Sign Out"}</span>
            </button>
          </div>
        </nav>
      </aside>
    </>
  );
}
