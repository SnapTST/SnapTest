// /src/hooks/use-auth.tsx
"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface User {
  name: string;
  email: string;
  avatar: string;
}

interface AuthContextType {
  user: User | null;
  login: (name: string, email: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // This is where you might check for a token in localStorage
    // For this mock, we'll just start with no user
  }, []);

  const login = (name: string, email: string) => {
    // In a real app, you'd get a token from your backend
    const mockUser: User = {
      name,
      email,
      avatar: `https://i.pravatar.cc/150?u=${email}`,
    };
    setUser(mockUser);
  };

  const logout = () => {
    // In a real app, you'd clear the token
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
