"use client";

import React, { useState, useEffect, createContext, useContext, ReactNode } from "react";
import nexabase from "@/lib/nexabase";
import { User } from "@/types";

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<User>;
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = localStorage.getItem("nexabase_token");
        if (token) {
          // ✅ Usando el SDK oficial
          const currentUser = await nexabase.getCurrentUser();
          setUser({
            id: currentUser.id,
            email: currentUser.email,
            full_name: currentUser.full_name || currentUser.name || currentUser.email,
            role: currentUser.role as "user" | "admin" | "developer",
            created_at: currentUser.created_at || new Date().toISOString(),
            updated_at: currentUser.updated_at || new Date().toISOString(),
          });
        }
      } catch (error) {
        console.error("Auth error:", error);
        localStorage.removeItem("nexabase_token");
        setUser(null);
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string): Promise<User> => {
    try {
      // ✅ Usando el SDK oficial
      const { access_token, user: userData } = await nexabase.signIn(email, password);
      
      localStorage.setItem("nexabase_token", access_token);
      
      const userObject: User = {
        id: userData.id,
        email: userData.email,
        full_name: userData.full_name || userData.name || userData.email,
        role: userData.role as "user" | "admin" | "developer",
        created_at: userData.created_at || new Date().toISOString(),
        updated_at: userData.updated_at || new Date().toISOString(),
      };

      setUser(userObject);
      return userObject;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      // ✅ Usando el SDK oficial
      await nexabase.signOut();
    } catch (error) {
      console.warn("Logout failed:", error);
    }
    localStorage.removeItem("nexabase_token");
    setUser(null);
  };

  return React.createElement(
    AuthContext.Provider,
    { value: { user, login, logout, loading } },
    children
  );
}
