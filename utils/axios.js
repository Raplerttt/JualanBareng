import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:3000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Daftar endpoint publik yang tidak memerlukan token
const publicEndpoints = [
  "/product",
  "/categories",
  "/login",
  "/register",
  "/",
];

axiosInstance.interceptors.request.use(
  (config) => {
    // Cek apakah endpoint adalah publik
    const isPublic = publicEndpoints.some((endpoint) =>
      config.url.startsWith(endpoint)
    );

    if (!isPublic) {
      // Daftar kunci token yang mungkin digunakan
      const tokenKeys = ["Sellertoken", "Admintoken", "Usertoken", "token"];
      let token = null;

      // Coba ambil token dari salah satu kunci
      for (const key of tokenKeys) {
        token = localStorage.getItem(key);
        if (token) {
          console.log(`Token ditemukan dengan kunci: ${key}`);
          break;
        }
      }

      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
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
  (error) => {
    if (error.response && error.response.status === 401) {
      // Cek apakah endpoint adalah publik
      const isPublic = publicEndpoints.some((endpoint) =>
        error.config.url.startsWith(endpoint)
      );

      if (!isPublic) {
        console.error("Permintaan tidak diizinkan. Mengarahkan ke login...");
        // Hapus semua token
        ["Sellertoken", "Admintoken", "Usertoken", "token"].forEach((key) =>
          localStorage.removeItem(key)
        );
        // Arahkan ke login jika tidak sudah di halaman login
        if (window.location.pathname !== "/user/login") {
          window.location.href = "/user/login";
        }
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;