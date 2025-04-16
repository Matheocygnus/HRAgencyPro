import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";
import { Redirect, Route } from "wouter";

interface ProtectedRouteProps {
  path: string;
  component: React.ComponentType<any>;
  requiredRole?: "client" | "admin" | "recruiter";
}

export function ProtectedRoute({
  path,
  component: Component,
  requiredRole,
}: ProtectedRouteProps) {
  const { user, isLoading, isAdmin, isClient } = useAuth();

  // Show loading state while authentication is being checked
  if (isLoading) {
    return (
      <Route path={path}>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Route>
    );
  }

  // If no user or the user doesn't have the required role, redirect to login
  if (!user) {
    return (
      <Route path={path}>
        <Redirect to="/auth" />
      </Route>
    );
  }

  // Role-based access check
  if (requiredRole) {
    if (requiredRole === "admin" && !isAdmin) {
      return (
        <Route path={path}>
          <Redirect to="/" />
        </Route>
      );
    }

    if (requiredRole === "client" && !isClient) {
      return (
        <Route path={path}>
          <Redirect to="/" />
        </Route>
      );
    }

    if (requiredRole === "recruiter" && user.role !== "recruiter") {
      return (
        <Route path={path}>
          <Redirect to="/" />
        </Route>
      );
    }
  }

  // If the user is authenticated and has the required role, render the component
  return (
    <Route path={path}>
      <Component />
    </Route>
  );
}

export function ClientRoute({ path, component }: { path: string; component: React.ComponentType<any> }) {
  return <ProtectedRoute path={path} component={component} requiredRole="client" />;
}

export function AdminRoute({ path, component }: { path: string; component: React.ComponentType<any> }) {
  return <ProtectedRoute path={path} component={component} requiredRole="admin" />;
}