import React, { useState, useCallback, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../utils/axios';
import { AuthContext } from '../auth/authContext';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

/**
 * Komponen form login untuk pengguna.
 * @param {Object} props - Props komponen.
 * @param {string} [props.buttonText='Masuk'] - Teks untuk tombol submit.
 */
const AuthFormUser = ({ buttonText = 'Masuk' }) => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: null, general: null }));
  }, []);

  const validate = useCallback(() => {
    const { email, password } = formData;
    const newErrors = {};

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Format email tidak valid';
    }

    if (
      !password ||
      password.length < 8 ||
      password.length > 30 ||
      !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/.test(password)
    ) {
      newErrors.password =
        'Password harus 8–30 karakter, mengandung huruf besar, kecil, angka, dan simbol';
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

    setIsSubmitting(true);

    try {
      const res = await axios.post(
        '/auth/login',
        { email: formData.email, password: formData.password },
        { headers: { 'Content-Type': 'application/json' } }
      );

      const { accessToken, refreshToken, user } = res.data.data;

      if (accessToken && user) {
        localStorage.setItem('Admintoken', accessToken);
        localStorage.setItem('AdminRefreshToken', refreshToken || '');
        localStorage.setItem('AdminUser', JSON.stringify(user));

        login(accessToken, refreshToken, user);
        toast.success('Login berhasil!');
        navigate('/');
      } else {
        throw new Error('Respons tidak valid dari server');
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || 'Terjadi kesalahan saat login. Silakan coba lagi.';
      setErrors({ general: errorMessage });
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
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
      className="w-full max-w-md mx-auto p-8 bg-white rounded-2xl shadow-lg"
    >
      <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">Masuk Sebagai Pengguna</h2>

      {errors.general && (
        <p className="text-red-500 text-sm text-center mb-4">{errors.general}</p>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <InputField
          label="Email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
        />
        <PasswordField
          label="Kata Sandi"
          name="password"
          value={formData.password}
          onChange={handleChange}
          showPassword={showPassword}
          togglePasswordVisibility={togglePasswordVisibility}
          error={errors.password}
        />
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">
            Belum punya akun?{' '}
            <a href="/user/register" className="text-indigo-600 hover:underline">
              Daftar
            </a>
          </span>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={isSubmitting}
            className={`px-6 py-2 bg-indigo-600 text-white rounded-full font-semibold hover:bg-indigo-700 transition-colors duration-200 ${
              isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isSubmitting ? 'Memuat...' : buttonText}
          </motion.button>
        </div>
      </form>

      <div className="mt-4 text-center">
        <a href="/forgot-password" className="text-indigo-500 hover:underline text-sm">
          Lupa Kata Sandi?
        </a>
      </div>
    </motion.div>
  );
};

/**
 * Komponen input field (contoh: email)
 */
const InputField = ({ label, name, value, onChange, error }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <input
      id={name}
      type="email"
      name={name}
      value={value}
      onChange={onChange}
      className="block w-full py-2 px-3 border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition-all duration-200"
      aria-invalid={!!error}
      aria-describedby={error ? `${name}-error` : undefined}
    />
    {error && (
      <p id={`${name}-error`} className="text-red-500 text-sm mt-1">
        {error}
      </p>
    )}
  </div>
);

/**
 * Komponen input password dengan toggle visibilitas
 */
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
        className="block w-full py-2 px-3 border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition-all duration-200"
        aria-invalid={!!error}
        aria-describedby={error ? `${name}-error` : undefined}
      />
      <button
        type="button"
        onClick={togglePasswordVisibility}
        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-indigo-600"
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

export default AuthFormUser;
