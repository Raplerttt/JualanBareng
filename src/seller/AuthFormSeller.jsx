import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../utils/axios"; // Import instance axios yang sudah dikonfigurasi

const AuthFormSellerLogin = ({ buttonText = "Login" }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await axios.post(
        "/seller/login", // Pastikan URL ini sesuai dengan endpoint backend Anda
        formData, // Kirim formData langsung
        { headers: { "Content-Type": "application/json" } }
      );

      const data = response.data;
      console.log("✅ Login berhasil:", data);
      // Simpan token di localStorage atau state management jika diperlukan
      localStorage.setItem("token", data.token);
      localStorage.setItem("refreshToken", data.refreshToken);

      // Redirect ke halaman dashboard atau yang sesuai
      navigate("/seller/dashboard"); // Ganti dengan rute yang sesuai
    } catch (err) {
      console.error("❌ Error response:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full p-8">
      <h2 className="text-2xl font-bold text-white mb-6 text-center">Login as a Seller</h2>
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="block text-white">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-green-300"
          />
        </div>
        <div>
          <label className="block text-white">Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-green-300"
          />
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center justify-start w-1/2">
            <div className="mt-4 text-sm">
              <span className="text-white">Don't have an account? </span>
              <a href="/seller/register" className="text-blue-500 hover:underline">
                Register as Seller
              </a>
            </div>
          </div>
          <div className="flex items-center justify-end w-1/2">
            <button
              type="submit"
              className="px-6 py-2 rounded-lg text-white font-medium"
              style={{
                background: "linear-gradient(90deg, #091057, #024CAA)",
              }}
              disabled={loading}
            >
              {loading ? "Processing..." : buttonText}
            </button>
          </div>
        </div>
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 w-full">
          <button
            className="flex-1 px-4 py-2 rounded-lg shadow"
            style={{
              background: 'linear-gradient(90deg, #091057, #024CAA)',
              color: 'white',
            }}
            onClick={() => navigate('/user/login')}
          >
            Login as User
          </button>
        </div>
      </form>
    </div>
  );
};

export default AuthFormSellerLogin;