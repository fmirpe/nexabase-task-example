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

type AuthContextValue =
  | {
      user: User | null;
      login: (email: string, password: string) => Promise<void>;
      register: (
        email: string,
        password: string,
        fullName: string
      ) => Promise<void>;
      logout: () => void;
      loading: boolean;
    }
  | undefined;

const AuthContext: React.Context<AuthContextValue> =
  createContext<AuthContextValue>(undefined);

type AuthProviderProps = {
  children: ReactNode;
};

const getCookie = (name: string): string | null => {
  if (typeof window !== "undefined") {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
  }
  return null;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const token = getCookie("nexabase_token");

      if (token) {
        nexabase.setToken(token);

        try {
          const userProfile = await nexabase.getUserProfile();
          setUser(userProfile);
        } catch (error) {
          console.error("🎯 CONTEXT: Error loading user:", error);
          // Token inválido
          document.cookie =
            "nexabase_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
          nexabase.setToken("");
          setUser(null);
        }
      } else {
        setUser(null);
      }

      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    try {
      const { auth, user } = await nexabase.login(email, password);
      setUser(user);
    } catch (error) {
      console.error("🎯 ERROR in useAuth.login:", error);
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
    console.log("🎯 LOGOUT: Starting logout...");
    nexabase.logout();
    setUser(null);

    // Redirigir después del logout
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading,
  };

  return React.createElement(AuthContext.Provider, { value }, children);
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
