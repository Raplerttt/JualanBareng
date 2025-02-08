import React, { useState } from 'react';
import { FaHeart } from 'react-icons/fa';

const FavoriteComponents = () => {
  const [favorites, setFavorites] = useState([1, 2]); // Assume these are favorite items
  const products = [
    {
      id: 1,
      name: 'Nike Air Max 2022',
      store: 'Nike Store',
      price: '$150',
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ5mVr92lbt5kgy6B8rBaBTFN9FaqCtdQtirg&s',
    },
    {
      id: 2,
      name: 'Adidas Ultra Boost',
      store: 'Adidas Store',
      price: '$180',
      image: 'https://down-id.img.susercontent.com/file/6312c7533186471bb5ae6c68b1fbd1ef',
    },
    {
      id: 3,
      name: 'Puma Running Shoes',
      store: 'Puma Store',
      price: '$130',
      image: 'https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_500,h_500/global/310199/01/sv01/fnd/IDN/fmt/png/FAST-R-NITRO%E2%84%A2-Elite-2-Running-Shoes-Men',
    },
    {
      id: 4,
      name: 'Asics Gel Nimbus',
      store: 'Asics Store',
      price: '$160',
      image: 'https://images.tokopedia.net/img/cache/700/VqbcmM/2022/8/12/1d2d074d-e5ed-48a2-9b88-59b91a7f94df.jpg',
    },
  ];

  const handleFavoriteToggle = (id) => {
    setFavorites((prevFavorites) =>
      prevFavorites.includes(id)
        ? prevFavorites.filter((item) => item !== id) // Remove from favorites
        : [...prevFavorites, id] // Add to favorites
    );
  };

  return (
    <div className="mx-auto py-12 px-4">
      <h2 className="text-3xl font-bold text-center text-[#DBD3D3] mb-8">My Favorite Products</h2>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {products.map((product) => {
          const isFavorite = favorites.includes(product.id);

          return (
            <div
              key={product.id}
              className="relative group bg-white shadow-lg rounded-lg overflow-hidden"
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-48 object-cover rounded-t-lg group-hover:scale-105 transition duration-300"
              />
              <div className="absolute top-4 right-4 text-red-500 cursor-pointer">
                <FaHeart
                  size={24}
                  onClick={() => handleFavoriteToggle(product.id)}
                  className={isFavorite ? 'text-red-500' : 'text-gray-400'}
                />
              </div>
              <div className="p-4">
                <h3 className="text-xl font-semibold">{product.name}</h3>
                <p className="text-sm text-gray-600">Store: {product.store}</p>
                <p className="text-lg font-bold text-gray-800">{product.price}</p>
                <button className="w-full mt-4 bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-300">
                  Buy Now
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FavoriteComponents;
