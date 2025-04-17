import { Link, useLocation } from "wouter";
import { useMockAuth, MODULES } from "@/hooks/use-mock-auth";
import { cn } from "@/lib/utils";
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
  const { user, hasPermission } = useMockAuth();
  
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
              onClick={handleNavClick}
              className="flex items-center px-3 py-2.5 rounded-md text-sm font-medium text-blue-100 hover:text-white hover:bg-blue-700 w-full"
            >
              <LogOut className="w-5 h-5 mr-3" />
              <span>Sign Out</span>
            </button>
          </div>
        </nav>
      </aside>
    </>
  );
}
