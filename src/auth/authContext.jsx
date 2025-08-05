import React, { createContext, useState, useEffect } from 'react';
import axios from '../../utils/axios';
import { toast } from 'react-hot-toast';

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
  const [user, setUser] = useState(null); // { id, email, role, sellerId }
  const [token, setToken] = useState(null); // Admin token
  const [refreshToken, setRefreshToken] = useState(null); // Refresh token
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const API_URL = 'https://jualanbareng-api-e249c10b3bbe.herokuapp.com/api';

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
            // Map user.id ke sellerId untuk role SELLER
            const updatedUser = {
              ...parsedUser,
              sellerId: parsedUser.role === 'SELLER' ? parsedUser.id : null,
            };
            setUser(updatedUser);
            localStorage.setItem('AdminUser', JSON.stringify(updatedUser));
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
      console.error('Data login tidak valid:', { accessToken, userData });
      toast.error('Data login tidak valid');
      return;
    }

    // Map user.id ke sellerId untuk role SELLER
    const updatedUser = {
      ...userData,
      sellerId: userData.role === 'SELLER' ? userData.id : null,
    };

    localStorage.setItem('Admintoken', accessToken);
    localStorage.setItem('AdminRefreshToken', refreshToken || '');
    localStorage.setItem('AdminUser', JSON.stringify(updatedUser));
    setToken(accessToken);
    setRefreshToken(refreshToken || null);
    setUser(updatedUser);
    setIsAuthenticated(true);
    toast.success('Login berhasil');
    console.log('Login berhasil, user:', updatedUser);
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
    toast.success('Logout berhasil');
    console.log('Logout dilakukan');
  };

  /**
   * Fungsi untuk memperbarui data pengguna tanpa logout
   * @param {Object} userData - Data pengguna baru { id, email, role }
   */
  const updateUser = (userData) => {
    if (!userData?.id || !['USER', 'SELLER'].includes(userData?.role)) {
      console.error('Data pengguna tidak valid untuk pembaruan:', userData);
      toast.error('Data pengguna tidak valid');
      return;
    }
    // Map user.id ke sellerId untuk role SELLER
    const updatedUser = {
      ...userData,
      sellerId: userData.role === 'SELLER' ? userData.id : null,
    };
    localStorage.setItem('AdminUser', JSON.stringify(updatedUser));
    setUser(updatedUser);
    console.log('User diperbarui:', updatedUser);
  };

  /**
   * Fungsi untuk memperbarui token akses menggunakan refresh token
   * @returns {Promise<boolean>} - True jika berhasil, false jika gagal
   */
  const refreshAccessToken = async () => {
    if (!refreshToken) {
      console.error('Tidak ada refresh token tersedia');
      logout();
      toast.error('Sesi berakhir, silakan login kembali');
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
      console.log('Refresh token berhasil');
      return true;
    } catch (err) {
      console.error('Gagal memperbarui token:', err.message);
      logout();
      toast.error('Sesi berakhir, silakan login kembali');
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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};