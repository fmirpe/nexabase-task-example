'use client';

import { useState, useEffect } from 'react';
import nexabase from '@/lib/nexabase';
import { User } from '@/types';

export function useSimpleAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('nexabase_token');
      
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      nexabase.setToken(token);
      const userProfile = await nexabase.getUserProfile();
      setUser(userProfile);
      setLoading(false);
    } catch (error) {
      console.error('Error checking auth:', error);
      localStorage.removeItem('nexabase_token');
      setUser(null);
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    const { auth, user: userData } = await nexabase.login(email, password);
    
    // Guardar token
    localStorage.setItem('nexabase_token', auth.access_token);
    nexabase.setToken(auth.access_token);
    
    setUser(userData);
    return userData;
  };

  const logout = () => {
    localStorage.removeItem('nexabase_token');
    nexabase.setToken('');
    setUser(null);
  };

  return { user, loading, login, logout };
}
