import { useState } from "react";
import { useLocation, useRoute } from "wouter";
import { useMockAuth } from "@/hooks/use-mock-auth";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

// Map of route to header title
const routeTitles: Record<string, string> = {
  "/": "Dashboard",
  "/clients": "Clients & Companies",
  "/prospects": "Prospects",
  "/heroes": "Heroes",
  "/contracts": "Contracts",
  "/invoices": "Invoices",
  "/users": "User Management",
  "/settings": "System Settings",
};

export default function Header({ 
  setMobileOpen 
}: { 
  setMobileOpen: (open: boolean) => void;
}) {
  const [location] = useLocation();
  const { user, logoutMutation } = useMockAuth();
  const pageTitle = routeTitles[location] || "Not Found";
  
  const handleLogout = () => {
    logoutMutation.mutate();
  };
  
  const userInitials = user ? 
    `${user.firstName.charAt(0)}${user.lastName.charAt(0)}` : 
    "?";
  
  const userFullName = user ? 
    `${user.firstName} ${user.lastName}` : 
    "User";

  return (
    <header className="bg-white border-b border-neutral-light">
      <div className="flex items-center justify-between px-6 py-3">
        <div className="flex items-center">
          <button 
            className="md:hidden text-neutral-darkest mr-4"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <i className="fas fa-bars text-xl"></i>
          </button>
          <h1 className="text-xl font-semibold">{pageTitle}</h1>
        </div>
        
        <div className="flex items-center">
          <button className="mr-4 relative text-neutral-dark hover:text-neutral-darkest">
            <i className="far fa-bell text-xl"></i>
            <span className="absolute top-0 right-0 bg-status-error w-2 h-2 rounded-full"></span>
          </button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center">
                <Avatar className="w-8 h-8 mr-2">
                  <AvatarImage src={user?.avatar} />
                  <AvatarFallback className="bg-primary text-white">{userInitials}</AvatarFallback>
                </Avatar>
                <span className="hidden md:block font-medium">{userFullName}</span>
                <i className="fas fa-chevron-down ml-2 text-xs text-neutral-medium"></i>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="px-2 py-1.5 text-sm font-medium">
                {user && (
                  <div className="flex flex-col">
                    <span>{userFullName}</span>
                    <span className="text-xs text-neutral-medium">{user.email}</span>
                  </div>
                )}
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer">
                <i className="fas fa-user-circle mr-2"></i>
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <i className="fas fa-cog mr-2"></i>
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="cursor-pointer text-red-600" 
                onClick={handleLogout}
                disabled={logoutMutation.isPending}
              >
                {logoutMutation.isPending ? (
                  <i className="fas fa-spinner fa-spin mr-2"></i>
                ) : (
                  <i className="fas fa-sign-out-alt mr-2"></i>
                )}
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
