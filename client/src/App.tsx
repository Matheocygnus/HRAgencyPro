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
      {/* Use DashboardDev everywhere since it doesn't rely on authentication */}
      <Route path="/">
        <DashboardDev />
      </Route>
      <Route path="/dashboard">
        <DashboardDev />
      </Route>
      <Route path="/prospects">
        <DashboardDev />
      </Route>
      <Route path="/clients">
        <DashboardDev />
      </Route>
      <Route path="/heroes">
        <DashboardDev />
      </Route>
      <Route path="/contracts">
        <DashboardDev />
      </Route>
      <Route path="/invoices">
        <DashboardDev />
      </Route>
      <Route path="/users">
        <DashboardDev />
      </Route>
      <Route path="/settings">
        <DashboardDev />
      </Route>
      <Route path="/login">
        <DashboardDev />
      </Route>
      <Route path="/auth">
        <DashboardDev />
      </Route>
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
