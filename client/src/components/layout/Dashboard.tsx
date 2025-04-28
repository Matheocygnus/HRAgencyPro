import { ReactNode, useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { useAuth } from "@/hooks/use-auth";
import { Badge } from "@/components/ui/badge";

export default function Dashboard({ children }: { children: ReactNode }) {
  const [isMobileOpen, setMobileOpen] = useState(false);
  const { user } = useAuth();
  
  // Function to get role display
  const getRoleBadge = () => {
    if (!user) return null;
    
    return (
      <Badge className="bg-primary hover:bg-primary font-medium px-3 py-1">
        {user.role || 'User'}
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
