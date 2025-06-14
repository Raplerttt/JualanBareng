import React, { useState, useCallback, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../utils/axios"; // Axios instance
import { AuthContext } from "../auth/authContext"; // Context login
import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";

const AuthFormSellerRegister = ({ buttonText = "Register" }) => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    storeName: "",
    email: "",
    phoneNumber: "",
    address: "",
    city: "",
    latitude: -6.2088, // Default: Jakarta
    longitude: 106.8456,
    photo: null, // File object
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Google Maps setup
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "YOUR_GOOGLE_MAPS_API_KEY", // Replace with your API key
  });

  const mapContainerStyle = {
    width: "100%",
    height: "300px",
    marginBottom: "1rem",
  };

  const handleMapClick = (e) => {
    setFormData({
      ...formData,
      latitude: e.latLng.lat(),
      longitude: e.latLng.lng(),
    });
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  const validate = () => {
    const newErrors = {};
    const {
      storeName,
      email,
      phoneNumber,
      address,
      city,
      latitude,
      longitude,
      photo,
      password,
      confirmPassword,
    } = formData;

    if (!storeName || storeName.length < 3 || storeName.length > 100) {
      newErrors.storeName = "Nama toko harus 3-100 karakter.";
    }
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Format email tidak valid.";
    }
    if (!phoneNumber || !/^\+?\d{10,15}$/.test(phoneNumber)) {
      newErrors.phoneNumber = "Nomor telepon harus 10-15 digit dan dapat dimulai dengan +.";
    }
    if (!address || address.length < 5 || address.length > 255) {
      newErrors.address = "Alamat harus 5-255 karakter.";
    }
    if (!city || city.length < 2 || city.length > 100) {
      newErrors.city = "Kota harus 2-100 karakter.";
    }
    if (!latitude || isNaN(latitude) || latitude < -90 || latitude > 90) {
      newErrors.latitude = "Latitude harus antara -90 dan 90.";
    }
    if (!longitude || isNaN(longitude) || longitude < -180 || longitude > 180) {
      newErrors.longitude = "Longitude harus antara -180 dan 180.";
    }
    if (!photo || !["image/jpeg", "image/png"].includes(photo.type)) {
      newErrors.photo = "Foto harus berupa file JPEG atau PNG.";
    } else if (photo.size > 5 * 1024 * 1024) {
      newErrors.photo = "Foto tidak boleh lebih dari 5MB.";
    }
    if (
      !password ||
      password.length < 8 ||
      password.length > 30 ||
      !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/.test(password)
    ) {
      newErrors.password =
        "Password harus 8-30 karakter, mengandung huruf besar, kecil, angka & simbol.";
    }
    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Password tidak cocok.";
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
  
    const {
      storeName,
      email,
      phoneNumber,
      address,
      city,
      latitude,
      longitude,
      photo,
      password,
    } = formData;
  
    const formDataToSend = new FormData();
    formDataToSend.append("storeName", storeName);
    formDataToSend.append("email", email);
    formDataToSend.append("phoneNumber", phoneNumber);
    formDataToSend.append("address", address);
    formDataToSend.append("city", city);
    formDataToSend.append("latitude", parseFloat(latitude));
    formDataToSend.append("longitude", parseFloat(longitude));
    formDataToSend.append("photo", photo);
    formDataToSend.append("password", password);
    formDataToSend.append("role", "SELLER");
  
    try {
      setLoading(true);
      const response = await axios.post("/seller", formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });
  
      console.log("✅ Registrasi berhasil:", response.data);
  
      const { data } = response.data;
      if (data) {
        // ✅ Langsung arahkan ke login, tanpa login otomatis
        navigate("/seller/login");
      } else {
        setError({ general: "Registrasi gagal: Respons tidak valid dari server." });
      }
    } catch (error) {
      console.error("❌ Error response:", error.response?.data || error.message);
      const errorMessage =
        error.response?.data?.message || "Terjadi kesalahan saat registrasi.";
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
      <h2 className="text-2xl font-bold text-center mb-6">Register as a Seller</h2>

      {error.general && (
        <p className="text-red-500 text-sm text-center mb-4">{error.general}</p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <InputField
          label="Nama Toko"
          name="storeName"
          value={formData.storeName}
          onChange={handleChange}
          error={error.storeName}
        />
        <InputField
          label="Email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          error={error.email}
        />
        <InputField
          label="Nomor Telepon"
          name="phoneNumber"
          value={formData.phoneNumber}
          onChange={handleChange}
          error={error.phoneNumber}
        />
        <InputField
          label="Alamat"
          name="address"
          value={formData.address}
          onChange={handleChange}
          error={error.address}
        />
        <InputField
          label="Kota"
          name="city"
          value={formData.city}
          onChange={handleChange}
          error={error.city}
        />
        <div>
          <label className="block mb-1 font-semibold">Lokasi Toko</label>
          {isLoaded ? (
            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              center={{ lat: formData.latitude, lng: formData.longitude }}
              zoom={12}
              onClick={handleMapClick}
            >
              <Marker position={{ lat: formData.latitude, lng: formData.longitude }} />
            </GoogleMap>
          ) : (
            <p className="text-red-500 text-sm">Memuat peta...</p>
          )}
          {(error.latitude || error.longitude) && (
            <p className="text-red-500 text-sm mt-1">
              {error.latitude || error.longitude}
            </p>
          )}
        </div>
        <InputField
          label="Foto Toko"
          name="photo"
          type="file"
          accept="image/jpeg,image/png"
          onChange={handleChange}
          error={error.photo}
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
        <PasswordField
          label="Konfirmasi Password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          showPassword={showPassword}
          togglePasswordVisibility={togglePasswordVisibility}
          error={error.confirmPassword}
        />

        <div className="flex items-center justify-between">
          <span className="text-sm">
            Sudah punya akun?{" "}
            <a href="/seller/login" className="text-blue-600 underline">
              Login
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
        <button
          onClick={() => navigate("/user/register")}
          className="text-blue-500 hover:underline"
        >
          Daftar sebagai Pengguna
        </button>
      </div>
    </div>
  );
};

// Input Field Component
const InputField = ({ label, name, type = "text", value, onChange, error, ...props }) => (
  <div>
    <label className="block mb-1 font-semibold">{label}</label>
    <input
      type={type}
      name={name}
      value={type !== "file" ? value : undefined}
      onChange={onChange}
      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
      {...props}
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

export default AuthFormSellerRegister;