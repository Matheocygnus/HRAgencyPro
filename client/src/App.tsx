import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { ProtectedRoute, ClientRoute, AdminRoute } from "./lib/protected-route";
import { AuthProvider } from "@/hooks/use-auth";
import NotFound from "@/pages/not-found";
import AuthPage from "@/pages/auth-page";
import Dashboard from "@/pages/dashboard";
import DashboardDev from "@/pages/dashboard-dev";
import Prospects from "@/pages/prospects";
import Clients from "@/pages/clients";
import ClientProfile from "@/pages/client-profile";
import Heroes from "@/pages/heroes";
import Contracts from "@/pages/contracts";
import Invoices from "@/pages/invoices";
import Interviews from "@/pages/interviews";
import UserManagement from "@/pages/user-management";
import Settings from "@/pages/settings";
import Careers from "@/pages/careers";
import JobManagement from "@/pages/job-management";
import JobRequests from "@/pages/job-requests";
import JobRequestManagement from "@/pages/job-request-management";
import JobApplications from "@/pages/job-applications";

function Router() {
  return (
    <Switch>
      {/* Authentication page - publicly accessible */}
      <Route path="/auth">
        <AuthPage />
      </Route>
      
      {/* Public careers page */}
      <Route path="/careers">
        <Careers />
      </Route>
      
      {/* Admin and staff pages - protected routes */}
      <ProtectedRoute path="/" component={Dashboard} />
      <ProtectedRoute path="/dashboard" component={Dashboard} />
      <ProtectedRoute path="/prospects" component={Prospects} />
      <AdminRoute path="/clients" component={Clients} />
      
      {/* Client profile - accessible by admins or the specific client */}
      <ProtectedRoute path="/client/:id" component={ClientProfile} />
      
      <ProtectedRoute path="/heroes" component={Heroes} />
      <ProtectedRoute path="/contracts" component={Contracts} />
      <ProtectedRoute path="/invoices" component={Invoices} />
      <ProtectedRoute path="/interviews" component={Interviews} />
      <AdminRoute path="/users" component={UserManagement} />
      <ProtectedRoute path="/settings" component={Settings} />
      
      {/* Job management */}
      <ProtectedRoute path="/jobs" component={JobManagement} />
      
      {/* Job requests */}
      <ProtectedRoute path="/job-requests" component={JobRequests} />
      
      {/* Job request management (admin only) */}
      <AdminRoute path="/job-request-management" component={JobRequestManagement} />
      
      {/* Job applications page */}
      <ProtectedRoute path="/job-applications" component={JobApplications} />
      
      {/* Dev mode only */}
      <Route path="/dev">
        <DashboardDev />
      </Route>
      
      {/* 404 page for non-existing routes */}
      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router />
      <Toaster />
    </AuthProvider>
  );
}

export default App;
