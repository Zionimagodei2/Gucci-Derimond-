import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabase';

interface User {
  id: string;
  email: string;
  name: string;
  isAdmin?: boolean;
  points?: number;
  avatar_url?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthModalOpen: boolean;
  authMode: 'login' | 'join' | 'forgot';
  openLogin: () => void;
  openJoin: () => void;
  openForgot: () => void;
  closeAuthModal: () => void;
  logout: () => Promise<void>;
  addPoints: (amount: number) => void;
  removePoints: (amount: number) => void;
  updateUserContext: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'join' | 'forgot'>('login');

  const loadUserPoints = (userId: string) => {
    const storedPoints = localStorage.getItem(`points_${userId}`);
    return storedPoints ? parseInt(storedPoints, 10) : 50; // Default 50 points for new users
  };

  const addPoints = (amount: number) => {
    setUser(prev => {
      if (!prev) return prev;
      const newPoints = (prev.points || 0) + amount;
      localStorage.setItem(`points_${prev.id}`, newPoints.toString());
      return { ...prev, points: newPoints };
    });
  };

  const removePoints = (amount: number) => {
    setUser(prev => {
      if (!prev) return prev;
      const newPoints = Math.max(0, (prev.points || 0) - amount);
      localStorage.setItem(`points_${prev.id}`, newPoints.toString());
      return { ...prev, points: newPoints };
    });
  };

  useEffect(() => {
    // Check active sessions and sets the user
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email || '',
          name: session.user.user_metadata?.full_name || 'User',
          avatar_url: session.user.user_metadata?.avatar_url,
          isAdmin: session.user.email === 'gucciwebsite20@gmail.com', // Simple admin check
          points: loadUserPoints(session.user.id),
        });
      } else {
        setUser(null);
      }
    });

    // Listen for changes on auth state (logged in, signed out, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email || '',
          name: session.user.user_metadata?.full_name || 'User',
          avatar_url: session.user.user_metadata?.avatar_url,
          isAdmin: session.user.email === 'gucciwebsite20@gmail.com',
          points: loadUserPoints(session.user.id),
        });
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

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

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const updateUserContext = (updates: Partial<User>) => {
    setUser(prev => prev ? { ...prev, ...updates } : null);
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
      logout,
      addPoints,
      removePoints,
      updateUserContext
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
