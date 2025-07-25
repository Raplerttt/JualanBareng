import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../utils/axios"; // Import instance axios yang sudah dikonfigurasi

const AuthFormRegister = ({ buttonText = "Register" }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
  });
  
  const [error, setError] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const newErrors = {};
    const { fullName, email, phoneNumber, password, confirmPassword } = formData;

    if (!fullName || fullName.length < 3 || fullName.length > 50 || !/^[a-zA-Z\s]+$/.test(fullName)) {
      newErrors.fullName = "Nama lengkap harus 3-50 karakter dan hanya huruf/spasi";
    }
    if (!phoneNumber || !/^\+?\d{10,15}$/.test(phoneNumber)) {
      newErrors.phoneNumber = "Nomor telepon harus 10-15 digit dan bisa dimulai dengan +";
    }
    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Password tidak cocok";
    }
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Format email tidak valid";
    }
    if (!password || password.length < 8 || password.length > 30 || !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/.test(password)) {
      newErrors.password = "Password harus 8-30 karakter, mengandung huruf besar, kecil, angka & simbol";
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Validasi input
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setError(validationErrors);
      return;
    }
  
    const { fullName, email, phoneNumber, password } = formData;
  
    const userData = {
      fullName,
      email,
      phoneNumber,
      password,
    };
  
    console.log("📤 Data yang dikirim ke backend:", userData); // Debugging
  
    try {
      const response = await axios.post(
        "auth/register",
        userData,
        { headers: { "Content-Type": "application/json" } }
      );
  
      console.log("✅ Registrasi berhasil:", response.data);
      navigate("/user/login"); // Redirect ke halaman login setelah registrasi
    } catch (error) {
      console.error("❌ Error response:", error.response?.data || error.message);
      setError({ general: error.response?.data?.message || "Terjadi kesalahan!" });
    }
  };

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  return (
    <div className="w-full p-8">
      <h2 className="text-2xl font-bold text-black mb-6 text-center">Register Sebagai User</h2>
      {error.general && <p className="text-red-500 text-sm mb-4">{error.general}</p>}
      <form className="space-y-4" onSubmit={handleSubmit}>
        <InputField label="Nama Lengkap" name="fullName" value={formData.fullName} onChange={handleChange} error={error.fullName} />
        <InputField label="Email" name="email" value={formData.email} onChange={handleChange} error={error.email} />
        <InputField label="Nomer Handphone" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} error={error.phoneNumber} />
        <PasswordField label="Password" name="password" value={formData.password} onChange={handleChange} showPassword={showPassword} togglePasswordVisibility={togglePasswordVisibility} error={error.password} />
        <PasswordField label="Konfirmasi Password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} showPassword={showPassword} togglePasswordVisibility={togglePasswordVisibility} error={error.confirmPassword} />
        <div className="flex items-center justify-between">
          <div className="text-sm text-black">
            Sudah Mempunyai Akun? <a href="/user/login" className="text-blue-500 hover:underline">Masuk</a>
          </div>
          <button type="submit" className="px-6 py-2 rounded-lg text-white font-medium bg-gradient-to-r from-blue-700 to-blue-500">
            {buttonText}
          </button>
        </div>
      </form>
    </div>
  );
};

const InputField = ({ label, name, value, onChange, error }) => (
  <div>
    <label className="block text-black">{label}</label>
    <input type="text" name={name} value={value} onChange={onChange} className="w-full px-4 py-2 border rounded-lg focus:ring-green-300" />
    {error && <p className="text-red-500 text-sm">{error}</p>}
  </div>
);

const PasswordField = ({ label, name, value, onChange, showPassword, togglePasswordVisibility, error }) => (
  <div>
    <label className="block text-black">{label}</label>
    <div className="relative">
      <input type={showPassword ? "text" : "password"} name={name} value={value} onChange={onChange} className="w-full px-4 py-2 border rounded-lg focus:ring-green-300" />
      <button type="button" onClick={togglePasswordVisibility} className="absolute inset-y-0 right-0 px-3 flex items-center text-sm">
        {showPassword ? "👁️" : "👁️‍🗨️"}
      </button>
    </div>
    {error && <p className="text-red-500 text-sm">{error}</p>}
  </div>
);

export default AuthFormRegister;
