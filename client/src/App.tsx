import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { ProtectedRoute } from "./lib/protected-route";
import NotFound from "@/pages/not-found";
import AuthPageSimple from "@/pages/auth-page-simple";
import Dashboard from "@/pages/dashboard";
import DashboardDev from "@/pages/dashboard-dev";
import Prospects from "@/pages/prospects";
import Clients from "@/pages/clients";
import Heroes from "@/pages/heroes";
import Contracts from "@/pages/contracts";
import Invoices from "@/pages/invoices";
import UserManagement from "@/pages/user-management";
import Settings from "@/pages/settings";

function Router() {
  return (
    <Switch>
      <Route path="/auth">
        <AuthPageSimple />
      </Route>
      {/* Direct access routes for development and preview */}
      <Route path="/dashboard">
        <DashboardDev />
      </Route>
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
      <Route path="/users">
        <UserManagement />
      </Route>
      <Route path="/settings">
        <Settings />
      </Route>
      
      {/* Protected routes (will be used once auth is fully working) */}
      <ProtectedRoute path="/" component={Dashboard} />
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
