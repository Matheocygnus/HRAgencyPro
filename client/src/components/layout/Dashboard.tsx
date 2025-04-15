import { ReactNode, useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { useMockAuth } from "@/hooks/use-mock-auth";
import { Badge } from "@/components/ui/badge";

export default function Dashboard({ children }: { children: ReactNode }) {
  const [isMobileOpen, setMobileOpen] = useState(false);
  const { user } = useMockAuth();
  
  // Function to get role display name
  const getRoleBadge = () => {
    if (!user) return null;
    
    const roleColors = {
      "super_admin": "bg-purple-600",
      "admin": "bg-blue-600", 
      "recruiter": "bg-emerald-600"
    };
    
    const roleName = 
      user.role === "super_admin" ? "Super Admin" : 
      user.role === "admin" ? "Admin" : "Recruiter";
    
    const colorClass = roleColors[user.role as keyof typeof roleColors] || "bg-primary";
    
    return (
      <Badge className={`${colorClass} hover:${colorClass} font-medium px-3 py-1`}>
        {roleName}
      </Badge>
    );
  };
  
  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <Sidebar isMobileOpen={isMobileOpen} setMobileOpen={setMobileOpen} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header setMobileOpen={setMobileOpen} />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {/* Role indicator */}
          {user && (
            <div className="mb-2 flex justify-end">
              {getRoleBadge()}
            </div>
          )}
          
          {children}
        </main>
      </div>
    </div>
  );
}
