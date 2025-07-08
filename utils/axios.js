import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Daftar endpoint publik yang tidak memerlukan token
const publicEndpoints = [
  '/api/product',
  '/api/categories',
  '/api/auth/login', // Perbaiki endpoint login
  '/api/register',
  '/api/',
];

// Simpan fungsi refreshAccessToken dari AuthContext
let refreshAccessTokenFn = null;

export const setAuthContext = (context) => {
  refreshAccessTokenFn = context.refreshAccessToken;
};

axiosInstance.interceptors.request.use(
  (config) => {
    const isPublic = publicEndpoints.some((endpoint) => config.url.startsWith(endpoint));

    if (!isPublic) {
      const token = localStorage.getItem('Admintoken');
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      } else {
        console.warn(`Tidak ada token ditemukan untuk endpoint: ${config.url}`);
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response?.status === 401 &&
      !publicEndpoints.some((endpoint) => originalRequest.url.startsWith(endpoint)) &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      if (refreshAccessTokenFn) {
        console.log('Mencoba refresh token...');
        const refreshed = await refreshAccessTokenFn();
        if (refreshed) {
          console.log('Token berhasil diperbarui');
          originalRequest.headers['Authorization'] = `Bearer ${localStorage.getItem('Admintoken')}`;
          return axiosInstance(originalRequest);
        }
      }
      console.error('Permintaan tidak diizinkan. Mengarahkan ke login...');
      localStorage.removeItem('Admintoken');
      localStorage.removeItem('AdminRefreshToken');
      localStorage.removeItem('AdminUser');
      if (window.location.pathname !== '/user/login') {
        window.location.href = '/user/login';
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;