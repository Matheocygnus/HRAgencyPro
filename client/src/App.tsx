import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { ProtectedRoute } from "./lib/protected-route";
import NotFound from "@/pages/not-found";
import AuthPageSimple from "@/pages/auth-page-simple";
import LoginPage from "@/pages/login-page";
import Dashboard from "@/pages/dashboard";
import DashboardDev from "@/pages/dashboard-dev";
import Prospects from "@/pages/prospects";
import Clients from "@/pages/clients";
import Heroes from "@/pages/heroes";
import Contracts from "@/pages/contracts";
import Invoices from "@/pages/invoices";
import Interviews from "@/pages/interviews";
import UserManagement from "@/pages/user-management";
import Settings from "@/pages/settings";
import Careers from "@/pages/careers";
import JobManagement from "@/pages/job-management";

function Router() {
  return (
    <Switch>
      {/* Main dashboard - accessible from / */}
      <Route path="/">
        <Dashboard />
      </Route>
      <Route path="/dashboard">
        <Dashboard />
      </Route>
      
      {/* Specialized pages with appropriate visualizations */}
      <Route path="/prospects">
        <Prospects />
      </Route>
      <Route path="/clients">
        <Clients />
      </Route>
      <Route path="/heroes">
        <Heroes />
      </Route>
      <Route path="/contracts">
        <Contracts />
      </Route>
      <Route path="/invoices">
        <Invoices />
      </Route>
      <Route path="/interviews">
        <Interviews />
      </Route>
      <Route path="/users">
        <UserManagement />
      </Route>
      <Route path="/settings">
        <Settings />
      </Route>
      
      {/* Job management */}
      <Route path="/jobs">
        <JobManagement />
      </Route>
      
      {/* Public careers page */}
      <Route path="/careers">
        <Careers />
      </Route>
      
      {/* Login and auth pages redirect to dashboard in dev mode */}
      <Route path="/login">
        <Dashboard />
      </Route>
      <Route path="/auth">
        <Dashboard />
      </Route>
      
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
