import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Daftar endpoint publik yang tidak memerlukan token
const publicEndpoints = [
  '/product',
  '/categories',
  '/auth/login',
  '/seller',
];

// Simpan fungsi refreshAccessToken dari AuthContext
let refreshAccessTokenFn = null;

// Export setAuthContext untuk digunakan di AuthContext
export const setAuthContext = (context) => {
  if (!context?.refreshAccessToken) {
    console.warn('setAuthContext: refreshAccessToken function is missing in context');
    return;
  }
  refreshAccessTokenFn = context.refreshAccessToken;
};

axiosInstance.interceptors.request.use(
  (config) => {
    const isPublic = publicEndpoints.some((endpoint) => config.url.includes(endpoint));

    if (!isPublic) {
      const token = localStorage.getItem('Admintoken');
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      } else {
        console.warn(`No token for non-public endpoint: ${config.url}`);
      }
    }
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const isPublic = publicEndpoints.some((endpoint) => originalRequest.url.includes(endpoint));

    if (error.response?.status === 401 && !isPublic && !originalRequest._retry) {
      originalRequest._retry = true;
      if (refreshAccessTokenFn) {
        try {
          const refreshed = await refreshAccessTokenFn();
          if (refreshed) {
            originalRequest.headers['Authorization'] = `Bearer ${localStorage.getItem('Admintoken')}`;
            return axiosInstance(originalRequest);
          }
        } catch (refreshError) {
          console.error('Token refresh error:', refreshError.message);
        }
      }

      localStorage.removeItem('Admintoken');
      localStorage.removeItem('AdminRefreshToken');
      localStorage.removeItem('AdminUser');

      const user = JSON.parse(localStorage.getItem('AdminUser') || '{}');
      const loginPath = user?.role === 'USER' ? '/user/login' : '/seller/login';
      if (window.location.pathname !== loginPath) {
        window.location.href = loginPath;
      }
      return Promise.reject(new Error('Session expired, please login again'));
    }

    const errorMessage = error.response?.data?.message || 'Server error occurred';
    return Promise.reject(new Error(errorMessage));
  }
);

export default axiosInstance;