import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";

const navigation = {
  main: [
    { name: "Dashboard", path: "/", icon: "fa-home" },
    { name: "Clients & Companies", path: "/clients", icon: "fa-building" },
    { name: "Prospects", path: "/prospects", icon: "fa-user-tie" },
    { name: "Heroes", path: "/heroes", icon: "fa-medal" },
    { name: "Contracts", path: "/contracts", icon: "fa-file-contract" },
    { name: "Invoices", path: "/invoices", icon: "fa-file-invoice-dollar" },
  ],
  admin: [
    { name: "User Management", path: "/users", icon: "fa-users-cog" },
    { name: "System Settings", path: "/settings", icon: "fa-cog" },
  ],
};

export default function Sidebar({ isMobileOpen, setMobileOpen }: { 
  isMobileOpen: boolean; 
  setMobileOpen: (open: boolean) => void;
}) {
  const [location] = useLocation();
  const { user } = useAuth();
  
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
        <div className="p-4 border-b border-primary-dark flex items-center">
          <div className="bg-white rounded-lg p-2 mr-2">
            <div className="flex items-center justify-center">
              <svg className="w-6 h-6 text-primary" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 6H20M4 12H20M4 18H11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="16" cy="18" r="3" stroke="currentColor" strokeWidth="2"/>
                <path d="M16 16.5L16 19.5M14.5 18L17.5 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
          </div>
          <div className="text-white font-semibold text-lg">REMOTE <span className="font-bold">HERO</span></div>
        </div>
        
        <nav className="p-4">
          <div className="mb-8">
            <div className="text-neutral-light text-xs font-semibold uppercase tracking-wider mb-2">Main</div>
            <ul>
              {navigation.main.map((item) => (
                <li key={item.path} className="mb-1">
                  <Link href={item.path} onClick={handleNavClick}>
                    <a className={cn(
                      "flex items-center px-3 py-2 rounded-md",
                      location === item.path
                        ? "text-white bg-primary-dark"
                        : "text-neutral-light hover:text-white hover:bg-primary-dark"
                    )}>
                      <i className={`fas ${item.icon} w-5 h-5 mr-3`}></i>
                      <span>{item.name}</span>
                    </a>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Admin Navigation Section - visible only to admins and super admins */}
          {isAdmin && (
            <div className="mb-8">
              <div className="text-neutral-light text-xs font-semibold uppercase tracking-wider mb-2">Administration</div>
              <ul>
                {navigation.admin.map((item) => (
                  <li key={item.path} className="mb-1">
                    {(item.path !== '/users' || isSuperAdmin) && (
                      <Link href={item.path} onClick={handleNavClick}>
                        <a className={cn(
                          "flex items-center px-3 py-2 rounded-md",
                          location === item.path
                            ? "text-white bg-primary-dark"
                            : "text-neutral-light hover:text-white hover:bg-primary-dark"
                        )}>
                          <i className={`fas ${item.icon} w-5 h-5 mr-3`}></i>
                          <span>{item.name}</span>
                        </a>
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </nav>
      </aside>
    </>
  );
}
