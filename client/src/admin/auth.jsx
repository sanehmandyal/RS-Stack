import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { api, ApiError, setCsrfToken, setAuthToken } from '../services/api';
const Ctx = createContext(null);
export const useAuth = () => useContext(Ctx);
export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const refresh = useCallback(async () => {
        try {
            const r = await api('/admin/auth/me');
            setCsrfToken(r.csrfToken);
            setUser(r.user);
        }
        catch (e) {
            if (e instanceof ApiError && e.status === 401) {
                setAuthToken('');
                setUser(null);
            }
        }
        finally {
            setLoading(false);
        }
    }, []);
    useEffect(() => { void refresh(); }, [refresh]);
    const login = async (email, password) => {
        const r = await api('/admin/auth/login', { method: 'POST', body: { email, password } });
        setCsrfToken(r.csrfToken);
        if (r.token)
            setAuthToken(r.token);
        setUser(r.user);
    };
    const logout = async () => {
        try {
            await api('/admin/auth/logout', { method: 'POST' });
        }
        finally {
            setCsrfToken('');
            setAuthToken('');
            setUser(null);
        }
    };
    const can = (...p) => !!user && p.some((x) => user.permissions.includes(x));
    return <Ctx.Provider value={{ user, loading, login, logout, can, refresh }}>{children}</Ctx.Provider>;
}
