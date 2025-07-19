import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import CartComponent from '../components/CartComponent';
import Main from '../components/layout/Main';
import Navbar from '../components/layout/NavbarComponents';
import Footer from '../components/layout/FooterComponents';
import { AuthContext } from '../auth/authContext';

const CartPages = () => {
  const { isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/user/login'); // Sesuaikan dengan path halaman login Anda
  };

  return (
    <>
        <Navbar />
        {isAuthenticated ? (
          <CartComponent />
        ) : (
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <h2>Anda harus masuk untuk melihat halaman ini.</h2>
            <button
              onClick={handleLogin}
              style={{ padding: '10px 20px', fontSize: '16px' }}
            >
              Masuk
            </button>
          </div>
        )}
      <Footer />
    </>
  );
};

export default CartPages;