import { ReactNode, useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { Badge } from "@/components/ui/badge";

export default function Dashboard({ children }: { children: ReactNode }) {
  const [isMobileOpen, setMobileOpen] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  
  // Fetch user data directly
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
  
  // Function to get role display
  const getRoleBadge = () => {
    if (!userData) return null;
    
    return (
      <Badge className="bg-primary hover:bg-primary font-medium px-3 py-1">
        {userData.role || 'User'}
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
          {userData && (
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
