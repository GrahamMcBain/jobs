'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthContext as AuthContextType } from '@/types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [signerUuid, setSignerUuid] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing authentication on mount
    const storedSignerUuid = localStorage.getItem('signer_uuid');
    const storedUser = localStorage.getItem('user');
    
    if (storedSignerUuid && storedUser) {
      try {
        setSignerUuid(storedSignerUuid);
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        localStorage.removeItem('signer_uuid');
        localStorage.removeItem('user');
      }
    }
    
    setIsLoading(false);
  }, []);

  const login = async (newSignerUuid: string) => {
    try {
      setIsLoading(true);
      
      // Fetch user data from API
      const response = await fetch('/api/auth/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ signerUuid: newSignerUuid }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }

      const { user: userData } = await response.json();
      
      // Store in localStorage and state
      localStorage.setItem('signer_uuid', newSignerUuid);
      localStorage.setItem('user', JSON.stringify(userData));
      
      setSignerUuid(newSignerUuid);
      setUser(userData);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('signer_uuid');
    localStorage.removeItem('user');
    setSignerUuid(null);
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    signerUuid,
    isAuthenticated: !!user && !!signerUuid,
    isLoading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
