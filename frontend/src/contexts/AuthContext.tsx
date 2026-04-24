import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { api } from '../lib/api';
import { User, AuthResponse } from '../types/auth';

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const TOKEN_KEY = 'mfmei:token';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      setLoading(false);
      return;
    }
    api
      .get<User>('/v1/auth/me')
      .then((r) => setUser(r.data))
      .catch(() => localStorage.removeItem(TOKEN_KEY))
      .finally(() => setLoading(false));
  }, []);

  const persist = (data: AuthResponse) => {
    localStorage.setItem(TOKEN_KEY, data.token);
    setUser(data.user);
  };

  const login = async (email: string, password: string) => {
    const { data } = await api.post<AuthResponse>('/v1/auth/login', { email, password });
    persist(data);
  };

  const register = async (name: string, email: string, password: string) => {
    const { data } = await api.post<AuthResponse>('/v1/auth/register', { name, email, password });
    persist(data);
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
}
