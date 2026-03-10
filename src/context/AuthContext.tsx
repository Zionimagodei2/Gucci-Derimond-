import React, { createContext, useContext, useState, ReactNode } from 'react';

interface User {
  email: string;
  name: string;
  isAdmin?: boolean;
  points?: number;
}

interface AuthContextType {
  user: User | null;
  isAuthModalOpen: boolean;
  authMode: 'login' | 'join' | 'forgot';
  openLogin: () => void;
  openJoin: () => void;
  openForgot: () => void;
  closeAuthModal: () => void;
  login: (email: string, name: string, isAdmin?: boolean, points?: number) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'join' | 'forgot'>('login');

  const openLogin = () => {
    setAuthMode('login');
    setIsAuthModalOpen(true);
  };

  const openJoin = () => {
    setAuthMode('join');
    setIsAuthModalOpen(true);
  };

  const openForgot = () => {
    setAuthMode('forgot');
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const login = (email: string, name: string, isAdmin: boolean = false, points: number = 150) => {
    setUser({ email, name, isAdmin, points });
    closeAuthModal();
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthModalOpen, 
      authMode, 
      openLogin, 
      openJoin, 
      openForgot,
      closeAuthModal, 
      login, 
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}
