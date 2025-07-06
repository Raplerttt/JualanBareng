import React, { useState } from 'react';
import axios from '../../utils/axios';

const ForgotPassword = ({
  title = 'Forgot Password?',
  description = 'Remember your password?',
  loginLinkText = 'Login here',
  loginLinkHref = '/user/login',
  buttonText = 'Reset Password',
}) => {
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.currentTarget.email.value;
    setErrorMessage('');
    setSuccessMessage('');
    setLoading(true);

    try {
      const response = await axios.post('/auth/forgot-password', {
        email,
      });
      setSuccessMessage(response.data.message || 'Link reset password telah dikirim ke email Anda');
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Terjadi kesalahan saat memproses permintaan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main id="content" role="main" className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-gray-100 to-gray-200">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 sm:p-8 transform transition-all duration-300 hover:shadow-3xl dark:bg-[#80CBC4] dark:border-gray-700 border-2 border-indigo-300">
        <div className="text-center">
          <h1 className="text-3xl font-semibold text-gray-900 dark:text-gray-800 mb-3">
            {title}
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-700">
            {description}{' '}
            <a
              className="text-indigo-600 hover:text-indigo-700 font-medium underline decoration-2 hover:no-underline transition-colors"
              href={loginLinkHref}
            >
              {loginLinkText}
            </a>
          </p>
        </div>

        {successMessage && (
          <div className="mt-6 p-4 bg-green-50 text-green-700 rounded-lg text-center animate-fade-in">
            <p className="text-sm font-medium">{successMessage}</p>
          </div>
        )}

        {errorMessage && (
          <div className="mt-6 p-4 bg-red-50 text-red-700 rounded-lg text-center animate-fade-in">
            <p className="text-sm font-medium">{errorMessage}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-800 mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 ease-in-out shadow-sm dark:bg-gray-100 dark:border-gray-600 disabled:bg-gray-200 disabled:cursor-not-allowed"
              required
              aria-describedby="email-error"
              disabled={loading}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 ease-in-out transform hover:-translate-y-1 disabled:bg-indigo-400 disabled:cursor-not-allowed"
          >
            {loading ? 'Mengirim...' : buttonText}
          </button>
        </form>
      </div>
    </main>
  );
};

// Animasi fade-in untuk pesan sukses/error
const styles = `
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  .animate-fade-in {
    animation: fadeIn 0.5s ease-in-out;
  }
`;

export default ForgotPassword;