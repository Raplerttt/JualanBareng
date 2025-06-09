import React, { useState, useEffect } from 'react';
import { FaHeart } from 'react-icons/fa';
import axios from '../../utils/axios';

const FavoriteComponents = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Ambil userId dan token dari localStorage
  const user = JSON.parse(localStorage.getItem('user'));
  const userId = user?.id;
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }, [token]);

  const fetchFavorites = async () => {
    try {
      if (!userId) throw new Error('User ID not found');
      const response = await axios.get(`/product/favorites/${userId}`);
      setFavorites(response.data);
    } catch (err) {
      setError('Failed to fetch favorite products');
      setFavorites([]);
    }
  };

  useEffect(() => {
    if (userId) {
      setLoading(true);
      fetchFavorites().finally(() => setLoading(false));
    } else {
      setError('User not logged in');
      setLoading(false);
    }
  }, [userId]);

  const handleFavoriteToggle = async (productId) => {
    try {
      // Cek apakah produk sudah ada di favorite berdasarkan productId
      const favoriteExists = favorites.find((fav) => fav.productId === productId);
      if (favoriteExists) {
        // Hapus favorite berdasarkan userId dan productId
        await axios.delete(`/favorites/${userId}/${productId}`);
        setFavorites((prev) => prev.filter((fav) => fav.productId !== productId));
      } else {
        // Tambah favorite
        const response = await axios.post('/favorites', { userId, productId });
        setFavorites((prev) => [...prev, response.data]);
      }
    } catch {
      setError('Failed to update favorites');
    }
  };

  if (loading) return <p className="text-center">Loading favorites...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  if (favorites.length === 0) {
    return <p className="text-center text-gray-500">No favorite products found.</p>;
  }

  return (
    <div className="mx-auto py-12 px-4">
      <h2 className="text-3xl font-bold text-center text-[#000000] mb-8">My Favorite Products</h2>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {favorites.map((favorite) => {
          const product = favorite.product;
          return (
            <div
              key={favorite.id}
              className="relative group bg-[#80CBC4] shadow-lg rounded-lg overflow-hidden"
            >
              <img
                src={product?.image || 'https://via.placeholder.com/300'}
                alt={product?.name || 'Product Image'}
                className="w-full h-48 object-cover rounded-t-lg group-hover:scale-105 transition duration-300"
              />
              <div className="absolute top-4 right-4 cursor-pointer">
                <FaHeart
                  size={24}
                  onClick={() => handleFavoriteToggle(product.id)}
                  className="text-red-500"
                />
              </div>
              <div className="p-4">
                <h3 className="text-xl font-semibold">{product?.productName || 'No Name'}</h3>
                <p className="text-sm text-gray-600">Store: {product?.seller?.storeName || '-'}</p>
                <p className="text-lg font-bold text-gray-800">{product?.price || '-'}</p>
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
