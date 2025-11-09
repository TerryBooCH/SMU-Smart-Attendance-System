import React, { createContext, useState, useEffect, useCallback } from "react";
import { tokenUtils } from "../utils/tokenUtils";
import { authService } from "../api/authService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(
    tokenUtils.isAuthenticated()
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const initializeAuth = useCallback(() => {
    try {
      setLoading(true);

      if (tokenUtils.isAuthenticated()) {
        const token = tokenUtils.getToken();
        const decodedUser = tokenUtils.decodeToken(token);

        if (decodedUser) {
          console.log(decodedUser);
          setUser(decodedUser);
          setIsAuthenticated(true);
        } else {
          // Token is invalid or expired
          setUser(null);
          setIsAuthenticated(false);
          tokenUtils.clearToken();
        }
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error("Auth initialization error:", error);
      setUser(null);
      setIsAuthenticated(false);
      tokenUtils.clearToken();
    } finally {
      setLoading(false);
    }
  }, []);

  const login = useCallback(
    async (credentials) => {
      setLoading(true);
      setError(null);

      try {
        const response = await authService.login(credentials);
        tokenUtils.setToken({
          accessToken: response.accessToken,
          expiresIn: response.expiresIn,
        });

        // Re-initialize to decode the token and set user consistently
        initializeAuth();
        return {
          success: true,
          permLevel: response?.user?.permissionLevel ?? null,
        };
      } catch (err) {
        console.error("Login error:", err);
        setError(err.message || "Login failed");
        setIsAuthenticated(false);
        return {
          success: false,
          permLevel: null,
        };
      } finally {
        setLoading(false);
      }
    },
    [initializeAuth]
  );

  const logout = useCallback(() => {
    tokenUtils.clearToken();
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  const value = {
    user,
    isAuthenticated,
    loading,
    error,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
