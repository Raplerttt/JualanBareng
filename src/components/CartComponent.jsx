import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import FormPaymentComponents from './forms/FormPaymentComponents';

const CartComponent = () => {
  const [cart, setCart] = useState([
    {
      id: 1,
      name: 'Nike Air Max 2022',
      price: 150,
      quantity: 2,
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ5mVr92lbt5kgy6B8rBaBTFN9FaqCtdQtirg&s',
      address: '123 Street, City, Country',
      customize: 'Size: 42, Color: Red',
      selected: false, // Track if item is selected
    },
    {
      id: 2,
      name: 'Adidas Ultra Boost',
      price: 180,
      quantity: 1,
      image: 'https://down-id.img.susercontent.com/file/6312c7533186471bb5ae6c68b1fbd1ef',
      address: '456 Avenue, Town, Country',
      customize: 'Size: 40, Color: Black',
      selected: false, // Track if item is selected
    },
  ]);

  const [showPaymentPopup, setShowPaymentPopup] = useState(false);
  const navigate = useNavigate(); // Initialize useNavigate

  // Update item quantity, remove item if quantity is 0
  const updateQuantity = (id, quantity) => {
    if (quantity <= 0) {
      setCart((prevCart) => prevCart.filter((item) => item.id !== id));
    } else {
      setCart((prevCart) =>
        prevCart.map((item) =>
          item.id === id ? { ...item, quantity } : item
        )
      );
    }
  };

  // Remove item from cart
  const removeItem = (id) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  // Toggle select status for a single item
  const toggleSelectItem = (id) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === id ? { ...item, selected: !item.selected } : item
      )
    );
  };

  // Remove selected items from cart
  const removeSelectedItems = () => {
    setCart((prevCart) => prevCart.filter((item) => !item.selected));
  };

  // Select or deselect all items
  const toggleSelectAll = (selectAll) => {
    setCart((prevCart) =>
      prevCart.map((item) => ({ ...item, selected: selectAll }))
    );
  };

  // Calculate the total price of the cart
  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  // Navigate to order detail page
  const goToOrderDetail = (productId) => {
    navigate(`/detail-order/${productId}`);
  };

  // Check if all items are selected
  const allSelected = cart.every((item) => item.selected);

  return (
    <div className="mx-auto py-12 px-4 max-w-7xl">
      <h2 className="text-3xl font-semibold text-center text-[#DBD3D3] mb-8">Shopping Cart</h2>

      {/* Select All checkbox */}
      <div className="flex justify-end space-x-3 mb-4">
        <input
          type="checkbox"
          checked={allSelected}
          onChange={(e) => toggleSelectAll(e.target.checked)}
          className="h-5 w-5 rounded border-gray-300 focus:ring-2 focus:ring-blue-500"
        />
        <span className="text-lg font-medium text-gray-700">Select All</span>
      </div>

      <div className="space-y-6">
        {cart.map((product) => (
          <div
            key={product.id}
            className="flex items-center space-x-6 bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
          >
            <input
              type="checkbox"
              checked={product.selected}
              onChange={() => toggleSelectItem(product.id)}
              className="h-5 w-5 rounded border-gray-300 focus:ring-2 focus:ring-blue-500"
            />
            <img
              src={product.image}
              alt={product.name}
              className="w-24 h-24 object-cover rounded-md"
            />
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-gray-800">{product.name}</h3>
              <p className="text-sm text-gray-600">Price: ${product.price}</p>

              {/* Quantity Control */}
              <div className="flex items-center space-x-2 mt-3">
                <button
                  onClick={() => updateQuantity(product.id, product.quantity - 1)} // Update quantity down
                  disabled={product.quantity <= 1}
                  className="px-3 py-2 bg-gray-200 rounded-full hover:bg-gray-300 transition"
                >
                  -
                </button>
                <input
                  type="number"
                  value={product.quantity}
                  min="1"
                  className="w-14 text-center border rounded-md border-gray-300"
                  onChange={(e) => updateQuantity(product.id, Number(e.target.value))}
                />
                <button
                  onClick={() => updateQuantity(product.id, product.quantity + 1)} // Update quantity up
                  className="px-3 py-2 bg-gray-200 rounded-full hover:bg-gray-300 transition"
                >
                  +
                </button>
                <button
                  onClick={() => removeItem(product.id)} // Remove item from cart
                  className="ml-6 text-red-600 hover:text-red-700"
                >
                  Remove
                </button>
              </div>

              {/* Dummy Address and Customize Order */}
              <div className="mt-4 space-y-2">
                <p className="text-gray-700 font-medium">Address: <span className="font-light">{product.address}</span></p>
                <p className="text-gray-700 font-medium">Customize Order: <span className="font-light">{product.customize}</span></p>
              </div>
            </div>
            <div className="text-lg font-semibold text-gray-900">${product.price * product.quantity}</div>
            {/* Go to Order Details Button */}
            <button
              onClick={() => goToOrderDetail(product.id)}
              className="ml-6 py-2 px-6 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
            >
              Go to Order Details
            </button>
          </div>
        ))}
      </div>

      {/* Remove Selected Items Button */}
      {cart.some((product) => product.selected) && (
        <div className="mt-6 text-center">
          <button
            onClick={removeSelectedItems}
            className="py-2 px-6 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
          >
            Remove Selected Items
          </button>
        </div>
      )}

      {/* Total Section */}
      <div className="flex justify-between items-center mt-8">
        <div className="text-2xl font-bold text-[#DBD3D3]">Total: ${calculateTotal()}</div>
        <button
          onClick={() => setShowPaymentPopup(true)}
          className="py-3 px-8 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
        >
          Checkout
        </button>
      </div>

      <FormPaymentComponents
        showPopup={showPaymentPopup}
        closePopup={() => setShowPaymentPopup(false)}
      />
    </div>
  );
};

export default CartComponent;
