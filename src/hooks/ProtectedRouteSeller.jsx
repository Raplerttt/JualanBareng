import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedSellerRoute = ({ children }) => {
  const token = localStorage.getItem('Sellertoken');
  const role = localStorage.getItem('role'); // pastikan role disimpan saat login

  if (!token || role !== 'SELLER') {
    return <Navigate to="/seller/login" replace />;
  }

  return children;
};

export default ProtectedSellerRoute;
