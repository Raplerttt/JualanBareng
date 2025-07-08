import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedSellerRoute = ({ children }) => {
  const token = localStorage.getItem('Admintoken');


  if (!token) {
    return <Navigate to="/seller/login" replace />;
  }

  return children;
};

export default ProtectedSellerRoute;
