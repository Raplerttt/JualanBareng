import React, { useState, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { AuthService } from '../auth/authService';
import { GoogleMap, useLoadScript, Marker } from '@react-google-maps/api';

const RegisterPage = ({ buttonText = 'Daftar' }) => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    storeName: '',
    email: '',
    phoneNumber: '',
    address: '',
    city: '',
    latitude: -6.2088, // Default: Jakarta
    longitude: 106.8456,
    nik: '',
    ktpUrlBase64: '',
    usahaProofUrlBase64: '',
    photoBase64: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previews, setPreviews] = useState({
    ktp: null,
    usahaProof: null,
    photo: null,
  });

  // Google Maps setup
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: 'YOUR_GOOGLE_MAPS_API_KEY', // Ganti dengan API key Anda
  });

  const mapContainerStyle = {
    width: '100%',
    height: '300px',
  };

  const base64ImageRegex = /^data:image\/(jpeg|png);base64,[A-Za-z0-9+/=]+$/;

  const handleMapClick = (e) => {
    setFormData({
      ...formData,
      latitude: e.latLng.lat(),
      longitude: e.latLng.lng(),
    });
    setErrors((prev) => ({ ...prev, latitude: null, longitude: null }));
  };

  const handleFileChange = useCallback((e) => {
    const { name, files } = e.target;
    if (files[0]) {
      const file = files[0];
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          [name]: 'Ukuran file tidak boleh lebih dari 5MB.',
        }));
        return;
      }
      if (!['image/jpeg', 'image/png'].includes(file.type)) {
        setErrors((prev) => ({
          ...prev,
          [name]: 'File harus berupa JPEG atau PNG.',
        }));
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        if (!base64ImageRegex.test(base64String)) {
          setErrors((prev) => ({
            ...prev,
            [name]: 'File gambar tidak valid.',
          }));
          return;
        }
        setFormData((prev) => ({
          ...prev,
          [name]: base64String,
        }));
        setPreviews((prev) => ({
          ...prev,
          [name === 'ktpUrlBase64' ? 'ktp' : name === 'usahaProofUrlBase64' ? 'usahaProof' : 'photo']: URL.createObjectURL(file),
        }));
        setErrors((prev) => ({ ...prev, [name]: null }));
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => ({ ...prev, [name]: null, general: null }));
  }, []);

  const validate = useCallback(() => {
    const newErrors = {};
    const {
      storeName,
      email,
      phoneNumber,
      address,
      city,
      latitude,
      longitude,
      nik,
      ktpUrlBase64,
      usahaProofUrlBase64,
      photoBase64,
      password,
    } = formData;

    if (!storeName.trim()) newErrors.storeName = 'Nama toko wajib diisi.';
    if (!email || !/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Format email tidak valid.';
    if (!phoneNumber.trim()) newErrors.phoneNumber = 'Nomor telepon wajib diisi.';
    else if (!/^\+?\d{10,15}$/.test(phoneNumber)) {
      newErrors.phoneNumber = 'Nomor telepon harus 10-15 digit.';
    }
    if (!address.trim()) newErrors.address = 'Alamat wajib diisi.';
    if (!city.trim()) newErrors.city = 'Kota wajib diisi.';
    else if (!city.toLowerCase().includes('labuan')) {
      newErrors.city = 'Pendaftaran hanya untuk wilayah Desa Labuan.';
    }
    if (latitude && (isNaN(latitude) || latitude < -90 || latitude > 90)) {
      newErrors.latitude = 'Latitude harus antara -90 dan 90.';
    }
    if (longitude && (isNaN(longitude) || longitude < -180 || longitude > 180)) {
      newErrors.longitude = 'Longitude harus antara -180 dan 180.';
    }
    if (!nik || nik.length !== 16 || !/^\d+$/.test(nik)) {
      newErrors.nik = 'NIK harus 16 digit angka.';
    }
    if (!ktpUrlBase64) newErrors.ktpUrlBase64 = 'Foto KTP wajib diunggah.';
    else if (!base64ImageRegex.test(ktpUrlBase64)) {
      newErrors.ktpUrlBase64 = 'Foto KTP harus berupa string base64 yang valid.';
    }
    if (!usahaProofUrlBase64) newErrors.usahaProofUrlBase64 = 'Foto bukti usaha wajib diunggah.';
    else if (!base64ImageRegex.test(usahaProofUrlBase64)) {
      newErrors.usahaProofUrlBase64 = 'Foto bukti usaha harus berupa string base64 yang valid.';
    }
    if (photoBase64 && !base64ImageRegex.test(photoBase64)) {
      newErrors.photoBase64 = 'Foto profil harus berupa string base64 yang valid.';
    }
    if (!password || password.length < 6) {
      newErrors.password = 'Password harus minimal 6 karakter.';
    }

    return newErrors;
  }, [formData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error('Periksa kembali input Anda');
      return;
    }

    const formDataToSend = {
      storeName: formData.storeName.trim(),
      email: formData.email.trim(),
      phoneNumber: formData.phoneNumber.trim(),
      address: formData.address.trim(),
      city: formData.city.trim(),
      latitude: parseFloat(formData.latitude) || undefined,
      longitude: parseFloat(formData.longitude) || undefined,
      nik: formData.nik.trim(),
      ktpUrlBase64: formData.ktpUrlBase64,
      usahaProofUrlBase64: formData.usahaProofUrlBase64,
      photoBase64: formData.photoBase64 || undefined,
      password: formData.password,
      role: 'SELLER',
    };

    // Cek apakah semua field wajib ada
    const requiredFields = ['storeName', 'email', 'phoneNumber', 'address', 'city', 'nik', 'ktpUrlBase64', 'usahaProofUrlBase64', 'password'];
    const missingFields = requiredFields.filter(field => !formDataToSend[field]);
    if (missingFields.length > 0) {
      setErrors({ general: `Field wajib berikut belum diisi: ${missingFields.join(', ')}` });
      toast.error('Lengkapi semua field wajib.');
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await AuthService.register(formDataToSend);
      toast.success('Registrasi berhasil! Silakan login.');
      navigate('/seller/login');
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || 
        (error.response?.data?.errors 
          ? error.response.data.errors.map(err => err.msg).join(', ') 
          : 'Terjadi kesalahan saat registrasi.');
      setErrors({ general: errorMessage });
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
      Object.values(previews).forEach((preview) => {
        if (preview) URL.revokeObjectURL(preview);
      });
    }
  };

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gray-50 flex items-center justify-center p-4"
    >
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-8">
          {/* Form Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="md:col-span-2 space-y-6"
          >
            <h2 className="text-3xl font-bold text-gray-800 text-center">Daftar Sebagai Penjual</h2>
            {errors.general && (
              <p className="text-red-500 text-sm text-center">{errors.general}</p>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <InputField
                label="Nama Toko"
                name="storeName"
                value={formData.storeName}
                onChange={handleChange}
                error={errors.storeName}
                required
              />
              <InputField
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
                required
              />
              <InputField
                label="Nomor Telepon"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                error={errors.phoneNumber}
                required
              />
              <InputField
                label="Alamat"
                name="address"
                value={formData.address}
                onChange={handleChange}
                error={errors.address}
                required
              />
              <InputField
                label="Kota"
                name="city"
                value={formData.city}
                onChange={handleChange}
                error={errors.city}
                required
              />
              <InputField
                label="NIK"
                name="nik"
                value={formData.nik}
                onChange={handleChange}
                error={errors.nik}
                required
              />
              <InputField
                label="Foto KTP"
                name="ktpUrlBase64"
                type="file"
                accept="image/jpeg,image/png"
                onChange={handleFileChange}
                error={errors.ktpUrlBase64}
                required
              />
              {previews.ktp && (
                <img
                  src={previews.ktp}
                  alt="Pratinjau KTP"
                  className="w-24 h-24 object-cover rounded-lg mt-2"
                />
              )}
              <InputField
                label="Foto Bukti Usaha"
                name="usahaProofUrlBase64"
                type="file"
                accept="image/jpeg,image/png"
                onChange={handleFileChange}
                error={errors.usahaProofUrlBase64}
                required
              />
              {previews.usahaProof && (
                <img
                  src={previews.usahaProof}
                  alt="Pratinjau Bukti Usaha"
                  className="w-24 h-24 object-cover rounded-lg mt-2"
                />
              )}
              <InputField
                label="Foto Toko (Opsional)"
                name="photoBase64"
                type="file"
                accept="image/jpeg,image/png"
                onChange={handleFileChange}
                error={errors.photoBase64}
              />
              {previews.photo && (
                <img
                  src={previews.photo}
                  alt="Pratinjau Foto Toko"
                  className="w-24 h-24 object-cover rounded-lg mt-2"
                />
              )}
              <PasswordField
                label="Kata Sandi"
                name="password"
                value={formData.password}
                onChange={handleChange}
                showPassword={showPassword}
                togglePasswordVisibility={togglePasswordVisibility}
                error={errors.password}
                required
              />
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="text-sm text-gray-600">
                  Sudah punya akun?{' '}
                  <Link to="/seller/login" className="text-[#80CBC4] hover:underline">
                    Masuk
                  </Link>
                </span>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  disabled={isSubmitting}
                  className={`px-6 py-2 bg-[#80CBC4] text-white rounded-full font-semibold hover:bg-[#3fcec0] transition-colors duration-200 ${
                    isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {isSubmitting ? 'Memuat...' : buttonText}
                </motion.button>
              </div>
            </form>
            <div className="mt-4 text-center">
              <Link to="/user/register" className="text-[#80CBC4] hover:underline text-sm">
                Daftar sebagai Pengguna
              </Link>
            </div>
          </motion.div>
          {/* Map Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="md:col-span-1"
          >
            <label className="block text-sm font-medium text-gray-700 mb-1">Lokasi Toko</label>
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
            {(errors.latitude || errors.longitude) && (
              <p className="text-red-500 text-sm mt-1">{errors.latitude || errors.longitude}</p>
            )}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

const InputField = ({ label, name, type = 'text', value, onChange, error, ...props }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <input
      id={name}
      type={type}
      name={name}
      value={type !== 'file' ? value : undefined}
      onChange={onChange}
      className={`block w-full py-2 px-3 border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#80CBC4] focus:border-[#80CBC4] transition-all duration-200 hover:shadow-sm ${
        error ? 'border-red-500' : ''
      }`}
      aria-invalid={!!error}
      aria-describedby={error ? `${name}-error` : undefined}
      {...props}
    />
    {error && (
      <p id={`${name}-error`} className="text-red-500 text-sm mt-1">
        {error}
      </p>
    )}
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
  ...props
}) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <div className="relative">
      <input
        id={name}
        type={showPassword ? 'text' : 'password'}
        name={name}
        value={value}
        onChange={onChange}
        className={`block w-full py-2 px-3 border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#80CBC4] focus:border-[#80CBC4] transition-all duration-200 hover:shadow-sm ${
          error ? 'border-red-500' : ''
        }`}
        aria-invalid={!!error}
        aria-describedby={error ? `${name}-error` : undefined}
        {...props}
      />
      <button
        type="button"
        onClick={togglePasswordVisibility}
        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-[#80CBC4]"
        aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
      >
        {showPassword ? '🙈' : '👁️'}
      </button>
    </div>
    {error && (
      <p id={`${name}-error`} className="text-red-500 text-sm mt-1">
        {error}
      </p>
    )}
  </div>
);

export default RegisterPage;