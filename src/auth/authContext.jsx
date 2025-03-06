import React, { createContext, useState, useEffect } from "react";
import axios from "../../utils/axios"; // Import your configured axios instance

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser ] = useState(null);

  useEffect(() => {
    const storedUser  = JSON.parse(localStorage.getItem("user"));
    setUser (storedUser );
  }, []);

  const login = (responseData) => {
    // Assuming responseData contains the user object and tokens
    const { token, refreshToken, ...userData } = responseData; // Destructure to get user data

    localStorage.setItem("user", JSON.stringify(userData)); // Store user data
    setUser (userData); // Set user state
  };

  const logout = async () => {
    try {
      await axios.post('/auth/logout', {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}` // Include access token if needed
        }
      });
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      setUser (null);
    }
  };

  const refreshAccessToken = async () => {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) {
      throw new Error("No refresh token available");
    }

    try {
      const response = await axios.post('/auth/refresh-token', { token: refreshToken });
      const newAccessToken = response.data.accessToken;
      localStorage.setItem("accessToken", newAccessToken); // Update access token
      return newAccessToken;
    } catch (error) {
      console.error("Failed to refresh access token:", error);
      logout(); // Logout if refresh fails
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, refreshAccessToken }}>
      {children}
    </AuthContext.Provider>
  );
};