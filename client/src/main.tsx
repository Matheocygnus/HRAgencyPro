import { createRoot } from "react-dom/client";
import { QueryClientProvider } from "@tanstack/react-query";
import App from "./App";
import "./index.css";
import { MockAuthProvider } from "./hooks/use-mock-auth";
import { queryClient } from "./lib/queryClient";

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <MockAuthProvider>
      <App />
    </MockAuthProvider>
  </QueryClientProvider>
);
