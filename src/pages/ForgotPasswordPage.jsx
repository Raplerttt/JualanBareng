import React, { useState } from 'react';
import axios from '../../utils/axios';
import ForgotPassword from '../pages/ForgotPassword'; // sesuaikan path

const ForgotPasswordPage = () => {
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleForgotPassword = async (email) => {
    try {
      setError('');
      setSuccessMessage('');

      const response = await axios.post('/auth/forgot-password', {
        email,
      });

      setSuccessMessage(response.data.message);
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('Terjadi kesalahan, coba lagi nanti.');
      }
    }
  };

  return (
    <>
      <ForgotPassword
        onSubmit={handleForgotPassword}
        errorMessage={error}
      />

      {successMessage && (
        <p className="text-center text-green-600 mt-4 font-medium">
          {successMessage}
        </p>
      )}
    </>
  );
};

export default ForgotPasswordPage;
