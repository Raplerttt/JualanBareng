import React, { useState } from 'react';
import { FaStar, FaHeart } from 'react-icons/fa';
import { motion } from 'framer-motion';
import classNames from 'classnames';

const ProductCard = ({ product, isFavorite, onFavoriteToggle }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, ease: 'easeOut' }}
      className="group relative flex flex-col overflow-hidden rounded-lg border bg-white shadow-md hover:shadow-xl transition-shadow duration-300"
    >
      {/* Product Image */}
      <a href="#" className="relative w-full h-48 overflow-hidden rounded-xl">
        <img
          className="absolute top-0 right-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          src={product.image}
          alt={product.name}
          loading="lazy"
        />
        {/* Heart Icon (Favorite) */}
        <motion.div
          whileTap={{ scale: 0.8 }}
          onClick={() => onFavoriteToggle(product.id)}
          className="absolute top-2 right-2 text-gray-400 cursor-pointer group-hover:text-red-500 transition-all duration-300"
          aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          role="button"
        >
          <FaHeart size={24} className={classNames({ 'text-red-500': isFavorite, 'text-gray-400': !isFavorite })} />
        </motion.div>
      </a>

      {/* Product Info */}
      <div className="mt-4 px-4 pb-4">
        <a href="#">
          <h5 className="text-xl font-semibold text-black truncate">{product.name}</h5>
        </a>
        <div className="mt-2 text-sm text-gray-600">
          <p>Category: {product.category}</p>
          <p>Address: {product.address}</p>
        </div>

        {/* Rating */}
        <div className="flex mt-2" title={`Rating: ${product.rating}`}>
          {Array.from({ length: 5 }, (_, index) => (
            <FaStar
              key={index}
              className={classNames('text-lg', {
                'text-yellow-400': index < Math.floor(product.rating),
                'text-gray-400': index >= Math.floor(product.rating),
              })}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
};

const ProductRecommendation = () => {
  const [favorites, setFavorites] = useState({});

  const products = [
    {
      id: 1,
      name: 'Nike Air MX Super 2500 - Red',
      category: 'Sneakers',
      address: 'New York, USA',
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ5mVr92lbt5kgy6B8rBaBTFN9FaqCtdQtirg&s',
      rating: 4.5,
    },
    {
      id: 2,
      name: 'Adidas Ultra Boost 2022',
      category: 'Running Shoes',
      address: 'Los Angeles, USA',
      image: 'https://down-id.img.susercontent.com/file/6312c7533186471bb5ae6c68b1fbd1ef',
      rating: 4.0,
    },
    {
      id: 3,
      name: 'Puma Running Shoes',
      category: 'Sportswear',
      address: 'Miami, USA',
      image: 'https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_500,h_500/global/310199/01/sv01/fnd/IDN/fmt/png/FAST-R-NITRO%E2%84%A2-Elite-2-Running-Shoes-Men',
      rating: 4.2,
    },
    {
      id: 4,
      name: 'Asics Gel Nimbus 23',
      category: 'Running Shoes',
      address: 'San Francisco, USA',
      image: 'https://images.tokopedia.net/img/cache/700/VqbcmM/2022/8/12/1d2d074d-e5ed-48a2-9b88-59b91a7f94df.jpg',
      rating: 4.8,
    },
  ];

  const handleFavoriteToggle = (id) => {
    setFavorites((prevFavorites) => ({
      ...prevFavorites,
      [id]: !prevFavorites[id],
    }));
  };

  return (
    <div className="mx-auto py-12">
      <h2 className="text-2xl font-semibold text-center mb-8">Recommended Products</h2>
      {products.length === 0 ? (
        <p className="text-center text-gray-500">No products to display.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              isFavorite={favorites[product.id]}
              onFavoriteToggle={handleFavoriteToggle}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductRecommendation;
