// src/hooks/usePayment.js
import { useState } from 'react';

const usePayment = () => {
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const processPayment = async (paymentData) => {
    setLoading(true);
    try {
      // Simulasikan panggilan API untuk pembayaran
      const response = await fetch('/api/payment', {
        method: 'POST',
        body: JSON.stringify(paymentData),
      });

      if (!response.ok) {
        throw new Error('Payment failed');
      }

      const data = await response.json();
      setPaymentStatus(data.status);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    paymentStatus,
    loading,
    error,
    processPayment,
  };
};

export default usePayment;
