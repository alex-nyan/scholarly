import { createContext, useContext, useState, useEffect } from "react";
import * as authStorage from "../api/auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const data = authStorage.getStoredAuth();
    if (data) {
      setUser(data.user);
      setProfile(data.profile || {});
    } else {
      setUser(null);
      setProfile(null);
    }
    setLoading(false);
  }, []);

  const login = (email, password) => {
    const data = authStorage.login(email, password);
    setUser(data.user);
    setProfile(data.profile || {});
    return data;
  };

  const register = (email, password) => {
    const data = authStorage.register(email, password);
    setUser(data.user);
    setProfile(data.profile || {});
    return data;
  };

  const logout = () => {
    authStorage.logout();
    setUser(null);
    setProfile(null);
  };

  const updateProfile = (updates) => {
    const updated = authStorage.updateStoredProfile(updates);
    setProfile(updated);
    return updated;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        login,
        register,
        logout,
        updateProfile,
        refreshUser: () => {
          const data = authStorage.getStoredAuth();
          if (data) {
            setUser(data.user);
            setProfile(data.profile || {});
          } else {
            setUser(null);
            setProfile(null);
          }
        },
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
