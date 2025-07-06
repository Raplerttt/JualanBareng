import React, { useState, useCallback, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../utils/axios"; // Axios instance
import { AuthContext } from "../auth/authContext"; // Context login

const AuthFormUser = ({ buttonText = "Login" }) => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const newErrors = {};
    const { email, password } = formData;

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Format email tidak valid";
    }
    if (
      !password ||
      password.length < 8 ||
      password.length > 30 ||
      !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/.test(password)
    ) {
      newErrors.password =
        "Password harus 8-30 karakter, mengandung huruf besar, kecil, angka & simbol";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError({});
    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setError(validationErrors);
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(
        "/auth/login",
        {
          email: formData.email,
          password: formData.password,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      const { token, data } = response.data;

      if (token && data) {
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(data));

        login(data);
        navigate("/");
      } else {
        setError({ general: "Login gagal: Respons tidak valid dari server." });
      }
    } catch (error) {
      console.error("❌ Login error:", error.response?.data || error.message);
      const errorMessage =
        error.response?.data?.message ||
        "Terjadi kesalahan saat login. Silakan coba lagi.";
      setError({ general: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  return (
    <div className="w-full max-w-md mx-auto p-8 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center mb-6">Login Sebagai User</h2>

      {error.general && (
        <p className="text-red-500 text-sm text-center mb-4">{error.general}</p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <InputField
          label="Email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          error={error.email}
        />

        <PasswordField
          label="Password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          showPassword={showPassword}
          togglePasswordVisibility={togglePasswordVisibility}
          error={error.password}
        />

        <div className="flex items-center justify-between">
          <span className="text-sm">
            Belum punya akun?{" "}
            <a href="/user/register" className="text-blue-600 underline">
              Daftar
            </a>
          </span>
          <button
            type="submit"
            disabled={loading}
            className={`px-6 py-2 rounded-lg text-white font-semibold bg-blue-600 hover:bg-blue-700 ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Loading..." : buttonText}
          </button>
        </div>
      </form>

      <div className="mt-4 text-center">
        <a href="/forgot-password" className="text-blue-500 hover:underline">
          Lupa Password?
        </a>
      </div>
    </div>
  );
};

// Input Field Component
const InputField = ({ label, name, value, onChange, error }) => (
  <div>
    <label className="block mb-1 font-semibold">{label}</label>
    <input
      type="text"
      name={name}
      value={value}
      onChange={onChange}
      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
    />
    {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
  </div>
);

// Password Field Component
const PasswordField = ({
  label,
  name,
  value,
  onChange,
  showPassword,
  togglePasswordVisibility,
  error,
}) => (
  <div>
    <label className="block mb-1 font-semibold">{label}</label>
    <div className="relative">
      <input
        type={showPassword ? "text" : "password"}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
      <button
        type="button"
        onClick={togglePasswordVisibility}
        className="absolute right-2 top-2 text-gray-600"
      >
        {showPassword ? "🙈" : "👁️"}
      </button>
    </div>
    {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
  </div>
);

export default AuthFormUser;
