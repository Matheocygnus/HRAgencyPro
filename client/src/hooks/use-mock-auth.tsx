import { createContext, ReactNode, useContext } from "react";
import { User, Role } from "@shared/schema";

// Define available modules (these correspond to sidebar items)
export const MODULES = {
  DASHBOARD: "dashboard",
  PROSPECTS: "prospects",
  INTERVIEWS: "interviews",
  HEROES: "heroes",
  HERO_DETAIL: "hero_detail",
  COMPANIES: "companies",
  COMPANY_DETAIL: "company_detail",
  CONTRACTS: "contracts",
  INVOICES: "invoices",
  USER_MANAGEMENT: "user_management",
  JOB_MANAGEMENT: "job_management",
  SYSTEM_SETTINGS: "settings",
  ROLE_MANAGEMENT: "role_management"
};

// Mock role for development - Super Admin
const mockRole: Role = {
  id: 1,
  name: "Super Administrator",
  description: "Complete system access with all permissions",
  permissions: JSON.stringify(Object.values(MODULES)), // All permissions
  createdAt: new Date()
};

// Extended User type with role field
type ExtendedUser = User & { role?: Role };

// Mock user for development - Super Admin
const mockUser: ExtendedUser = {
  id: 1,
  username: "superadmin",
  email: "admin@remotehero.com",
  firstName: "Super",
  lastName: "Admin",
  roleId: 1,
  password: "hashed_password", // This would be hashed in a real scenario
  createdAt: new Date(),
  avatar: null,
  role: mockRole // Add role object for convenience
};

type MockAuthContextType = {
  user: ExtendedUser | null;
  isLoading: boolean;
  error: Error | null;
  loginMutation: any;
  logoutMutation: any;
  registerMutation: any;
};

export const MockAuthContext = createContext<MockAuthContextType>({
  user: mockUser,
  isLoading: false,
  error: null,
  loginMutation: { mutate: () => {} },
  logoutMutation: { mutate: () => {} },
  registerMutation: { mutate: () => {} }
});

export function MockAuthProvider({ children }: { children: ReactNode }) {
  return (
    <MockAuthContext.Provider
      value={{
        user: mockUser,
        isLoading: false,
        error: null,
        loginMutation: { mutate: () => {} },
        logoutMutation: { mutate: () => {} },
        registerMutation: { mutate: () => {} }
      }}
    >
      {children}
    </MockAuthContext.Provider>
  );
}

export function useMockAuth() {
  const context = useContext(MockAuthContext);
  
  // Add a helper function to check if user has permission for a specific module
  const hasPermission = (module: string) => {
    if (!context.user || !context.user.role) return false;
    
    try {
      const permissions = JSON.parse(context.user.role.permissions);
      return permissions.includes(module);
    } catch (error) {
      console.error("Error parsing permissions:", error);
      return false;
    }
  };
  
  return {
    ...context,
    hasPermission
  };
}