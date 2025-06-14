import React from 'react';
import { motion } from 'framer-motion';
import { FaCartPlus } from 'react-icons/fa';

const ProductCard = ({ product, onAddToCart, animationDelay }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: animationDelay }}
      className="bg-white shadow-lg rounded-xl overflow-hidden hover:shadow-xl transition-shadow duration-300"
    >
      <img
        src={`http://localhost:3000/${product.image}`}
        alt={product.productName}
        className="w-full h-48 object-cover"
        onError={(e) => (e.target.src = 'https://via.placeholder.com/150?text=Produk')}
      />
      <div className="p-4">
        <h3 className="text-lg font-medium text-gray-900 truncate">{product.productName}</h3>
        <p className="mt-1 text-sm text-gray-500">Rp {product.price.toLocaleString('id-ID')}</p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onAddToCart(product.id)}
          className="mt-4 w-full flex items-center justify-center px-4 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors"
        >
          <FaCartPlus className="mr-2 h-4 w-4" />
          Tambah ke Keranjang
        </motion.button>
      </div>
    </motion.div>
  );
};

export default ProductCard;