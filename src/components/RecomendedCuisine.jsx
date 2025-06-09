import React from 'react';
import { motion } from 'framer-motion';
import { FaStar } from 'react-icons/fa';

const RecommendedCuisine = () => {
  const products = [
    {
      id: 1,
      name: 'Italian Pasta',
      category: 'Italian',
      address: '123 Food Street',
      image: 'https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
      rating: 4.5,
      featured: true
    },
    {
      id: 2,
      name: 'Sushi Platter',
      category: 'Japanese',
      address: '456 Sushi Ave',
      image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
      rating: 4.8,
      featured: false
    },
    {
      id: 3,
      name: 'Taco Fiesta',
      category: 'Mexican',
      address: '789 Taco Lane',
      image: 'https://images.unsplash.com/photo-1513451732213-5775a1c40335?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
      rating: 4.2,
      featured: true
    },
    {
      id: 4,
      name: 'Burger Feast',
      category: 'American',
      address: '101 Burger Blvd',
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
      rating: 4.0,
      featured: false
    },
  ];

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-gray-900 mb-3">Recommended Cuisine</h2>
        <p className="text-lg text-gray-600">Discover culinary delights from around the world</p>
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
      >
        {products.map((product) => (
          <motion.div
            key={product.id}
            variants={item}
            whileHover={{ y: -5 }}
            className="group relative overflow-hidden rounded-xl shadow-lg bg-white"
          >
            <div className="relative h-64 overflow-hidden">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                onError={(e) => (e.target.src = 'https://via.placeholder.com/500x300?text=Food+Image')}
              />
              {product.featured && (
                <div className="absolute top-3 left-3 bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                  Featured
                </div>
              )}
              <div className="absolute bottom-3 left-3 flex items-center bg-black bg-opacity-70 text-white px-2 py-1 rounded-full">
                <FaStar className="text-amber-400 mr-1" />
                <span className="text-sm">{product.rating}</span>
              </div>
            </div>

            <div className="p-5 text-center">
              <h3 className="text-xl font-semibold text-gray-900 mb-1">{product.name}</h3>
              <p className="text-gray-600 mb-2">{product.address}</p>
              <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                {product.category}
              </span>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <div className="text-center mt-12">
        <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-800 text-white font-medium rounded-full shadow-md hover:shadow-lg transition-all duration-300">
          View All Cuisines
        </button>
      </div>
    </section>
  );
};

export default RecommendedCuisine;