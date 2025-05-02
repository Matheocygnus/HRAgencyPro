import { ReactNode, useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { Badge } from "@/components/ui/badge";
import { 
  Select, 
  SelectContent, 
  SelectGroup, 
  SelectItem, 
  SelectLabel, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { useLocation } from "wouter";

export default function Dashboard({ children }: { children: ReactNode }) {
  const [isMobileOpen, setMobileOpen] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [clients, setClients] = useState<any[]>([]);
  const [selectedClientId, setSelectedClientId] = useState<string>("");
  const [permissions, setPermissions] = useState<string[]>([]);
  const [, setLocation] = useLocation();
  
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
  
  // Fetch permissions
  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const response = await fetch('/api/permissions');
        if (response.ok) {
          const data = await response.json();
          setPermissions(data.permissions || []);
        }
      } catch (error) {
        console.error("Error fetching permissions:", error);
      }
    };
    
    fetchPermissions();
  }, []);
  
  // Fetch clients for super admin
  useEffect(() => {
    const fetchClients = async () => {
      if (userData?.role === 'super_admin') {
        try {
          const response = await fetch('/api/clients');
          if (response.ok) {
            const data = await response.json();
            setClients(data);
          }
        } catch (error) {
          console.error("Error fetching clients:", error);
        }
      }
    };
    
    if (userData) {
      fetchClients();
    }
  }, [userData]);
  
  // Handle client selection change
  const handleClientChange = (clientId: string) => {
    setSelectedClientId(clientId);
    setLocation(`/client-dashboard?id=${clientId}`);
  };
  
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
          {/* Role indicator and super admin controls */}
          {userData && (
            <div className="mb-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              {/* Super Admin Client Selector */}
              {userData.role === 'super_admin' && permissions.includes('client_dashboard') && (
                <div className="w-full md:w-64">
                  <Select value={selectedClientId} onValueChange={handleClientChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a client to view" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Clients</SelectLabel>
                        {clients.map((client) => (
                          <SelectItem key={client.id} value={String(client.id)}>
                            {client.name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              )}
              
              <div className="flex justify-end">
                {getRoleBadge()}
              </div>
            </div>
          )}
          
          {children}
        </main>
      </div>
    </div>
  );
}
