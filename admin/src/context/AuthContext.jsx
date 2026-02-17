import { createContext, useContext, useEffect, useState } from "react";
import { apiRequest } from "../services/api.js";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(
    localStorage.getItem("adminToken") || null,
  );
  const [loading, setLoading] = useState(true);

  // 🔹 Load user on refresh
  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    // We already have user info encoded in login response,
    // so for now we trust stored token existence.
    // Later we can add /me endpoint.
    setLoading(false);
  }, [token]);

  // 🔐 Admin Login
  const login = async (email, password) => {
    const data = await apiRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    // 🚨 Role check (UX safety)
    if (data.user.role !== "admin") {
      throw new Error("Access denied. Admins only.");
    }

    setUser(data.user);
    setToken(data.token);
    localStorage.setItem("adminToken", data.token);
  };

  // 🚪 Logout
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("adminToken");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoggedIn: !!token,
        login,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Hook
export const useAuth = () => useContext(AuthContext);
