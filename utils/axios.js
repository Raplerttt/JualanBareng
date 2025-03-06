import axios from "axios";

export default axios.create({
  baseURL: "http://localhost:3000/api",
  headers: {
    "Content-Type": "application/json",
  },
});
// const axiosInstance = axios.create({
  axios.interceptors.request.use(
    (config) => {
      const token = sessionStorage.getItem("token"); // Ambil token dari sessionStorage
      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`; // Menyertakan token dalam header
      }
      return config; // Mengembalikan konfigurasi yang telah diperbarui
    },
    (error) => {
      return Promise.reject(error); // Menangani error jika ada
    }
);