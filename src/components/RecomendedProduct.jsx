import React, { useState, useEffect } from 'react';
import { FaStar, FaHeart, FaSpinner } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import classNames from 'classnames';
import axios from '../../utils/axios';
import toast from 'react-hot-toast';

const ProductCard = ({ product, isFavorite, onFavoriteToggle, averageRating }) => {
  const navigate = useNavigate();
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

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
            <span>Gambar tidak tersedia</span>
          </div>
        ) : (
          <img
            className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110"
            src={`http://localhost:3000/${product.image}`}
            alt={product.productName}
            onError={handleImageError}
            loading="lazy"
          />
        )}
        
        <motion.div
          whileTap={{ scale: 0.9 }}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onFavoriteToggle(product.id, isFavorite);
          }}
          className="favorite-button absolute top-3 right-3 cursor-pointer"
          aria-label={isFavorite ? 'Hapus dari favorit' : 'Tambah ke favorit'}
          role="button"
        >
          <FaHeart 
            size={24} 
            className={classNames(
              'transition-all duration-300 transform',
              {
                'text-red-500 scale-110': isFavorite,
                'text-white drop-shadow-md': !isFavorite && !isHovered,
                'text-red-300 scale-110': !isFavorite && isHovered,
              }
            )} 
          />
        </motion.div>
      </div>
      
      <div className="flex-1 p-5 flex flex-col">
        <h5 className="text-lg font-semibold text-gray-900 truncate mb-1">{product.productName}</h5>
        <div className="text-sm text-gray-600 space-y-1 mb-3">
          <p className="flex items-center">
            <span className="text-gray-500 mr-1">Kategori:</span>
            <span className="text-indigo-600 font-medium">{product.category?.name || 'Tidak diketahui'}</span>
          </p>
          <p className="flex items-start">
            <span className="text-gray-500 mr-1">Lokasi:</span>
            <span className="text-gray-700">{product.seller?.address || 'Tidak tersedia'}</span>
          </p>
        </div>
        
        <div className="mt-auto flex justify-between items-center">
          <div className="flex items-center" title={`Rating: ${averageRating.toFixed(1)}`}>
            {Array.from({ length: 5 }, (_, index) => (
              <FaStar
                key={index}
                className={classNames('text-sm', {
                  'text-yellow-500': index < Math.floor(averageRating),
                  'text-gray-300': index >= Math.floor(averageRating),
                })}
              />
            ))}
            <span className="text-xs text-gray-500 ml-1">({averageRating.toFixed(1)})</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const ProductRecommendation = ({ title = 'Produk Rekomendasi' }) => {
  const [favorites, setFavorites] = useState({});
  const [products, setProducts] = useState([]);
  const [averageRatings, setAverageRatings] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAverageRating = async (productId) => {
    try {
      const token = localStorage.getItem('Admintoken');
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};

      console.log(`Mengambil rating untuk produk ${productId}`);

      const response = await axios.get('/feedbacks', {
        params: { productId },
        ...config,
      });

      console.log(`Respons API feedbacks untuk produk ${productId}:`, JSON.stringify(response.data, null, 2));

      const feedbacks = response.data.data || response.data || [];

      if (feedbacks.length === 0) return 0;

      const totalRating = feedbacks.reduce((sum, feedback) => sum + (feedback.rating || 0), 0);
      return totalRating / feedbacks.length;
    } catch (err) {
      console.error(`Gagal mengambil feedback untuk produk ${productId}:`, err.response?.data || err.message);
      return 0;
    }
  };

  const handleFavoriteToggle = async (id, isCurrentlyFavorite) => {
    if (!Number.isInteger(id) || id <= 0) {
      toast.error('ID produk tidak valid');
      return;
    }

    try {
      const token = localStorage.getItem('Admintoken');
      if (!token) {
        toast.error('Silakan login untuk mengelola favorit');
        navigate('/user/login');
        return;
      }

      const endpoint = isCurrentlyFavorite ? `/favorites/${id}` : '/favorites';
      const method = isCurrentlyFavorite ? 'delete' : 'post';
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      console.log(`Mengubah status favorit untuk produk ${id}:`, { method, endpoint });

      if (method === 'post') {
        await axios.post(endpoint, { productId: id }, config);
      } else {
        await axios.delete(endpoint, config);
      }

      setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
      toast.success(isCurrentlyFavorite ? 'Dihapus dari favorit' : 'Ditambahkan ke favorit');
    } catch (error) {
      const message = error.response?.data?.message || 'Gagal memperbarui favorit';
      toast.error(message);
      console.error('Gagal memperbarui favorit:', error.response?.data || error.message);
    }
  };

  useEffect(() => {
    const fetchProductsAndRatings = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('Admintoken');
        const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};

        console.log('Mengambil daftar produk...');
        const response = await axios.get('/product', config);
        console.log('Respons API produk:', JSON.stringify(response.data, null, 2));

        const productsData = response.data.data || response.data || [];

        // Fetch average ratings for each product
        const ratings = {};
        for (const product of productsData) {
          const avgRating = await fetchAverageRating(product.id);
          ratings[product.id] = avgRating;
        }
        setAverageRatings(ratings);
        setProducts(productsData);

        // Fetch initial favorite status if logged in
        if (token) {
          console.log('Mengambil daftar favorit...');
          const favoritesResponse = await axios.get('/favorites', config);
          console.log('Respons API favorit:', JSON.stringify(favoritesResponse.data, null, 2));

          const favoriteIds = (favoritesResponse.data.data || favoritesResponse.data || []).reduce(
            (acc, fav) => {
              acc[fav.productId] = true;
              return acc;
            },
            {}
          );
          setFavorites(favoriteIds);
        }
      } catch (err) {
        const message = err.response?.data?.message || 'Gagal memuat produk';
        setError(message);
        toast.error(message);
        console.error('Gagal memuat produk:', err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProductsAndRatings();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h2 className="text-4xl font-bold text-gray-900 mb-2">{title}</h2>
      </motion.div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
          >
            <FaSpinner className="text-indigo-600 text-4xl" />
          </motion.div>
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <div className="inline-block p-4 bg-red-50 rounded-lg">
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-12">
          <div className="inline-block p-6 bg-gray-50 rounded-xl">
            <p className="text-gray-500">Tidak ada produk yang tersedia saat ini</p>
          </div>
        </div>
      ) : (
        <motion.div 
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
        >
          <AnimatePresence>
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                isFavorite={favorites[product.id] || false}
                onFavoriteToggle={handleFavoriteToggle}
                averageRating={averageRatings[product.id] || 0}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
};

export default ProductRecommendation;