import { useEffect, useState } from "react";
import { Loader2, AlertCircle } from "lucide-react";
import { Redirect, Route } from "wouter";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface ProtectedRouteProps {
  path: string;
  component: () => React.JSX.Element;
  requiredPermission?: string;
}

export function ProtectedRoute({
  path,
  component: Component,
  requiredPermission,
}: ProtectedRouteProps) {
  const [authState, setAuthState] = useState<{
    isLoading: boolean;
    isAuthenticated: boolean;
    user: any | null;
    permissions: string[];
    hasPermission: boolean;
  }>({
    isLoading: true,
    isAuthenticated: false,
    user: null,
    permissions: [],
    hasPermission: false,
  });

  // Check authentication status and permissions
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Step 1: Check if user is authenticated
        const userResponse = await fetch("/api/user");
        
        if (!userResponse.ok) {
          setAuthState({
            isLoading: false,
            isAuthenticated: false,
            user: null,
            permissions: [],
            hasPermission: false,
          });
          return;
        }
        
        // Step 2: Get user data
        const userData = await userResponse.json();
        
        // Step 3: Always fetch permissions for redirection and permission checks
        try {
          const permissionsResponse = await fetch("/api/permissions");
          
          if (permissionsResponse.ok) {
            const permissionsData = await permissionsResponse.json();
            const userPermissions = permissionsData.permissions || [];
            
            // Check if user has the required permission (if any)
            const hasRequiredPermission = !requiredPermission || 
              userPermissions.includes(requiredPermission);
              
            setAuthState({
              isLoading: false,
              isAuthenticated: true,
              user: userData,
              permissions: userPermissions,
              hasPermission: hasRequiredPermission,
            });
          } else {
            // Fallback to super_admin check if permissions endpoint fails
            const hasPermission = userData.role === "super_admin" || !requiredPermission;
            
            // If super_admin, they have all permissions by default
            const defaultPermissions = userData.role === "super_admin" ? 
              ["dashboard", "client_dashboard", "hero_dashboard", "prospect_dashboard"] : [];
            
            setAuthState({
              isLoading: false,
              isAuthenticated: true,
              user: userData,
              permissions: defaultPermissions,
              hasPermission,
            });
          }
        } catch (error) {
          console.error("Error fetching permissions:", error);
          
          // Fallback permissions for error case
          const defaultPermissions = userData.role === "super_admin" ? 
            ["dashboard", "client_dashboard", "hero_dashboard", "prospect_dashboard"] : [];
            
          setAuthState({
            isLoading: false,
            isAuthenticated: true,
            user: userData,
            permissions: defaultPermissions,
            hasPermission: userData.role === "super_admin" || !requiredPermission,
          });
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        setAuthState({
          isLoading: false,
          isAuthenticated: false,
          user: null,
          permissions: [],
          hasPermission: false,
        });
      }
    };

    checkAuth();
  }, [requiredPermission]);

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
  
  // If this is the main path, check for role-specific dashboards
  if (path === "/" && authState.user) {
    // Get the user's role and permissions
    const roleFromServer = authState.user.role || '';
    const permissions = authState.permissions || [];
    
    // Normalize the role to lowercase for consistent comparison
    const userRole = roleFromServer.toLowerCase();
    
    // Determine the correct dashboard based on permissions and role
    let dashboardPath = "/dashboard"; // Default dashboard
    
    console.log("User role:", roleFromServer, "Normalized role:", userRole, "Permissions:", permissions);
    
    // Role-based dashboard mapping with normalized role comparison
    if (userRole === "client" && permissions.includes("client_dashboard")) {
      console.log("Redirecting to client dashboard");
      dashboardPath = "/client-dashboard";
    } else if (userRole === "hero" && permissions.includes("hero_dashboard")) {
      console.log("Redirecting to hero dashboard");
      dashboardPath = "/hero-dashboard";
    } else if (userRole === "prospect" && permissions.includes("prospect_dashboard")) {
      console.log("Redirecting to prospect dashboard");
      dashboardPath = "/prospect-dashboard";
    } else if (permissions.includes("dashboard")) {
      // Use admin dashboard if they have permission
      console.log("Redirecting to admin dashboard");
      dashboardPath = "/dashboard";
    }
    
    // Redirect to the appropriate dashboard
    return (
      <Route path={path}>
        <Redirect to={dashboardPath} />
      </Route>
    );
  }

  // Show permission denied screen if authenticated but lacks permission
  if (!authState.hasPermission) {
    // Get user's role and permissions to suggest an appropriate redirection
    const roleFromServer = authState.user?.role || '';
    const permissions = authState.permissions || [];
    
    // Normalize the role to lowercase for consistent comparison
    const userRole = roleFromServer.toLowerCase();
    
    // Determine which dashboard they should go to instead
    let suggestedPath = "/";
    let suggestedText = "Go to Dashboard";
    
    if (userRole === "client" && permissions.includes("client_dashboard")) {
      suggestedPath = "/client-dashboard";
      suggestedText = "Go to Client Dashboard";
    } else if (userRole === "hero" && permissions.includes("hero_dashboard")) {
      suggestedPath = "/hero-dashboard";
      suggestedText = "Go to Hero Dashboard";
    } else if (userRole === "prospect" && permissions.includes("prospect_dashboard")) {
      suggestedPath = "/prospect-dashboard";
      suggestedText = "Go to Prospect Dashboard";
    }
    
    return (
      <Route path={path}>
        <div className="min-h-screen flex flex-col items-center justify-center p-4">
          <Alert variant="destructive" className="max-w-md mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Access Denied</AlertTitle>
            <AlertDescription>
              <p>You don't have permission to access {path}.</p>
              <p className="mt-2">Your role is: <strong>{roleFromServer}</strong></p>
              <p className="mt-1">If you believe this is an error, please contact your administrator.</p>
            </AlertDescription>
          </Alert>
          <Button onClick={() => window.location.href = suggestedPath}>
            {suggestedText}
          </Button>
        </div>
      </Route>
    );
  }

  // Render the protected component if authenticated and authorized
  return (
    <Route path={path}>
      <Component />
    </Route>
  );
}
