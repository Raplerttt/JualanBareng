import React from 'react';
import { FaList, FaStore, FaStar, FaSearch, FaTimes } from 'react-icons/fa';
import { motion } from 'framer-motion';

const Header = ({ storeName, products, orders, toggleSidebar, searchQuery, setSearchQuery, sortBy, setSortBy  }) => {
  const calculateAverageRating = (products) => {
    if (!products.length) return 0;
    const total = products.reduce((sum, p) => sum + (p.rating || 0), 0);
    return (total / products.length).toFixed(1);
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-[#80CBC4] text-black px-4 py-3 shadow-md"
    >
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
        {/* Left: Store Info & Sidebar Toggle */}
        <div className="flex items-center gap-4 flex-1 min-w-[200px]">
          <button
            onClick={toggleSidebar}
            className="md:hidden text-black hover:text-gray-700 focus:outline-none"
          >
            <FaList className="h-6 w-6" />
          </button>
          <div className="flex items-center gap-3">
            <div className="bg-white/30 p-2 rounded-lg shadow">
              <FaStore className="text-2xl" />
            </div>
            <h1 className="text-lg md:text-2xl font-bold">
              {storeName || 'My Store'}
            </h1>
          </div>
        </div>
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-6 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <label className="block text-sm font-medium text-gray-700 mb-1">Cari</label>
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                placeholder="Cari berdasarkan nama..."
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <FaTimes />
                </button>
              )}
            </div>
          </div>
          <div className="w-full md:w-48">
            <label className="block text-sm font-medium text-gray-700 mb-1">Urutkan</label>
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full appearance-none px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white pr-8 transition-all"
              >
                <option value="name">Nama (A-Z)</option>
                <option value="price">Harga (Rendah ke Tinggi)</option>
                <option value="stock">Stok (Rendah ke Tinggi)</option>
                <option value="rating">Rating (Tinggi ke Rendah)</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
          </div>
          <div className="flex space-x-6">
            <div className="text-center bg-white/10 p-3 rounded-lg min-w-[100px]">
              <p className="text-xs opacity-80">Produk</p>
              <p className="text-xl font-semibold">{products.length}</p>
            </div>
            <div className="text-center bg-white/10 p-3 rounded-lg min-w-[100px]">
              <p className="text-xs opacity-80">Total Order</p>
              <p className="text-xl font-semibold">{orders.length}</p>
            </div>
            <div className="hidden md:block text-center bg-white/10 p-3 rounded-lg min-w-[100px]">
              <p className="text-xs opacity-80">Avg. Rating</p>
              <p className="text-xl font-semibold flex items-center justify-center">
                <FaStar className="text-yellow-400 mr-1" />
                {calculateAverageRating(products)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
