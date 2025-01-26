import React from 'react';

const DetailStoreComponents = () => {
  const store = {
    name: "Awesome Store",
    address: "123 Main Street, City, Country",
    rating: 4.5,
    imageUrl: "https://brandlogos.net/wp-content/uploads/2020/11/nike-swoosh-logo-512x512.png", // Use a placeholder image URL or path
  };

  return (
    <div className="mx-auto py-8 px-4">
      <div className="flex items-start space-x-2">
        {/* Left Side: Store Photo */}
        <div className="w-1/4">
          <img
            src={store.imageUrl} // Placeholder or dummy image URL
            alt="Store"
            className="w-60 h-60 shadow-md"
          />
        </div>

        {/* Right Side: Store Name and Details */}
        <div className="w-1/3 space-y-4">
          {/* Store Name at Top Right of Image */}
          <h2 className="text-3xl font-semibold text-gray-800">{store.name}</h2>
          
          {/* Store Address */}
          <p className="text-gray-600 text-lg">{store.address}</p>
          
          {/* Store Rating */}
          <div className="flex space-x-2">
            <span className="text-yellow-500">⭐⭐⭐⭐</span> {/* Static stars for rating */}
            <span className="text-gray-600">{store.rating}/5</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailStoreComponents;
