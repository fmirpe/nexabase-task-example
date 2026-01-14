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
          
          if (currentUser) {
            const u = currentUser as any;
            setUser({
              id: u.id,
              email: u.email,
              full_name: u.full_name || u.name || u.email,
              role: (u.role as unknown as "user" | "admin" | "developer") || "user",
              created_at: u.created_at || new Date().toISOString(),
              updated_at: u.updated_at || new Date().toISOString(),
            });
          } else {
            // Si el token existe pero no hay usuario (ej: expirado)
            localStorage.removeItem("nexabase_token");
            setUser(null);
          }
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
      
      if (!access_token || !userData) {
        throw new Error("Credenciales inválidas o respuesta del servidor incompleta");
      }

      localStorage.setItem("nexabase_token", access_token);
      
      const u = userData as any;
      const userObject: User = {
        id: u.id,
        email: u.email,
        full_name: u.full_name || u.name || u.email,
        role: (u.role as unknown as "user" | "admin" | "developer") || "user",
        created_at: u.created_at || new Date().toISOString(),
        updated_at: u.updated_at || new Date().toISOString(),
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
