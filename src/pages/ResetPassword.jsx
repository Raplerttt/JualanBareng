import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from '../../utils/axios';
import Main from '../components/layout/Main';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setSuccessMessage('');
      alert('Password tidak cocok');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('/auth/reset-password', {
        token,
        newPassword: password,
      });

      setSuccessMessage(response.data.message || 'Password berhasil direset');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error) {
      setSuccessMessage('');
      alert(error.response?.data?.message || 'Terjadi kesalahan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Main>
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 p-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 sm:p-8 transform transition-all duration-300 hover:shadow-3xl dark:bg-[#80CBC4] dark:border-gray-700 border-2 border-indigo-300">
          <div className="text-center">
            <h2 className="text-3xl font-semibold text-gray-900 dark:text-gray-800 mb-2">
              Reset Password
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-700">
              Silakan masukkan password baru untuk akun Anda.
            </p>
          </div>

          {successMessage && (
            <div className="mt-6 p-4 bg-green-50 text-green-700 rounded-lg text-center animate-fade-in">
              <p className="text-sm font-medium">{successMessage}</p>
              <p className="text-xs mt-1">Anda akan diarahkan ke halaman login...</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div className="relative">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-800 mb-2">
                Password Baru
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                placeholder="Masukkan password baru"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 ease-in-out shadow-sm dark:bg-gray-100 dark:border-gray-600 pr-12" // pr-12 untuk ruang ikon
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-1/2 mt-3 -translate-y-1/2 right-3 flex items-center text-gray-500 hover:text-gray-700 transition-colors"
              >
                {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
              </button>
            </div>

            <div className="relative">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-800 mb-2">
                Konfirmasi Password
              </label>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                placeholder="Konfirmasi password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 ease-in-out shadow-sm dark:bg-gray-100 dark:border-gray-600 pr-12" // pr-12 untuk ruang ikon
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute top-1/2 mt-3 -translate-y-1/2 right-3 flex items-center text-gray-500 hover:text-gray-700 transition-colors"
              >
                {showConfirmPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 ease-in-out transform hover:-translate-y-1 disabled:bg-indigo-400 disabled:cursor-not-allowed"
            >
              {loading ? 'Mengirim...' : 'Reset Password'}
            </button>
          </form>
        </div>
      </main>
    </Main>
  );
};

// Animasi fade-in untuk pesan sukses
const styles = `
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  .animate-fade-in {
    animation: fadeIn 0.5s ease-in-out;
  }
`;

export default ResetPassword;