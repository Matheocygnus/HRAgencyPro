import { ReactNode, useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { useAuth } from "@/hooks/use-auth";

export default function Dashboard({ children }: { children: ReactNode }) {
  const [isMobileOpen, setMobileOpen] = useState(false);
  const { user } = useAuth();
  
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar isMobileOpen={isMobileOpen} setMobileOpen={setMobileOpen} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header setMobileOpen={setMobileOpen} />
        
        <main className="flex-1 overflow-y-auto p-6">
          {/* Role indicator */}
          {user && (
            <div className="mb-6">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary-light text-white">
                {user.role === "super_admin" ? "Super Admin" : 
                 user.role === "admin" ? "Admin" : "Recruiter"}
              </span>
            </div>
          )}
          
          {children}
        </main>
      </div>
    </div>
  );
}
