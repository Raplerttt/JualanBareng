import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../utils/axios"; // Import instance axios yang sudah dikonfigurasi

const AuthFormSellerRegister = ({ buttonText = "Register" }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    storeName: "",
    email: "",
    phoneNumber: "", // Menggunakan phoneNumber sesuai dengan JSON
    password: "",
    confirmPassword: "",
    location: "", // Menambahkan field untuk location
  });
  
  const [error, setError] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const newErrors = {};
    const { storeName, email, phoneNumber, password, confirmPassword, location } = formData;

    if (!storeName || storeName.length < 3 || storeName.length > 50) {
      newErrors.storeName = "Store name must be 3-50 characters long.";
    }
    if (!phoneNumber || !/^\+?\d{10,15}$/.test(phoneNumber)) {
      newErrors.phoneNumber = "Phone number must be 10-15 digits and can start with +.";
    }
    if (!location) {
      newErrors.location = "Location is required.";
    }
    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Invalid email format.";
    }
    if (!password || password.length < 8 || password.length > 30 || !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/.test(password)) {
      newErrors.password = "Password must be 8-30 characters long and contain uppercase, lowercase, number, and symbol.";
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Validate input
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setError(validationErrors);
      return;
    }
  
    const { storeName, email, phoneNumber, password, location } = formData;
  
    const userData = {
      storeName,
      email,
      phoneNumber,
      password,
      location,
    };
  
    console.log("📤 Data yang dikirim ke backend:", userData); // Debugging
  
    try {
      const response = await axios.post(
        "/seller/", // Pastikan URL ini sesuai dengan endpoint backend Anda
        userData,
        { headers: { "Content-Type": "application/json" } }
      );
  
      console.log("✅ Registrasi berhasil:", response.data);
      navigate("/seller/login"); // Redirect ke halaman login setelah registrasi
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
      <h2 className="text-2xl font-bold text-white mb-6 text-center">Register as a Seller</h2>
      {error.general && <p className="text-red-500 text-sm mb-4">{error.general}</p>}
      <form className="space-y-4" onSubmit={handleSubmit}>
        <InputField label="Store Name" name="storeName" value={formData.storeName} onChange={handleChange} error={error.storeName} />
        <InputField label="Email" name="email" value={formData.email} onChange={handleChange} error={error.email} />
        <InputField label="Phone Number" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} error={error.phoneNumber} />
        <InputField label="Location" name="location" value={formData.location} onChange={handleChange} error={error.location} />
        <PasswordField label="Password" name="password" value={formData.password} onChange={handleChange} showPassword={showPassword} togglePasswordVisibility={togglePasswordVisibility} error={error.password} />
        <PasswordField label="Confirm Password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} showPassword={showPassword} togglePasswordVisibility={togglePasswordVisibility} error={error.confirmPassword} />
        <div className="flex items-center justify-between">
          <div className="text-sm text-white">
            Already have an account? <a href="/seller/login" className="text-blue-500 hover:underline">Login</a>
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
    <label className="block text-white">{label}</label>
    <input type="text" name={name} value={value} onChange={onChange} className="w-full px-4 py-2 border rounded-lg focus:ring-green-300" />
    {error && <p className="text-red-500 text-sm">{error}</p>}
  </div>
);

const PasswordField = ({ label, name, value, onChange, showPassword, togglePasswordVisibility, error }) => (
  <div>
    <label className="block text-white">{label}</label>
    <div className="relative">
      <input type={showPassword ? "text" : "password"} name={name} value={value} onChange={onChange} className="w-full px-4 py-2 border rounded-lg focus:ring-green-300" />
      <button type="button" onClick={togglePasswordVisibility} className="absolute inset-y-0 right-0 px-3 flex items-center text-sm">
        {showPassword ? "👁️" : "👁️‍🗨️"}
      </button>
    </div>
    {error && <p className="text-red-500 text-sm">{error}</p>}
  </div>
);

export default AuthFormSellerRegister;
