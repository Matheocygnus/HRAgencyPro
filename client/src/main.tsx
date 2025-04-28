import { createRoot } from "react-dom/client";
import { QueryClientProvider } from "@tanstack/react-query";
import App from "./App";
import "./index.css";
import { queryClient } from "./lib/queryClient";

// Removed AuthProvider as we're using direct API calls instead
createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>
);
