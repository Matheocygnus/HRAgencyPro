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
import UserManagement from "@/pages/user-management";
import Settings from "@/pages/settings";

function Router() {
  return (
    <Switch>
      <Route path="/auth">
        <LoginPage />
      </Route>
      <Route path="/login">
        <LoginPage />
      </Route>
      
      {/* Protected routes (requires authentication) */}
      <ProtectedRoute path="/" component={Dashboard} />
      <ProtectedRoute path="/dashboard" component={Dashboard} />
      <ProtectedRoute path="/prospects" component={Prospects} />
      <ProtectedRoute path="/clients" component={Clients} />
      <ProtectedRoute path="/heroes" component={Heroes} />
      <ProtectedRoute path="/contracts" component={Contracts} />
      <ProtectedRoute path="/invoices" component={Invoices} />
      <ProtectedRoute path="/users" component={UserManagement} />
      <ProtectedRoute path="/settings" component={Settings} />
      
      {/* Development routes (for testing without auth) */}
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
