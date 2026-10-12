import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User } from '../types/index.ts';
import { api, getAuthToken, setAuthToken, removeAuthToken } from '../services/api.ts';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  demoLogin: () => Promise<void>;
  logout: () => Promise<void>;
  authModalOpen: boolean;
  authModalMode: 'login' | 'register' | 'forgot';
  openAuthModal: (mode?: 'login' | 'register' | 'forgot') => void;
  closeAuthModal: () => void;
  setAuthModalMode: (mode: 'login' | 'register' | 'forgot') => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register' | 'forgot'>('login');

  useEffect(() => {
    const initAuth = async () => {
      const token = getAuthToken();
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const { user: fetchedUser } = await api.getCurrentUser();
        setUser(fetchedUser);
      } catch (err) {
        console.warn('Session expired or invalid token:', err);
        removeAuthToken();
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const { user: loggedInUser, token } = await api.login(email, password);
    setAuthToken(token);
    setUser(loggedInUser);
    setAuthModalOpen(false);
  };

  const register = async (name: string, email: string, password: string) => {
    const { user: newUser, token } = await api.register(name, email, password);
    setAuthToken(token);
    setUser(newUser);
    setAuthModalOpen(false);
  };

  const demoLogin = async () => {
    const { user: demoUser, token } = await api.demoLogin();
    setAuthToken(token);
    setUser(demoUser);
    setAuthModalOpen(false);
  };

  const logout = async () => {
    try {
      await api.logout();
    } catch (e) {
      // Ignore network errors on logout
    } finally {
      removeAuthToken();
      setUser(null);
    }
  };

  const openAuthModal = (mode: 'login' | 'register' | 'forgot' = 'login') => {
    setAuthModalMode(mode);
    setAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setAuthModalOpen(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        demoLogin,
        logout,
        authModalOpen,
        authModalMode,
        openAuthModal,
        closeAuthModal,
        setAuthModalMode,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
