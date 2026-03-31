import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authAPI } from '../api/config';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On mount, restore user from localStorage and verify session
  useEffect(() => {
    const initAuth = async () => {
      const stored = localStorage.getItem('gs_user');
      if (stored) {
        try {
          const parsedUser = JSON.parse(stored);
          setUser(parsedUser);
          
          // Silently verify if the session (cookie) is still valid
          try {
            const profile = await authAPI.profile();
            setUser(profile);
            localStorage.setItem('gs_user', JSON.stringify(profile));
          } catch (err) {
            // If server says 401/error, cookie is gone or invalid
            console.warn("Session verification failed, logging out.");
            localStorage.removeItem('gs_user');
            setUser(null);
          }
        } catch (e) {
          localStorage.clear();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  // 🔌 POST /api/v1/auth/login → Login & get HttpOnly JWT cookie
  const login = useCallback(async (email, password) => {
    // 1. Call login endpoint (This sets the secure HttpOnly cookie)
    await authAPI.login({ email, password });
    
    // 2. Since token is in a cookie, call /profile to get user details
    const profile = await authAPI.profile();
    
    // 3. Save profile in state and localStorage
    localStorage.setItem('gs_user', JSON.stringify(profile));
    setUser(profile);
    return profile;
  }, []);

  // 🔌 POST /api/v1/auth/register → Register new user
  const register = useCallback(async (name, username, email, password, phoneNumber, role) => {
    const data = await authAPI.register({ name, username, email, password, phoneNumber, role });
    return data;
  }, []);

  const logout = useCallback(async () => {
    try {
      await authAPI.logout();
    } catch (e) { console.error("Logout error", e); }
    localStorage.removeItem('gs_user');
    setUser(null);
  }, []);

  const value = { user, loading, login, register, logout, isAdmin: user?.role === 'ADMIN' };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
