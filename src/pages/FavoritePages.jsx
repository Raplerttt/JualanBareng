import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom'; // Untuk navigasi
import FavoriteComponents from '../components/FavoriteComponents';
import Navbar from '../components/layout/NavbarComponents';
import Footer from '../components/layout/FooterComponents';
import { AuthContext } from '../auth/authContext'; // Pastikan path ini sesuai

const FavoritePages = () => {
    const { isAuthenticated } = useContext(AuthContext); // Ambil status autentikasi dari context
    const navigate = useNavigate(); // Hook untuk navigasi

    const handleLogin = () => {
        navigate('/user/login'); // Ganti dengan path halaman login Anda
    };

    return (
        <>
            <Navbar />
                {isAuthenticated ? (
                    <FavoriteComponents />
                ) : (
                    <div style={{ textAlign: 'center', marginTop: '20px' }}>
                        <h2>Anda harus masuk untuk melihat halaman ini.</h2>
                        <button onClick={handleLogin} style={{ padding: '10px 20px', fontSize: '16px' }}>
                            Masuk
                        </button>
                    </div>
                )}
            <Footer />
        </>
    );
}

export default FavoritePages;