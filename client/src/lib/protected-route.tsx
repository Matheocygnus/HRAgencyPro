import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { Redirect, Route } from "wouter";

export function ProtectedRoute({
  path,
  component: Component,
}: {
  path: string;
  component: () => React.JSX.Element;
}) {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      try {
        const response = await fetch('/api/user');
        
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        }
      } catch (error) {
        console.error("Auth check error:", error);
      } finally {
        setIsLoading(false);
      }
    }
    
    checkAuth();
  }, []);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <Route path={path}>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Route>
    );
  }

  // If not authenticated, redirect to login page
  if (!user) {
    return (
      <Route path={path}>
        <Redirect to="/login" />
      </Route>
    );
  }
  
  // Check if the user has the appropriate role for this route
  // For role-specific dashboards, redirect based on user role
  if (path === "/dashboard" && user.role !== "super_admin" && user.role !== "admin") {
    // Redirect non-admins to their appropriate dashboards
    if (user.role === "client") {
      return (
        <Route path={path}>
          <Redirect to="/client-dashboard" />
        </Route>
      );
    } else if (user.role === "hero") {
      return (
        <Route path={path}>
          <Redirect to="/hero-dashboard" />
        </Route>
      );
    } else if (user.role === "prospect") {
      return (
        <Route path={path}>
          <Redirect to="/prospect-dashboard" />
        </Route>
      );
    }
  } 
  
  // For role-specific dashboards, check user role
  if (path === "/client-dashboard" && user.role !== "client" && user.role !== "super_admin" && user.role !== "admin") {
    return (
      <Route path={path}>
        <Redirect to="/dashboard" />
      </Route>
    );
  }
  
  if (path === "/hero-dashboard" && user.role !== "hero" && user.role !== "super_admin" && user.role !== "admin") {
    return (
      <Route path={path}>
        <Redirect to="/dashboard" />
      </Route>
    );
  }
  
  if (path === "/prospect-dashboard" && user.role !== "prospect" && user.role !== "super_admin" && user.role !== "admin") {
    return (
      <Route path={path}>
        <Redirect to="/dashboard" />
      </Route>
    );
  }

  // If authenticated, render the protected component
  return (
    <Route path={path}>
      <Component />
    </Route>
  );
}
