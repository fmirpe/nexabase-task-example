"use client";

import React, {
  useState,
  useEffect,
  createContext,
  useContext,
  ReactNode,
} from "react";
import nexabase from "@/lib/nexabase";
import { User } from "@/types";

type AuthContextValue = {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, fullName: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    let isInitializing = false;

    const initializeAuth = async () => {
      if (isInitializing) return;
      isInitializing = true;

      try {
        const token = localStorage.getItem("nexabase_token");

        if (!token) {
          if (isMounted) {
            setUser(null);
            setLoading(false);
          }
          return;
        }

        nexabase.setToken(token);

        try {
          const userProfile = await nexabase.getUserProfile();

          if (isMounted) {
            setUser(userProfile);
          }
        } catch (error: any) {
          console.error("Error loading user profile:", error);

          if (error?.response?.status === 401) {
            console.log("Token inválido (401), limpiando...");
            localStorage.removeItem("nexabase_token");
            nexabase.setToken("");
          } else {
            console.log("Error temporal, manteniendo token");
          }

          if (isMounted) {
            setUser(null);
          }
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
        if (isMounted) {
          setUser(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    initializeAuth();

    return () => {
      isMounted = false;
    };
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    try {
      const { auth, user: userData } = await nexabase.login(email, password);

      localStorage.setItem("nexabase_token", auth.access_token);
      nexabase.setToken(auth.access_token);

      setUser(userData);
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const register = async (
    email: string,
    password: string,
    fullName: string
  ): Promise<void> => {
    await nexabase.register(email, password, fullName);
  };

  const logout = (): void => {
    localStorage.removeItem("nexabase_token");
    nexabase.setToken("");
    setUser(null);

    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
  };

  const value: AuthContextValue = {
    user,
    login,
    register,
    logout,
    loading,
  };

  // ✅ Usar React.createElement para evitar error de Turbopack
  return React.createElement(
    AuthContext.Provider,
    { value: value },
    children
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
