import { ReactNode, useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

// Use static mock user data for development
const mockUser = {
  id: 1,
  username: "admin",
  email: "admin@remotehero.com",
  firstName: "Admin",
  lastName: "User",
  role: "super_admin",
  password: "hashed_password", // This would be hashed in a real scenario
  createdAt: new Date(),
  updatedAt: new Date()
};

export default function DashboardDev({ children }: { children: ReactNode }) {
  const [isMobileOpen, setMobileOpen] = useState(false);
  const user = mockUser; // Use mock user directly
  
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar isMobileOpen={isMobileOpen} setMobileOpen={setMobileOpen} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header setMobileOpen={setMobileOpen} />
        
        <main className="flex-1 overflow-y-auto p-6">
          {/* Role indicator */}
          {user && (
            <div className="mb-6">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary text-primary-foreground">
                {user.role === "super_admin" ? "Super Admin" : 
                 user.role === "admin" ? "Admin" : "Recruiter"}
              </span>
              <span className="ml-2 text-xs text-muted-foreground">(Development Mode)</span>
            </div>
          )}
          
          {children}
        </main>
      </div>
    </div>
  );
}