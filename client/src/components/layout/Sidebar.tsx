import { Link, useLocation } from "wouter";
import { useMockAuth } from "@/hooks/use-mock-auth";
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
  ClipboardCheck
} from "lucide-react";

const navigation = {
  main: [
    { name: "Dashboard", path: "/", icon: LayoutDashboard },
    { name: "Prospects", path: "/prospects", icon: UserRound },
    { name: "Interviews", path: "/interviews", icon: FileCheck },
    { name: "Heroes", path: "/heroes", icon: Medal },
    { name: "Companies", path: "/clients", icon: Building2 },
    { name: "Contracts", path: "/contracts", icon: FileSignature },
    { name: "Invoices", path: "/invoices", icon: FileText },
  ],
  admin: [
    { name: "User Management", path: "/users", icon: Users },
    { name: "Job Management", path: "/jobs", icon: Briefcase },
    { name: "System Settings", path: "/settings", icon: Settings },
  ],
};

export default function Sidebar({ isMobileOpen, setMobileOpen }: { 
  isMobileOpen: boolean; 
  setMobileOpen: (open: boolean) => void;
}) {
  const [location] = useLocation();
  const { user } = useMockAuth();
  
  const isAdmin = user && (user.role === "admin" || user.role === "super_admin");
  const isSuperAdmin = user && user.role === "super_admin";

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
            {navigation.main.map((item) => {
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
          
          {/* Admin Navigation Section - visible only to admins and super admins */}
          {isAdmin && (
            <>
              <div className="border-t border-blue-800 my-4 mx-4"></div>
              <ul>
                {navigation.admin.map((item) => {
                  const Icon = item.icon;
                  return (
                    <li key={item.path} className="px-3 mb-1">
                      {(item.path !== '/users' || isSuperAdmin) && (
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
                      )}
                    </li>
                  );
                })}
              </ul>
            </>
          )}
          
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
