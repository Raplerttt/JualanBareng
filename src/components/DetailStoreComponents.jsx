import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaStar, FaMapMarkerAlt, FaCommentDots } from 'react-icons/fa';
import axios from '../../utils/axios';
import toast from 'react-hot-toast';

const DetailStoreComponents = () => {
  const [store, setStore] = useState(null);
  const [products, setProducts] = useState([]); // Placeholder for products
  const [loading, setLoading] = useState(true);
  const { sellerId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStore = async () => {
      if (!sellerId || isNaN(Number(sellerId))) {
        toast.error('ID toko tidak valid');
        return navigate('/');
      }
    
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          toast.error('Silakan login untuk melihat detail toko');
          return navigate('/user/login');
        }
    
        const storeResponse = await axios.get(`/seller/${sellerId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
    
        const sellerData = storeResponse.data.data;
    
        setStore({
          storeName: sellerData.storeName ?? 'Toko Tidak Diketahui',
          address: [sellerData.address, sellerData.city].filter(Boolean).join(', '),
          photo:
            sellerData.photo ||
            'https://dummyimage.com/400x400/cccccc/000000.png&text=No+Image',
          rating: sellerData.rating ?? 4.5,
        });
    
        setProducts(
          sellerData.products?.map((product) => ({
            id: product.id,
            name: product.productName,
            image: product.image,
            price: product.price,
          })) || []
        );
      } catch (err) {
        console.error('Gagal memuat detail toko:', err);
        toast.error(err.response?.data?.message || 'Gagal memuat detail toko');
      } finally {
        setLoading(false);
      }
    };
    

    fetchStore();
  }, [sellerId, navigate]);

  const handleChatClick = () => {
    navigate(`/chat/${sellerId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
          className="text-green-600 text-4xl"
        >
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 3v1m0 16v1m8.66-8.66h-1m-16 0h-1m15.364-5.364l-.707.707M6.343 17.657l-.707.707m11.314 0l-.707-.707M6.343 6.343l-.707-.707"
            />
          </svg>
        </motion.div>
      </div>
    );
  }

  if (!store) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center text-red-600 bg-red-50 p-6 rounded-lg shadow-md">
          Toko tidak ditemukan
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative bg-gradient-to-r from-green-600 to-teal-600 text-white py-16 px-4"
      >
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{store.storeName}</h1>
            <div className="flex items-center justify-center md:justify-start mb-4">
              <FaMapMarkerAlt className="mr-2" />
              <p className="text-lg">{store.address}</p>
            </div>
            <div className="flex items-center justify-center md:justify-start mb-4">
              {Array.from({ length: 5 }, (_, i) => (
                <FaStar
                  key={i}
                  className={`text-xl ${i < Math.floor(store.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                />
              ))}
              <span className="ml-2 text-lg">{store.rating.toFixed(1)} / 5</span>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleChatClick}
              className="inline-flex items-center bg-white text-green-600 font-semibold py-3 px-6 rounded-full shadow-lg hover:bg-gray-100 transition-colors"
            >
              <FaCommentDots className="mr-2" />
              Chat dengan Penjual
            </motion.button>
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex-1 flex justify-center"
          >
            <img
              src={store.photo}
              alt={store.storeName}
              className="w-80 h-80 object-cover rounded-2xl shadow-xl"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://dummyimage.com/400x400/cccccc/000000.png&text=No+Image';
              }}
            />
          </motion.div>
        </div>
      </motion.div>

      {/* Products Section */}
      <div className="max-w-6xl mx-auto py-12 px-4">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-bold text-gray-800 mb-8 text-center"
        >
          Produk dari {store.storeName}
        </motion.h2>
        {products.length === 0 ? (
          <div className="text-center text-gray-500 py-10">
            Belum ada produk yang tersedia
          </div>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
          >
            {products.map((product) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-xl shadow-md overflow-hidden cursor-pointer"
                onClick={() => navigate(`/product/${product.id}`)}
              >
                <img
                  src={`http://localhost:3000/${product.image}`}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://dummyimage.com/200x200/cccccc/000000.png&text=No+Image';
                  }}
                />
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-800 truncate">{product.name}</h3>
                  <p className="text-green-600 font-medium mt-1">
                    Rp {product.price.toLocaleString('id-ID')}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default DetailStoreComponents;