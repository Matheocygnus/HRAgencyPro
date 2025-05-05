import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { ProtectedRoute } from "./lib/protected-route";
import NotFound from "@/pages/not-found";
import AuthPageSimple from "@/pages/auth-page-simple";
import LoginPage from "@/pages/login-page";
import Dashboard from "@/pages/dashboard";
import DashboardDev from "@/pages/dashboard-dev";
import Prospects from "@/pages/prospects";
import ProspectDatabase from "@/pages/prospect-database";
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
        <LoginPage />
      </Route>
      <Route path="/auth">
        <LoginPage />
      </Route>
      
      {/* Public careers page */}
      <Route path="/careers">
        <Careers />
      </Route>

      {/* Protected routes - require authentication */}
      
      {/* Main dashboard - accessible from / */}
      <ProtectedRoute path="/" component={Dashboard} requiredPermission="dashboard" />
      <ProtectedRoute path="/dashboard" component={Dashboard} requiredPermission="dashboard" />
      
      {/* Specialized pages with appropriate visualizations */}
      <ProtectedRoute path="/prospects" component={Prospects} requiredPermission="prospects" />
      <ProtectedRoute path="/prospect-database" component={ProspectDatabase} requiredPermission="prospects" />
      <ProtectedRoute path="/clients" component={Clients} requiredPermission="companies" />
      <ProtectedRoute path="/heroes" component={Heroes} requiredPermission="heroes" />
      <ProtectedRoute path="/hero/:id" component={HeroDetail} requiredPermission="hero_detail" />
      <ProtectedRoute path="/company/:id" component={CompanyDetail} requiredPermission="company_detail" />
      <ProtectedRoute path="/contracts" component={Contracts} requiredPermission="contracts" />
      <ProtectedRoute path="/invoices" component={Invoices} requiredPermission="invoices" />
      <ProtectedRoute path="/interviews" component={Interviews} requiredPermission="interviews" />
      <ProtectedRoute path="/users" component={UserManagement} requiredPermission="user_management" />
      <ProtectedRoute path="/user-management" component={UserManagement} requiredPermission="user_management" />
      <ProtectedRoute path="/settings" component={Settings} requiredPermission="settings" />
      
      {/* Role management */}
      <ProtectedRoute path="/roles" component={RoleManagement} requiredPermission="role_management" />
      
      {/* Job management */}
      <ProtectedRoute path="/jobs" component={JobManagement} requiredPermission="job_management" />
      <ProtectedRoute path="/job-management" component={JobManagement} requiredPermission="job_management" />
      
      {/* Job requests */}
      <ProtectedRoute path="/job-requests" component={JobRequests} requiredPermission="job_requests" />
      
      {/* Job request management (admin) */}
      <ProtectedRoute path="/job-request-management" component={JobRequestManagement} requiredPermission="job_management" />
      
      {/* Job applications page */}
      <ProtectedRoute path="/job-applications" component={JobApplications} requiredPermission="job_management" />
      
      {/* Role-specific dashboard pages */}
      <ProtectedRoute path="/client-dashboard" component={ClientDashboard} requiredPermission="client_dashboard" />
      <ProtectedRoute path="/hero-dashboard" component={HeroDashboard} requiredPermission="hero_dashboard" />
      <ProtectedRoute path="/prospect-dashboard" component={ProspectDashboard} requiredPermission="prospect_dashboard" />
      
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
