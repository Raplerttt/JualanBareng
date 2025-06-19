import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../auth/authContext';

const Login = () => {
const [formData, setFormData] = useState({ email: '', password: '' });
const [error, setError] = useState({});
const [loading, setLoading] = useState(false);
const navigate = useNavigate();
const { login } = useContext(AuthContext);

const API_URL = 'http://localhost:3000/api';

const validate = () => {
    const errors = {};
    if (!formData.email) errors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = 'Invalid email format';
    if (!formData.password) errors.password = 'Password is required';
    else if (formData.password.length < 6) errors.password = 'Password must be at least 6 characters';
    return errors;
  };

const handleChange = (e) => {
  const { name, value } = e.target;
  setFormData((prev) => ({ ...prev, [name]: value }));
  setError((prev) => ({ ...prev, [name]: '' }));
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
      `${API_URL}/auth/login`,
      formData,
      { headers: { 'Content-Type': 'application/json' } }
    );

    const token = response.data.token;

    if (token) {
      // Decode JWT to get user data and role
      const tokenPayload = JSON.parse(atob(token.split('.')[1]));
      const userData = {
        userId: tokenPayload.id,
        role: tokenPayload.role,
        email: tokenPayload.email,
      };

      if (tokenPayload.role !== 'ADMIN') {
        setError({ general: 'This account is not an admin account.' });
        setLoading(false);
        return;
      }

      // Store in localStorage
      localStorage.setItem('Admintoken', token);
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('role', tokenPayload.role);

      // Update context state
      login(userData);

      navigate('/admin/dashboard');
    } else {
      setError({ general: 'Login failed: Invalid response from server.' });
    }
  } catch (error) {
    const errorMessage =
      error.response?.data?.message ||
      'An error occurred during login. Please try again.';
    setError({ general: errorMessage });
  } finally {
    setLoading(false);
  }
};


return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Admin Login</h2>

        {error.general && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            {error.general}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`mt-1 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                error.email ? 'border-red-500' : ''
              }`}
              placeholder="Enter your email"
              disabled={loading}
            />
            {error.email && (
              <p className="mt-1 text-sm text-red-500">{error.email}</p>
            )}
          </div>

          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`mt-1 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                error.password ? 'border-red-500' : ''
              }`}
              placeholder="Enter your password"
              disabled={loading}
            />
            {error.password && (
              <p className="mt-1 text-sm text-red-500">{error.password}</p>
            )}
          </div>

          <button
            type="submit"
            className={`w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Log In'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;