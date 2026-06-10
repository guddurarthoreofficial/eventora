import React, { createContext, useEffect, useState } from "react";
import api from "../utils/axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user from localStorage on app start
  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    setLoading(false);
  }, []);

  // Login
  const login = async (email, password) => {
    try {
      const { data } = await api.post("/auth/login", {
        email,
        password,
      });

      setUser(data);

      localStorage.setItem("user", JSON.stringify(data));
      localStorage.setItem("token", data.token);

      return data;
    } catch (error) {
      console.error("Login Failed:", error);
      throw error;
    }
  };

  // Register
  const register = async (name, email, password) => {
    try {
      const { data } = await api.post("/auth/register", {
        name,
        email,
        password,
      });

      return data;
    } catch (error) {
      console.error("Registration Failed:", error);
      throw error;
    }
  };

  // Verify OTP
  const verifyOtp = async (email, otp) => {
    try {
      const { data } = await api.post("/auth/verify-otp", {
        email,
        otp,
      });

      setUser(data);

      localStorage.setItem("user", JSON.stringify(data));
      localStorage.setItem("token", data.token);

      return data;
    } catch (error) {
      console.error("OTP Verification Failed:", error);
      throw error;
    }
  };

  // Logout
  const logout = () => {
    setUser(null);

    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        verifyOtp,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};