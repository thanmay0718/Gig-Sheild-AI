import { createContext, useContext, useMemo, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {                                                    // ADDED: wrap in try-catch
      const raw = localStorage.getItem("gigshield_user");  // in case JSON is corrupted
      return raw ? JSON.parse(raw) : null;
    } catch {
      localStorage.removeItem("gigshield_user");           // clear bad data silently
      return null;
    }
  });

  const setSession = (session) => {
    const nextUser = {
      email: session.email,
      role: session.role,                                   // "ADMIN" or "WORKER"
      name: session.name || session.email,
      workerId: session.workerId || null,                   // ADDED: store workerId
    };                                                      // useful for worker-specific API calls
    localStorage.setItem("gigshield_user", JSON.stringify(nextUser));
    localStorage.setItem("token", session.token || "");
    setUser(nextUser);
  };

  const logout = () => {
    localStorage.removeItem("gigshield_user");
    localStorage.removeItem("token");
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isAdmin: user?.role === "ADMIN",                      // ADDED: role helpers
      isWorker: user?.role === "WORKER",                    // use these in route guards
      setSession,
      logout,
    }),
    [user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}