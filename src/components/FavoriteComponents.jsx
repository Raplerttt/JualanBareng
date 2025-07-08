import React, { useState, useEffect, useCallback, useContext } from 'react';
import { FaStar, FaHeart, FaSpinner } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import classNames from 'classnames';
import axios from '../../utils/axios';
import toast from 'react-hot-toast';
import { AuthContext } from '../auth/authContext';
import { useNavigate } from 'react-router-dom';

const FavoriteCard = ({ favorite, onFavoriteToggle }) => {
  const navigate = useNavigate();
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const product = favorite.product;

  const handleImageError = () => {
    setImageError(true);
  };

  const handleCardClick = (e) => {
    if (e.target.closest('.favorite-button')) return;
    navigate(`/product/${product.id}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="group relative flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
    >
      <div className="relative w-full h-56 overflow-hidden rounded-t-xl bg-gradient-to-br from-gray-50 to-gray-100">
        {imageError ? (
          <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
            <span className="text-sm">Gambar tidak tersedia</span>
          </div>
        ) : (
          <img
            className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110"
            src={product?.image ? `http://localhost:3000/${product.image}` : 'https://via.placeholder.com/150?text=Gambar+Produk'}
            alt={product?.productName || 'Produk'}
            onError={handleImageError}
            loading="lazy"
          />
        )}
        <motion.div
          whileTap={{ scale: 0.9 }}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onFavoriteToggle(product.id);
          }}
          className="favorite-button absolute top-3 right-3 p-2 rounded-full bg-white/80 backdrop-blur-sm cursor-pointer hover:bg-red-100 transition-colors duration-200"
          aria-label="Hapus dari favorit"
          role="button"
        >
          <FaHeart
            size={24}
            className={classNames(
              'transition-all duration-300 transform',
              {
                'text-red-500 scale-110': true, // Always favorited in this context
                'text-red-300 scale-110': isHovered,
              }
            )}
          />
        </motion.div>
      </div>
      <div className="flex-1 p-5 flex flex-col">
        <h5 className="text-lg font-semibold text-gray-900 truncate mb-1">
          {product?.productName || 'Tidak ada nama'}
        </h5>
        <div className="text-sm text-gray-600 space-y-1 mb-3">
          <p className="flex items-center">
            <span className="text-gray-500 mr-1">Toko:</span>
            <span className="text-indigo-600 font-medium">{product?.seller?.storeName || 'Tidak diketahui'}</span>
          </p>
          <p className="flex items-start">
            <span className="text-gray-500 mr-1">Lokasi:</span>
            <span className="text-gray-700 truncate">{product?.seller?.address || 'Tidak tersedia'}</span>
          </p>
        </div>
        <div className="mt-auto flex justify-between items-center">
          <div className="flex items-center" title={`Rating: ${product?.rating || 0}`}>
            {Array.from({ length: 5 }, (_, index) => (
              <FaStar
                key={index}
                className={classNames('text-sm', {
                  'text-yellow-500': index < Math.floor(product?.rating || 0),
                  'text-gray-300': index >= Math.floor(product?.rating || 0),
                })}
              />
            ))}
            <span className="text-xs text-gray-500 ml-1">({(product?.rating || 0).toFixed(1)})</span>
          </div>
          <p className="text-lg font-semibold text-indigo-600">
            {product?.price ? `Rp ${product.price.toLocaleString('id-ID')}` : 'Harga tidak tersedia'}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

const FavoriteComponents = () => {
  const { user, isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchFavorites = useCallback(async () => {
    try {
      if (!isAuthenticated || !user?.id) {
        throw new Error('Pengguna belum login');
      }
      const token = localStorage.getItem('Admintoken');
      if (!token) {
        throw new Error('Token tidak ditemukan');
      }
      const config = { headers: { Authorization: `Bearer ${token}` } };

      console.log('Mengambil daftar favorit...');
      const response = await axios.get('/favorites', config);
      console.log('Respons API favorit:', JSON.stringify(response.data, null, 2));

      const favoritesData = response.data.data || response.data || [];
      setFavorites(favoritesData);
      setError(null);
    } catch (err) {
      const message = err.response?.data?.message || 'Gagal memuat produk favorit';
      setError(message);
      toast.error(message);
      setFavorites([]);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    if (isAuthenticated && user?.id) {
      fetchFavorites();
    } else {
      setError('Silakan login untuk melihat favorit');
      setLoading(false);
      navigate('/user/login');
    }
  }, [isAuthenticated, user, fetchFavorites, navigate]);

  const handleFavoriteToggle = async (productId) => {
    try {
      if (!isAuthenticated || !user?.id) {
        toast.error('Silakan login untuk mengelola favorit');
        navigate('/user/login');
        return;
      }
      const token = localStorage.getItem('Admintoken');
      if (!token) {
        throw new Error('Token tidak ditemukan');
      }
      const config = { headers: { Authorization: `Bearer ${token}` } };

      console.log(`Mengubah status favorit untuk produk ${productId}`);

      const favoriteExists = favorites.find((fav) => fav.productId === productId);
      if (favoriteExists) {
        await axios.delete(`/favorites/${productId}`, config);
        setFavorites((prev) => prev.filter((fav) => fav.productId !== productId));
        toast.success('Dihapus dari favorit');
      } else {
        const response = await axios.post('/favorites', { productId }, config);
        setFavorites((prev) => [...prev, response.data.data || response.data]);
        toast.success('Ditambahkan ke favorit');
      }
      setError(null);
    } catch (err) {
      const message = err.response?.data?.message || 'Gagal memperbarui favorit';
      setError(message);
      toast.error(message);
      console.error('Gagal memperbarui favorit:', err.response?.data || err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <h2 className="text-4xl font-extrabold text-gray-800 mb-2 tracking-tight">
          Produk Favorit
        </h2>
      </motion.div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
          >
            <FaSpinner className="text-indigo-600 text-4xl" />
          </motion.div>
          <p className="ml-4 text-lg font-medium text-gray-700">Memuat favorit...</p>
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <div className="inline-block p-6 bg-red-50 rounded-lg shadow-md">
            <p className="text-lg font-semibold text-red-600">{error}</p>
            <button
              onClick={fetchFavorites}
              className="mt-4 bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors duration-200"
            >
              Coba Lagi
            </button>
          </div>
        </div>
      ) : favorites.length === 0 ? (
        <div className="text-center py-12">
          <div className="inline-block p-6 bg-gray-50 rounded-xl shadow-md">
            <p className="text-lg font-medium text-gray-500">Tidak ada produk favorit</p>
          </div>
        </div>
      ) : (
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-7xl mx-auto"
        >
          <AnimatePresence>
            {favorites.map((favorite, index) => (
              <motion.div
                key={favorite.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <FavoriteCard
                  favorite={favorite}
                  onFavoriteToggle={handleFavoriteToggle}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
};

export default FavoriteComponents;