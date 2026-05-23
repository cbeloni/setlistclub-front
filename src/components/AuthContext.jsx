import { createContext, useContext, useEffect, useState } from "react";
import * as apiService from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Carrega a sessão inicial do localStorage se existir
    const savedToken = localStorage.getItem("access_token");
    const savedUser = localStorage.getItem("auth_user");

    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
      apiService.setAuthHeader(savedToken);
    }
    setLoading(false);
  }, []);

  const handleAuthSuccess = (authData) => {
    const { access_token, user: userData } = authData;
    setToken(access_token);
    setUser(userData);
    localStorage.setItem("access_token", access_token);
    localStorage.setItem("auth_user", JSON.stringify(userData));
    apiService.setAuthHeader(access_token);
  };

  const login = async (email, password) => {
    const data = await apiService.login(email, password);
    handleAuthSuccess(data);
    return data.user;
  };

  const register = async (email, displayName, password) => {
    const data = await apiService.register(email, displayName, password);
    handleAuthSuccess(data);
    return data.user;
  };

  const loginWithGoogle = async (idToken) => {
    const data = await apiService.loginGoogleCallback(idToken);
    handleAuthSuccess(data);
    return data.user;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("access_token");
    localStorage.removeItem("auth_user");
    apiService.setAuthHeader(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        loading,
        login,
        register,
        loginWithGoogle,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
}
