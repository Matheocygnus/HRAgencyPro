import { createContext, ReactNode, useContext } from "react";
import { User } from "@shared/schema";

// Mock user for development
const mockUser: User = {
  id: 1,
  username: "admin",
  email: "admin@remotehero.com",
  firstName: "Admin",
  lastName: "User",
  role: "super_admin",
  password: "hashed_password", // This would be hashed in a real scenario
  createdAt: new Date(),
  updatedAt: new Date()
};

type MockAuthContextType = {
  user: User | null;
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
  return useContext(MockAuthContext);
}