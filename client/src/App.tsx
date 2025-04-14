import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { ProtectedRoute } from "./lib/protected-route";
import NotFound from "@/pages/not-found";
import AuthPageSimple from "@/pages/auth-page-simple";
import Dashboard from "@/pages/dashboard";
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
      <ProtectedRoute path="/" component={Dashboard} />
      <ProtectedRoute path="/prospects" component={Prospects} />
      <ProtectedRoute path="/clients" component={Clients} />
      <ProtectedRoute path="/heroes" component={Heroes} />
      <ProtectedRoute path="/contracts" component={Contracts} />
      <ProtectedRoute path="/invoices" component={Invoices} />
      <ProtectedRoute path="/users" component={UserManagement} />
      <ProtectedRoute path="/settings" component={Settings} />
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
