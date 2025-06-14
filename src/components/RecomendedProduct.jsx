import React, { useState, useEffect } from 'react';
import { FaStar, FaHeart, FaSpinner } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import classNames from 'classnames';
import axios from '../../utils/axios';
import toast from 'react-hot-toast';

const ProductCard = ({ product, isFavorite, onFavoriteToggle }) => {
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
            <span>Image not available</span>
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
          aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
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
            <span className="text-gray-500 mr-1">Category:</span>
            <span className="text-blue-600 font-medium">{product.category.name}</span>
          </p>
          <p className="flex items-start">
            <span className="text-gray-500 mr-1">Location:</span>
            <span className="text-gray-700">{product.seller?.address}</span>
          </p>
        </div>
        
        <div className="mt-auto flex justify-between items-center">
          <div className="flex items-center" title={`Rating: ${product.rating}`}>
            {Array.from({ length: 5 }, (_, index) => (
              <FaStar
                key={index}
                className={classNames('text-sm', {
                  'text-yellow-500': index < Math.floor(product.rating),
                  'text-gray-300': index >= Math.floor(product.rating),
                })}
              />
            ))}
            <span className="text-xs text-gray-500 ml-1">({product.rating})</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const ProductRecommendation = ({ title = 'Recommended Produk' }) => {
  const [favorites, setFavorites] = useState({});
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleFavoriteToggle = async (id, isCurrentlyFavorite) => {
    if (!Number.isInteger(id) || id <= 0) {
      toast.error('Invalid product ID');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please login to manage favorites');
        return;
      }

      const endpoint = isCurrentlyFavorite ? `/favorites/${id}` : '/favorites';
      const method = isCurrentlyFavorite ? 'delete' : 'post';
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      if (method === 'post') {
        await axios.post(endpoint, { productId: id }, config);
      } else {
        await axios.delete(endpoint, config);
      }

      setFavorites(prev => ({ ...prev, [id]: !prev[id] }));
      toast.success(isCurrentlyFavorite ? 'Removed from favorites' : 'Added to favorites');
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update favorite';
      toast.error(message);
      console.error('Favorite update failed:', error);
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem('token');
        const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
        const response = await axios.get('/product', config);
        setProducts(response.data.data);

        // Fetch initial favorite status if logged in
        if (token) {
          const favoritesResponse = await axios.get('/favorites', config);
          const favoriteIds = favoritesResponse.data.data.reduce((acc, fav) => {
            acc[fav.productId] = true;
            return acc;
          }, {});
          setFavorites(favoriteIds);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
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
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          >
            <FaSpinner className="text-blue-500 text-4xl" />
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
            <p className="text-gray-500">No products available at the moment</p>
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
                isFavorite={favorites[product.id]}
                onFavoriteToggle={handleFavoriteToggle}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
};

export default ProductRecommendation;