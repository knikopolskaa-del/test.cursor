import React, { createContext, useContext, useEffect, useState } from "react";
import { Employee, employees } from "../mock/employees";
import { load, save, remove } from "../services/storage";

type AuthContextValue = {
  currentUser: Employee | null;
  isReady: boolean;
  login: (employeeIdOrName: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const AUTH_KEY = "auth:currentUser";

type StoredUser = {
  id: string;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const [currentUser, setCurrentUser] = useState<Employee | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const stored = load<StoredUser | null>(AUTH_KEY, null);
    if (stored) {
      const byId = employees.find((e) => e.id === stored.id);
      if (byId) {
        setCurrentUser(byId);
      }
    }
    setIsReady(true);
  }, []);

  const login = (employeeIdOrName: string) => {
    const byId = employees.find((e) => e.id === employeeIdOrName);
    const match =
      byId ??
      employees.find((e) =>
        e.name.toLowerCase().includes(employeeIdOrName.toLowerCase())
      );

    const user = match ?? employees[0];

    setCurrentUser(user);
    save<StoredUser>(AUTH_KEY, { id: user.id });
  };

  const logout = () => {
    setCurrentUser(null);
    remove(AUTH_KEY);
  };

  return (
    <AuthContext.Provider value={{ currentUser, isReady, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
};

