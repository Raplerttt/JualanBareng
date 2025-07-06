import React, { useState, useCallback, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "../../utils/axios";
import { AuthContext } from "../auth/authContext";

const AuthFormSellerLogin = ({ buttonText = "Login" }) => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError((prev) => ({ ...prev, [e.target.name]: "" }));
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
        formData,
        { headers: { "Content-Type": "application/json" } }
      );
  
      const { token, data } = response.data;
  
      if (token && data) {
        if (data.role !== "SELLER") {
          setError({ general: "Akun ini bukan akun penjual." });
          return;
        }
  
        // Simpan ke localStorage
        localStorage.setItem("Sellertoken", token);
        localStorage.setItem("SellerUser", JSON.stringify(data)); // ✅ SIMPAN dengan key yang sesuai
        localStorage.setItem("role", data.role);
        localStorage.setItem("refreshToken", data.refreshToken);
  
        // Update context state
        login({
          userData: data,
          token: token,
          refreshToken: data.refreshToken,
          role: data.role
        });
  
        navigate("/seller/dashboard");
      } else {
        setError({ general: "Login gagal: Respons tidak valid dari server." });
      }
    } catch (error) {
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
      <h2 className="text-2xl font-bold text-center mb-6">Login Penjual</h2>

      {error.general && (
        <p className="text-red-500 text-sm text-center mb-4">{error.general}</p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <InputField
          label="Email"
          type="email"
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

        <div className="flex items-center justify-between flex-wrap gap-2">
          <span className="text-sm">
            Belum punya akun?{" "}
            <Link to="/seller/register" className="text-blue-600 underline">
              Daftar di sini
            </Link>
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
        <Link to="/forgot-password" className="text-blue-500 hover:underline">
          Lupa Password?
        </Link>
      </div>

      <div className="mt-4 text-center">
        <button
          onClick={() => navigate("/user/login")}
          className="text-blue-500 hover:underline"
        >
          Login sebagai Pengguna
        </button>
      </div>
    </div>
  );
};

const InputField = ({ label, name, value, onChange, error, type = "text" }) => (
  <div>
    <label className="block mb-1 font-semibold" htmlFor={name}>
      {label}
    </label>
    <input
      type={type}
      name={name}
      id={name}
      value={value}
      onChange={onChange}
      autoComplete={name}
      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
        error ? "border-red-500 ring-red-300" : "focus:ring-blue-400"
      }`}
    />
    {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
  </div>
);

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
    <label className="block mb-1 font-semibold" htmlFor={name}>
      {label}
    </label>
    <div className="relative">
      <input
        type={showPassword ? "text" : "password"}
        name={name}
        id={name}
        value={value}
        onChange={onChange}
        autoComplete="current-password"
        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
          error ? "border-red-500 ring-red-300" : "focus:ring-blue-400"
        }`}
      />
      <button
        type="button"
        onClick={togglePasswordVisibility}
        aria-label="Toggle password visibility"
        className="absolute right-2 top-2 text-gray-600 text-sm"
      >
        {showPassword ? "🙈" : "👁️"}
      </button>
    </div>
    {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
  </div>
);

export default AuthFormSellerLogin;
