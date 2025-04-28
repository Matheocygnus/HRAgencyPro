import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { ProtectedRoute } from "./lib/protected-route";
import NotFound from "@/pages/not-found";
import AuthPageSimple from "@/pages/auth-page-simple";
import LoginWrapper from "@/pages/login-wrapper";
import Dashboard from "@/pages/dashboard";
import DashboardDev from "@/pages/dashboard-dev";
import Prospects from "@/pages/prospects";
import Clients from "@/pages/clients";
import Heroes from "@/pages/heroes";
import HeroDetail from "@/pages/hero-detail";
import CompanyDetail from "@/pages/company-detail";
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
import ClientDashboard from "@/pages/client-dashboard";
import HeroDashboard from "@/pages/hero-dashboard";
import ProspectDashboard from "@/pages/prospect-dashboard";
import RoleManagement from "@/pages/role-management";

function Router() {
  return (
    <Switch>
      {/* Authentication page */}
      <Route path="/login">
        <LoginWrapper />
      </Route>
      <Route path="/auth">
        <LoginWrapper />
      </Route>
      
      {/* Public careers page */}
      <Route path="/careers">
        <Careers />
      </Route>

      {/* Protected routes - require authentication */}
      
      {/* Main dashboard - accessible from / */}
      <ProtectedRoute path="/" component={Dashboard} />
      <ProtectedRoute path="/dashboard" component={Dashboard} />
      
      {/* Specialized pages with appropriate visualizations */}
      <ProtectedRoute path="/prospects" component={Prospects} />
      <ProtectedRoute path="/clients" component={Clients} />
      <ProtectedRoute path="/heroes" component={Heroes} />
      <ProtectedRoute path="/hero/:id" component={HeroDetail} />
      <ProtectedRoute path="/company/:id" component={CompanyDetail} />
      <ProtectedRoute path="/contracts" component={Contracts} />
      <ProtectedRoute path="/invoices" component={Invoices} />
      <ProtectedRoute path="/interviews" component={Interviews} />
      <ProtectedRoute path="/users" component={UserManagement} />
      <ProtectedRoute path="/user-management" component={UserManagement} />
      <ProtectedRoute path="/settings" component={Settings} />
      
      {/* Role management */}
      <ProtectedRoute path="/roles" component={RoleManagement} />
      
      {/* Job management */}
      <ProtectedRoute path="/jobs" component={JobManagement} />
      <ProtectedRoute path="/job-management" component={JobManagement} />
      
      {/* Job requests */}
      <ProtectedRoute path="/job-requests" component={JobRequests} />
      
      {/* Job request management (admin) */}
      <ProtectedRoute path="/job-request-management" component={JobRequestManagement} />
      
      {/* Job applications page */}
      <ProtectedRoute path="/job-applications" component={JobApplications} />
      
      {/* Role-specific dashboard pages */}
      <ProtectedRoute path="/client-dashboard" component={ClientDashboard} />
      <ProtectedRoute path="/hero-dashboard" component={HeroDashboard} />
      <ProtectedRoute path="/prospect-dashboard" component={ProspectDashboard} />
      
      {/* Development page */}
      
      {/* Original dev page as fallback */}
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
    <>
      <Router />
      <Toaster />
    </>
  );
}

export default App;
