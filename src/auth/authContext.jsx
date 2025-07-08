import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

// Membuat AuthContext dengan nilai default
export const AuthContext = createContext({
  user: null,
  token: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: false,
  login: () => {},
  logout: () => {},
  updateUser: () => {},
  refreshAccessToken: () => {},
});

/**
 * AuthProvider untuk mengelola otentikasi pengguna dan token
 * @param {Object} props - Props React
 * @param {React.ReactNode} props.children - Komponen anak yang akan dibungkus
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // { id: string, email: string, role: 'USER' | 'SELLER' }
  const [token, setToken] = useState(null); // Admin token
  const [refreshToken, setRefreshToken] = useState(null); // Refresh token
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const API_URL = 'http://localhost:3000/api';

  // Memuat data otentikasi dari localStorage saat komponen di-mount
  useEffect(() => {
    const loadAuthData = () => {
      try {
        const storedToken = localStorage.getItem('Admintoken');
        const storedRefreshToken = localStorage.getItem('AdminRefreshToken');
        const storedUser = localStorage.getItem('AdminUser');

        if (storedToken) {
          setToken(storedToken);
          setIsAuthenticated(true);
        }
        if (storedRefreshToken) {
          setRefreshToken(storedRefreshToken);
        }
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          if (parsedUser && parsedUser.id && ['USER', 'SELLER'].includes(parsedUser.role)) {
            setUser(parsedUser);
          } else {
            localStorage.removeItem('AdminUser'); // Bersihkan data pengguna yang tidak valid
          }
        }
      } catch (err) {
        console.error('Gagal memuat data otentikasi dari localStorage:', err);
        localStorage.removeItem('Admintoken');
        localStorage.removeItem('AdminRefreshToken');
        localStorage.removeItem('AdminUser');
      } finally {
        setIsLoading(false);
      }
    };

    loadAuthData();
  }, []);

  /**
   * Fungsi untuk login dan menyimpan data otentikasi
   * @param {string} accessToken - Token akses dari API
   * @param {string} refreshToken - Refresh token dari API
   * @param {Object} userData - Data pengguna { id, email, role }
   */
  const login = (accessToken, refreshToken, userData) => {
    if (!accessToken || !userData?.id || !['USER', 'SELLER'].includes(userData?.role)) {
      console.error('Data login tidak valid');
      return;
    }

    localStorage.setItem('Admintoken', accessToken);
    localStorage.setItem('AdminRefreshToken', refreshToken || '');
    localStorage.setItem('AdminUser', JSON.stringify(userData));
    setToken(accessToken);
    setRefreshToken(refreshToken || null);
    setUser(userData);
    setIsAuthenticated(true);
  };

  /**
   * Fungsi untuk logout dan menghapus data otentikasi
   */
  const logout = () => {
    localStorage.removeItem('Admintoken');
    localStorage.removeItem('AdminRefreshToken');
    localStorage.removeItem('AdminUser');
    setToken(null);
    setRefreshToken(null);
    setUser(null);
    setIsAuthenticated(false);
  };

  /**
   * Fungsi untuk memperbarui data pengguna tanpa logout
   * @param {Object} userData - Data pengguna baru { id, email, role }
   */
  const updateUser = (userData) => {
    if (!userData?.id || !['USER', 'SELLER'].includes(userData?.role)) {
      console.error('Data pengguna tidak valid untuk pembaruan');
      return;
    }
    localStorage.setItem('AdminUser', JSON.stringify(userData));
    setUser(userData);
  };

  /**
   * Fungsi untuk memperbarui token akses menggunakan refresh token
   * @returns {Promise<boolean>} - True jika berhasil, false jika gagal
   */
  const refreshAccessToken = async () => {
    if (!refreshToken) {
      console.error('Tidak ada refresh token tersedia');
      logout();
      return false;
    }

    try {
      const response = await axios.post(`${API_URL}/auth/refresh-token`, { refreshToken });
      const { accessToken, newRefreshToken } = response.data;
      
      localStorage.setItem('Admintoken', accessToken);
      if (newRefreshToken) {
        localStorage.setItem('AdminRefreshToken', newRefreshToken);
        setRefreshToken(newRefreshToken);
      }
      setToken(accessToken);
      setIsAuthenticated(true);
      return true;
    } catch (err) {
      console.error('Gagal memperbarui token:', err);
      logout();
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        refreshToken,
        isAuthenticated,
        isLoading,
        login,
        logout,
        updateUser,
        refreshAccessToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};