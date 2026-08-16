import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (tokens: { accessToken: string; refreshToken: string }, user: User) => void;
  register: (tokens: { accessToken: string; refreshToken: string }, user: User) => void;
  logout: () => Promise<void>;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('access_token');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await api.get('/auth/profile');
        setUser(res.data.user);
      } catch (err) {
        localStorage.clear();
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = (tokens: { accessToken: string; refreshToken: string }, userData: User) => {
    localStorage.setItem('access_token', tokens.accessToken);
    localStorage.setItem('refresh_token', tokens.refreshToken);
    setUser(userData);
  };

  const register = (tokens: { accessToken: string; refreshToken: string }, userData: User) => {
    localStorage.setItem('access_token', tokens.accessToken);
    localStorage.setItem('refresh_token', tokens.refreshToken);
    setUser(userData);
  };

  const logout = async () => {
    try {
      const refreshToken = localStorage.getItem('refresh_token');
      await api.post('/auth/logout', { refreshToken });
    } catch (e) {
      // Ignore
    } finally {
      localStorage.clear();
      setUser(null);
    }
  };

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
