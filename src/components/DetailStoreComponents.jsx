import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaStar, FaMapMarkerAlt, FaCommentDots } from 'react-icons/fa';
import axios from '../../utils/axios';
import toast from 'react-hot-toast';

const DetailStoreComponents = () => {
  const [store, setStore] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const { sellerId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStore = async () => {
      if (!sellerId || typeof sellerId !== 'string') {
        toast.error('ID toko tidak valid');
        return navigate('/');
      }      
      try {
        const token = localStorage.getItem('Admintoken');
        if (!token) {
          toast.error('Silakan login untuk melihat detail toko');
          return navigate('/user/login');
        }

        const res = await axios.get(`/seller/${sellerId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = res.data.data;

        setStore({
          storeName: data.storeName || 'Toko Tidak Diketahui',
          address: [data.address, data.city].filter(Boolean).join(', '),
          photo: data.photo || 'https://dummyimage.com/400x400/cccccc/000000.png&text=No+Image',
          rating: data.rating ?? 4.5,
        });

        setProducts(
          data.products?.map((product) => ({
            id: product.id,
            name: product.productName,
            image: product.image,
            price: product.price,
          })) || []
        );
      } catch (err) {
        toast.error(err.response?.data?.message || 'Gagal memuat detail toko');
      } finally {
        setLoading(false);
      }
    };

    fetchStore();
  }, [sellerId, navigate]);

  const handleChatClick = () => navigate(`/chat/${sellerId}`);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="w-full max-w-6xl space-y-6">
          {/* Skeleton Hero */}
          <div className="bg-white rounded-2xl shadow-lg p-8 animate-pulse">
            <div className="flex flex-col md:flex-row gap-8">
              <div className="flex-1 space-y-4">
                <div className="h-8 bg-gray-200 rounded w-3/4 mx-auto md:mx-0"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto md:mx-0"></div>
                <div className="h-4 bg-gray-200 rounded w-1/3 mx-auto md:mx-0"></div>
                <div className="h-10 bg-gray-200 rounded w-40 mx-auto md:mx-0"></div>
              </div>
              <div className="flex-1 flex justify-center">
                <div className="w-80 h-80 bg-gray-200 rounded-2xl"></div>
              </div>
            </div>
          </div>

          {/* Skeleton Products */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-md p-4 animate-pulse">
                <div className="w-full h-48 bg-gray-200 rounded-lg"></div>
                <div className="mt-4 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!store) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-red-50 text-red-600 p-6 rounded-xl shadow-md text-center max-w-md"
        >
          <h2 className="text-xl font-semibold mb-2">Toko Tidak Ditemukan</h2>
          <p className="text-sm">Maaf, toko yang Anda cari tidak tersedia.</p>
          <button
            onClick={() => navigate('/')}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          >
            Kembali ke Beranda
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 mt-12">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="inset-0 bg-gradient-to-br from-teal-400 to-cyan-500 opacity-95 text-white py-12 md:py-16 px-4"
      >
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1 text-center md:text-left space-y-4">
            <h1 className="text-3xl md:text-4xl font-bold">{store.storeName}</h1>
            <div className="flex items-center justify-center md:justify-start gap-2">
              <FaMapMarkerAlt className="text-lg" />
              <p>{store.address || 'Alamat tidak tersedia'}</p>
            </div>
            <div className="flex items-center justify-center md:justify-start gap-2">
              {Array.from({ length: 5 }, (_, i) => (
                <FaStar
                  key={i}
                  className={`text-lg ${i < Math.floor(store.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                />
              ))}
              <span className="text-base font-medium">{store.rating.toFixed(1)} / 5</span>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleChatClick}
              className="inline-flex items-center bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold py-2 px-6 rounded-full shadow-lg hover:from-indigo-700 hover:to-purple-700"
            >
              <FaCommentDots className="mr-2" />
              Chat dengan Penjual
            </motion.button>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex-1 flex justify-center"
          >
            <img
              src={`http://localhost:3000/${store.photo}`}
              alt={store.storeName}
              className="w-64 h-64 md:w-80 md:h-80 object-cover rounded-2xl shadow-xl border-2 border-white/20"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://dummyimage.com/400x400/cccccc/000000.png&text=No+Image';
              }}
            />
          </motion.div>
        </div>
      </motion.section>

      {/* Products Section */}
      <section className="max-w-6xl mx-auto py-12 px-4">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-2xl md:text-3xl font-bold text-gray-800 mb-8 text-center"
        >
          Produk dari {store.storeName}
        </motion.h2>

        {products.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-xl shadow-md p-6 text-center text-gray-500"
          >
            <p>Belum ada produk yang tersedia</p>
            <button
              onClick={() => navigate('/')}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Jelajahi Toko Lain
            </button>
          </motion.div>
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
                  className="w-full h-48 object-cover rounded-t-xl"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://dummyimage.com/400x400/cccccc/000000.png&text=No+Image';
                  }}
                />
                <div className="p-4">
                  <h3 className="text-base font-semibold text-gray-800 truncate">{product.name}</h3>
                  <p className="text-green-600 font-medium mt-1 text-sm">
                    Rp {product.price.toLocaleString('id-ID')}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </section>
    </div>
  );
};

export default DetailStoreComponents;
