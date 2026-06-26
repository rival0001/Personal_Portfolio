// What: Stores login state and exposes login/logout helpers to React components.
// Why: Auth state is needed across navigation, admin protection, and API requests.
import { createContext, useContext, useMemo, useState } from "react";
import { api } from "../lib/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("portfolio_user") || "null"));
  const [token, setToken] = useState(() => localStorage.getItem("portfolio_token"));

  async function login(payload) {
    const { data } = await api.post("/auth/login", payload);
    // Why: Persist the session so refreshes do not immediately log the admin out.
    localStorage.setItem("portfolio_token", data.token);
    localStorage.setItem("portfolio_user", JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);
  }

  function logout() {
    // Why: Clear both token and user metadata to fully end the local session.
    localStorage.removeItem("portfolio_token");
    localStorage.removeItem("portfolio_user");
    setToken(null);
    setUser(null);
  }

  const value = useMemo(() => ({ user, token, login, logout, isAdmin: user?.role === "admin" }), [user, token]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
