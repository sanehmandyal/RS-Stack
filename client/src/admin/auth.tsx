import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import { api, ApiError, setCsrfToken, setAuthToken } from '../services/api';

export interface AdminUser { id: string; email: string; name: string; role: string; mustChangePassword: boolean; permissions: string[] }
interface AuthCtx {
  user: AdminUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  can: (...p: string[]) => boolean;
  refresh: () => Promise<void>;
}
const Ctx = createContext<AuthCtx>(null as unknown as AuthCtx);
export const useAuth = () => useContext(Ctx);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const r = await api<{ user: AdminUser; csrfToken: string }>('/admin/auth/me');
      setCsrfToken(r.csrfToken);
      setUser(r.user);
    } catch (e) {
      if (e instanceof ApiError && e.status === 401) {
        setAuthToken('');
        setUser(null);
      }
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => { void refresh(); }, [refresh]);

  const login = async (email: string, password: string) => {
    const r = await api<{ user: AdminUser; csrfToken: string; token?: string }>('/admin/auth/login', { method: 'POST', body: { email, password } });
    setCsrfToken(r.csrfToken);
    if (r.token) setAuthToken(r.token);
    setUser(r.user);
  };
  const logout = async () => {
    try { await api('/admin/auth/logout', { method: 'POST' }); } finally { setCsrfToken(''); setAuthToken(''); setUser(null); }
  };
  const can = (...p: string[]) => !!user && p.some((x) => user.permissions.includes(x));
  return <Ctx.Provider value={{ user, loading, login, logout, can, refresh }}>{children}</Ctx.Provider>;
}
