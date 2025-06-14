import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaStar, FaHeart, FaShoppingCart, FaSpinner, FaPlus, FaMinus } from 'react-icons/fa';
import axios from '../../utils/axios';
import { AuthContext } from '../auth/authContext';
import toast from 'react-hot-toast'; // Tambahkan ini

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);

  const defaultImage = 'https://via.placeholder.com/400?text=Gambar+Produk';

  // Fetch detail produk
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`/product/${id}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        setProduct(response.data.data);
        setLoading(false);
        setError(null);
      } catch (err) {
        console.error('Gagal mengambil detail produk:', err);
        setError(err.response?.data?.message || 'Gagal memuat detail produk');
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // Handler untuk mengubah jumlah produk
  const handleQuantityChange = (type) => {
    if (type === 'increment' && product?.stock && quantity < product.stock) {
      setQuantity(quantity + 1);
    } else if (type === 'decrement' && quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  // Handler untuk toggle favorit
  const handleToggleFavorite = async () => {
    if (!user) {
      navigate('/user/login');
      return;
    }
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `/favorite/${id}`,
        { isFavorite: !isFavorite },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setIsFavorite(!isFavorite);
    } catch (err) {
      console.error('Gagal mengubah status favorit:', err);
      setError(err.response?.data?.message || 'Gagal mengubah status favorit');
    }
  };

  // Handler untuk tambah ke keranjang
  const handleAddToCart = async () => {
    if (!user) {
      toast.error('Silakan login untuk menambah ke keranjang');
      navigate('/user/login');
      return;
    }
    setAddingToCart(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        '/cart',
        { productId: parseInt(id), quantity: parseInt(quantity) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAddingToCart(false);
      toast.success('Produk ditambahkan ke keranjang!');
      navigate('/cart');
    } catch (err) {
      console.error('Gagal menambah ke keranjang:', err);
      toast.error(err.response?.data?.message || 'Gagal menambah ke keranjang');
      setAddingToCart(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}>
          <FaSpinner className="text-indigo-600 text-4xl" />
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <p className="text-red-600 text-lg">{error}</p>
        <button
          className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors duration-200"
          onClick={() => navigate('/')}
        >
          Kembali ke Beranda
        </button>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <p className="text-gray-600 text-lg">Produk tidak ditemukan</p>
        <button
          className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors duration-200"
          onClick={() => navigate('/')}
        >
          Kembali ke Beranda
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-8"
      >
        {/* Gambar Produk */}
        <div className="relative">
          <img
            src={product.image ? `http://localhost:3000/${product.image}` : defaultImage}
            alt={product.name || product.productName}
            className="w-full h-[400px] object-cover rounded-xl shadow-lg"
            onError={(e) => (e.target.src = defaultImage)}
          />
          <button
            className={`absolute top-4 right-4 p-2 rounded-full ${
              isFavorite ? 'bg-red-500 text-white' : 'bg-white text-gray-600'
            } hover:bg-red-600 hover:text-white transition-colors duration-200`}
            onClick={handleToggleFavorite}
          >
            <FaHeart className="h-5 w-5" />
          </button>
        </div>

        {/* Informasi Produk */}
        <div className="flex flex-col justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {product.name || product.productName}
            </h1>
            <div className="flex items-center mb-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <FaStar
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.floor(product.rating || 0) ? 'text-yellow-400' : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="ml-2 text-sm text-gray-600">
                ({product.reviews?.length || 0} ulasan)
              </span>
            </div>
            <p className="text-2xl font-semibold text-indigo-600 mb-4">
              Rp {product.price?.toLocaleString('id-ID')}
            </p>
            <p className="text-gray-600 mb-4">{product.description || 'Deskripsi produk tidak tersedia'}</p>
            <div className="mb-4">
              <span className="text-sm font-medium text-gray-700">Kategori: </span>
              <span className="text-sm text-indigo-600">{product.category?.name || 'Tidak dikategorikan'}</span>
            </div>
            <div className="mb-4">
              <span className="text-sm font-medium text-gray-700">Stok: </span>
              <span className={`text-sm ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {product.stock > 0 ? `${product.stock} tersedia` : 'Habis'}
              </span>
            </div>
          </div>

          {/* Kontrol Jumlah dan Tombol Aksi */}
          {product.stock > 0 && (
            <div className="flex flex-col space-y-4">
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium text-gray-700">Jumlah:</span>
                <div className="flex items-center border border-gray-300 rounded-full">
                  <button
                    className="px-3 py-1 text-gray-600 hover:bg-gray-100 rounded-l-full"
                    onClick={() => handleQuantityChange('decrement')}
                    disabled={quantity === 1}
                  >
                    <FaMinus className="h-4 w-4" />
                  </button>
                  <span className="px-4 text-gray-900">{quantity}</span>
                  <button
                    className="px-3 py-1 text-gray-600 hover:bg-gray-100 rounded-r-full"
                    onClick={() => handleQuantityChange('increment')}
                    disabled={quantity >= product.stock}
                  >
                    <FaPlus className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <button
                className={`flex items-center justify-center px-6 py-3 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors duration-200 ${
                  addingToCart ? 'opacity-75 cursor-not-allowed' : ''
                }`}
                onClick={handleAddToCart}
                disabled={addingToCart}
              >
                {addingToCart ? (
                  <FaSpinner className="animate-spin h-5 w-5 mr-2" />
                ) : (
                  <FaShoppingCart className="h-5 w-5 mr-2" />
                )}
                {addingToCart ? 'Menambahkan...' : 'Tambah ke Keranjang'}
              </button>
            </div>
          )}
        </div>
      </motion.div>

      {/* Ulasan Produk */}
      {product.reviews?.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-12"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Ulasan Pelanggan</h2>
          <div className="space-y-6">
            <AnimatePresence>
              {product.reviews.map((review, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  className="border-b border-gray-200 pb-4"
                >
                  <div className="flex items-center mb-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <FaStar
                          key={i}
                          className={`h-4 w-4 ${
                            i < review.rating ? 'text-yellow-400' : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="ml-2 text-sm text-gray-600">{review.userName}</span>
                  </div>
                  <p className="text-gray-600 text-sm">{review.comment}</p>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default ProductDetail;