import { useContext } from "react";
import { AuthContext } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";
import { Redirect, Route } from "wouter";

export function ProtectedRoute({
  path,
  component: Component,
}: {
  path: string;
  component: () => React.JSX.Element;
}) {
  // Use try/catch to handle potential absence of AuthProvider
  try {
    const authContext = useContext(AuthContext);
    if (!authContext) {
      // If we're not in an AuthProvider context, redirect to auth page
      return (
        <Route path={path}>
          <Redirect to="/auth" />
        </Route>
      );
    }
    
    const { user, isLoading } = authContext;

    if (isLoading) {
      return (
        <Route path={path}>
          <div className="flex items-center justify-center min-h-screen">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </Route>
      );
    }

    if (!user) {
      return (
        <Route path={path}>
          <Redirect to="/auth" />
        </Route>
      );
    }

    return (
      <Route path={path}>
        <Component />
      </Route>
    );
  } catch (error) {
    // In case of any auth-related error, redirect to the auth page
    return (
      <Route path={path}>
        <Redirect to="/auth" />
      </Route>
    );
  }
}
