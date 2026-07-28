import { createContext, useContext, useState, useCallback } from "react";
import {
  api,
  saveAdminSession,
  clearAdminSession,
  getStoredAdmin,
} from "../services/apiClient";

const AdminAuthContext = createContext(null);

export function AdminAuthProvider({ children }) {
  const [admin, setAdmin] = useState(getStoredAdmin);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = useCallback(async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.adminAuth.login(email, password);
      saveAdminSession(data);
      setAdmin(data.user);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.adminAuth.logout();
    } catch {
      /* ignore */
    } finally {
      clearAdminSession();
      setAdmin(null);
    }
  }, []);

  return (
    <AdminAuthContext.Provider
      value={{ admin, loading, error, login, logout, isAuthenticated: !!admin }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error("useAdminAuth must be used within AdminAuthProvider");
  return ctx;
}
