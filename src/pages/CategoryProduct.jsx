import React, { useState, useEffect, useContext } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from '../../utils/axios';
import { FaStar, FaArrowLeft, FaShoppingCart } from 'react-icons/fa';
import classNames from 'classnames';
import { AuthContext } from '../auth/authContext';
import { toast } from 'react-toastify';
import Navbar from '../components/layout/NavbarComponents';
import Footer from '../components/layout/FooterComponents';

const CategoryProducts = () => {
  const { categoryId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [addingToCart, setAddingToCart] = useState(false);
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);

  // Cek apakah ada data produk yang dikirim melalui state navigasi
  useEffect(() => {
    if (location.state?.products) {
      setProducts(location.state.products);
      setLoading(false);
    } else {
      fetchProducts();
    }

    fetchCategoryInfo();
  }, [categoryId, location.state]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/product', {
        params: { categoryId }
      });
      setProducts(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch products');
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategoryInfo = async () => {
    try {
      const response = await axios.get(`/categories/${categoryId}`);
      setCategory(response.data.data);
    } catch (err) {
      console.error('Failed to fetch category info:', err);
    }
  };

  const handleBackClick = () => {
    navigate(-1); // Kembali ke halaman sebelumnya
  };

  const handleAddToCart = async (productId) => {
    // Check user authentication first
    if (!user) {
      toast.error('Silakan login untuk menambah ke keranjang');
      navigate('/user/login');
      return;
    }
  
    setAddingToCart(true);
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token tidak ditemukan');
      }
  
      // Make sure productId is properly parsed
      const parsedProductId = parseInt(productId);
      if (isNaN(parsedProductId)) {
        throw new Error('ID produk tidak valid');
      }
  
      // Default quantity to 1 if not specified
      const parsedQuantity = parseInt(quantity) || 1;
  
      await axios.post(
        '/cart',
        { 
          productId: parsedProductId, 
          quantity: parsedQuantity 
        },
        { 
          headers: { 
            Authorization: `Bearer ${token}` 
          } 
        }
      );
  
      toast.success('Produk berhasil ditambahkan ke keranjang!');
      
      // Optional: navigate to cart page after adding
      // navigate('/cart');
      
    } catch (err) {
      console.error('Gagal menambah ke keranjang:', err);
      toast.error(
        err.response?.data?.message || 
        err.message || 
        'Gagal menambahkan ke keranjang'
      );
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading) {
    return (
      <>
      <Navbar />
      <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center">Loading products...</div>
      </div>
      <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
      <Navbar />
      <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center text-red-500">{error}</div>
        <button 
          onClick={handleBackClick}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center mx-auto"
        >
          <FaArrowLeft className="mr-2" /> Go Back
        </button>
      </div>
      <Footer />
      </>
    );
  }

  return (
    <>
    <Navbar />
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <button 
        onClick={handleBackClick}
        className="mb-8 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg flex items-center transition-colors"
      >
        <FaArrowLeft className="mr-2" /> Back to Categories
      </button>

      {category && (
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">{category.name}</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {category.description || 'Explore our selection of products in this category'}
          </p>
        </div>
      )}

      {products.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-xl font-medium text-gray-700">No products found in this category</h3>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
        >
          {products.map((product) => (
            <motion.div
              key={product.id}
              whileHover={{ y: -5 }}
              className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={`http://localhost:3000/${product.image}`}
                  alt={product.productName}
                  className="w-full h-full object-cover"
                  onError={(e) => (e.target.src = 'https://placehold.co/500x300?text=Product+Image')}
                />
                <div className="absolute bottom-3 left-3 flex items-center bg-black bg-opacity-70 text-white px-2 py-1 rounded-full">
                {Array.from({ length: 5 }, (_, index) => (
                <FaStar
                key={index}
                className={classNames('text-sm', {
                  'text-yellow-500': index < Math.floor(product.rating),
                  'text-gray-300': index >= Math.floor(product.rating),
                })}
                />
                ))}
                </div>
              </div>

              <div className="p-5">
                <h3 className="text-xl font-semibold text-gray-900 mb-1">{product.productName}</h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {product.description || 'No description available'}
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-blue-600">
                    Rp. {product.price?.toLocaleString('id-ID') || '0.00'}
                  </span>
                  <div className="flex items-center mb-2">
                    <button onClick={() => setQuantity(q => Math.max(1, q - 1))}>-</button>
                    <span className="mx-2">{quantity}</span>
                    <button onClick={() => setQuantity(q => q + 1)}>+</button>
                  </div>
                  <button 
                    onClick={() => handleAddToCart(product.id)}
                    disabled={addingToCart}
                    className={`p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors ${
                      addingToCart ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    {addingToCart ? 'Menambahkan...' : <FaShoppingCart />}
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
    <Footer />
    </>
  );
};

export default CategoryProducts;