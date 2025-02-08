import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const DetailOrderComponents = () => {
  const [quantity, setQuantity] = useState(1);
  const pricePerItem = 50000; // Ganti dengan harga makanan satuan
  const totalPrice = pricePerItem * quantity;

  const navigate = useNavigate(); // Initialize useNavigate

  const handleFinishOrder = () => {
    // Navigasi kembali ke halaman Cart setelah selesai
    navigate('/cart'); // Ganti dengan path yang sesuai untuk Cart
  };

  return (
    <div className="mx-auto py-8 px-4">
      {/* Order Details in a single white background */}
      <div className="bg-white shadow-lg rounded-lg p-6 flex flex-col md:flex-row md:items-center">
        {/* Left Side - Food Image */}
        <div className="w-full md:w-1/3 flex justify-center">
          <img
            src="/food-sample.jpg" // Ganti dengan path gambar makanan
            alt="Food"
            className="w-48 h-48 object-cover rounded-lg"
          />
        </div>

        {/* Right Side - Order Info */}
        <div className="w-full md:w-2/3 md:pl-6 flex flex-col justify-between">
          <h2 className="text-xl font-semibold text-gray-800">Nama Makanan</h2>
          <p className="text-gray-600">Harga per item: Rp{pricePerItem.toLocaleString()}</p>

          {/* Quantity Control */}
          <div className="flex items-center mt-4">
            <button
              className="px-3 py-1 bg-gray-200 text-gray-800 rounded-l-lg"
              onClick={() => setQuantity(quantity > 1 ? quantity - 1 : 1)}
            >
              -
            </button>
            <span className="px-4 py-1 bg-gray-100">{quantity}</span>
            <button
              className="px-3 py-1 bg-gray-200 text-gray-800 rounded-r-lg"
              onClick={() => setQuantity(quantity + 1)}
            >
              +
            </button>
          </div>

          {/* Total Price (Top Right) */}
          <div className="text-right text-lg font-semibold text-green-600 mt-4">
            Total: Rp{totalPrice.toLocaleString()}
          </div>

          {/* Address Section */}
          <div className="mt-4">
            <label className="block text-gray-700 font-medium">Detail Address</label>
            <input
              type="text"
              placeholder="Enter your address"
              className="w-full px-4 py-2 border rounded-lg mt-2 focus:outline-none focus:ring focus:ring-green-300"
            />
          </div>

          {/* Customize Section */}
          <div className="mt-4">
            <label className="block text-gray-700 font-medium">Customize Order</label>
            <textarea
              rows="3"
              placeholder="Add any special instructions..."
              className="w-full px-4 py-2 border rounded-lg mt-2 focus:outline-none focus:ring focus:ring-green-300"
            ></textarea>
          </div>

          {/* Long Button */}
          <div className="mt-6">
            <button
              onClick={handleFinishOrder} // Navigasi ke Cart saat selesai
              className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-300"
            >
              Selesai
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailOrderComponents;
