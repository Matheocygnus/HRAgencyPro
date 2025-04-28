import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { Redirect, Route } from "wouter";

export function ProtectedRoute({
  path,
  component: Component,
}: {
  path: string;
  component: () => React.JSX.Element;
}) {
  const [authState, setAuthState] = useState<{ 
    isLoading: boolean;
    isAuthenticated: boolean;
  }>({
    isLoading: true,
    isAuthenticated: false
  });
  
  // Check authentication status directly with the API instead of using context
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/user');
        if (response.ok) {
          setAuthState({
            isLoading: false,
            isAuthenticated: true
          });
        } else {
          setAuthState({
            isLoading: false,
            isAuthenticated: false
          });
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        setAuthState({
          isLoading: false,
          isAuthenticated: false
        });
      }
    };
    
    checkAuth();
  }, []);
  
  // Show loading state
  if (authState.isLoading) {
    return (
      <Route path={path}>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Route>
    );
  }
  
  // Redirect to login if not authenticated
  if (!authState.isAuthenticated) {
    return (
      <Route path={path}>
        <Redirect to="/login" />
      </Route>
    );
  }
  
  // Render the protected component if authenticated
  return (
    <Route path={path}>
      <Component />
    </Route>
  );
}
