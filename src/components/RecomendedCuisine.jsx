import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaStar } from 'react-icons/fa';
import axios from '../../utils/axios';
import { useNavigate } from 'react-router-dom'; // Tambahkan ini

const RecommendedCuisine = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Tambahkan ini

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  // Fungsi untuk handle klik kategori
  const handleCategoryClick = async (categoryId) => {
    try {
      setLoading(true);
      const response = await axios.get('/product', {
        params: { categoryId }
      });
      
      // Navigasi dengan path dan state
      navigate(`/category/products/${categoryId}`, { 
        state: { 
          products: response.data.data, 
          categoryId 
        } 
      });
      
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal mengambil data produk');
      toast.error('Gagal memuat produk kategori');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/categories', {
          params: { page: 1, limit: 4 },
        });
        console.log('API Response:', response.data.data);
        const mappedCategories = response.data.data.map((category) => {
          if (!category.name) {
            console.warn('Category missing name:', category);
          }
          return {
            id: category.id,
            name: category.name || 'Unnamed Category',
            category: category.name || 'Unnamed Category',
            address: category.description || 'No description available',
            image: `https://placehold.co/500x300?text=${encodeURIComponent(category.name || 'Category')}`,
            rating: category.products.length > 0 ? 4.0 + Math.random() * 0.8 : 4.0,
            featured: category.products.length > 2,
          };
        });
        setCategories(mappedCategories);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch categories');
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center">Loading...</div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center text-red-500">{error}</div>
      </section>
    );
  }

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-gray-900 mb-3">Recommended Categories</h2>
        <p className="text-lg text-gray-600">Explore our curated selection of categories</p>
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-100px' }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
      >
        {categories.map((category) => (
          <motion.div
            key={category.id}
            variants={item}
            whileHover={{ y: -5 }}
            className="group relative overflow-hidden rounded-xl shadow-lg bg-white cursor-pointer" // Tambahkan cursor-pointer
            onClick={() => handleCategoryClick(category.id)} // Tambahkan onClick handler
          >
            <div className="relative h-64 overflow-hidden">
              <img
                src={category.image}
                alt={category.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                onError={(e) => (e.target.src = 'https://placehold.co/500x300?text=Category+Image')}
              />
              {category.featured && (
                <div className="absolute top-3 left-3 bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                  Featured
                </div>
              )}
              <div className="absolute bottom-3 left-3 flex items-center bg-black bg-opacity-70 text-white px-2 py-1 rounded-full">
                <FaStar className="text-amber-400 mr-1" />
                <span className="text-sm">{category.rating.toFixed(1)}</span>
              </div>
            </div>

            <div className="p-5 text-center">
              <h3 className="text-xl font-semibold text-gray-900 mb-1">{category.name}</h3>
              <p className="text-gray-600 mb-2">{category.address}</p>
              <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                {category.category}
              </span>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <div className="text-center mt-12">
        <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-800 text-white font-medium rounded-full shadow-md hover:shadow-lg transition-all duration-300">
          View All Categories
        </button>
      </div>
    </section>
  );
};

export default RecommendedCuisine;