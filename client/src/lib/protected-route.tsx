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
        
        // Step 3: If a permission is required, fetch permissions
        if (requiredPermission) {
          try {
            const permissionsResponse = await fetch("/api/permissions");
            
            if (permissionsResponse.ok) {
              const permissionsData = await permissionsResponse.json();
              const userPermissions = permissionsData.permissions || [];
              
              // Check if user has the required permission
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
              const hasPermission = userData.role === "super_admin" || false;
              
              setAuthState({
                isLoading: false,
                isAuthenticated: true,
                user: userData,
                permissions: [],
                hasPermission,
              });
            }
          } catch (error) {
            console.error("Error fetching permissions:", error);
            setAuthState({
              isLoading: false,
              isAuthenticated: true,
              user: userData,
              permissions: [],
              hasPermission: false,
            });
          }
        } else {
          // No permission required, just authenticate
          setAuthState({
            isLoading: false,
            isAuthenticated: true,
            user: userData,
            permissions: [],
            hasPermission: true,
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

  // Show permission denied screen if authenticated but lacks permission
  if (!authState.hasPermission) {
    return (
      <Route path={path}>
        <div className="min-h-screen flex flex-col items-center justify-center p-4">
          <Alert variant="destructive" className="max-w-md mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Access Denied</AlertTitle>
            <AlertDescription>
              You don't have permission to access this page. Please contact your administrator if you believe this is an error.
            </AlertDescription>
          </Alert>
          <Button onClick={() => window.location.href = "/"}>
            Go to Dashboard
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
