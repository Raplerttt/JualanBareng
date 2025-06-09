import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../utils/axios';
import { FiTrash2, FiChevronDown, FiChevronUp, FiCheck, FiArrowRight } from 'react-icons/fi';

const CartComponent = () => {
  const [cart, setCart] = useState([
    {
      id: 1,
      productName: 'Nike Air Max 2022',
      price: 150,
      quantity: 2,
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ5mVr92lbt5kgy6B8rBaBTFN9FaqCtdQtirg&s',
      address: '123 Street, City, Country',
      customize: 'Size: 42, Color: Red',
      selected: false,
    },
    {
      id: 2,
      productName: 'Adidas Ultra Boost',
      price: 180,
      quantity: 1,
      image: 'https://down-id.img.susercontent.com/file/6312c7533186471bb5ae6c68b1fbd1ef',
      address: '456 Avenue, Town, Country',
      customize: 'Size: 40, Color: Black',
      selected: false,
    },
  ]);

  const navigate = useNavigate();

  // Update item quantity
  const updateQuantity = (id, quantity) => {
    if (quantity <= 0) {
      setCart(prevCart => prevCart.filter(item => item.id !== id));
    } else {
      setCart(prevCart =>
        prevCart.map(item => (item.id === id ? { ...item, quantity } : item))
      );
  }
  };

  // Remove item from cart
  const removeItem = id => {
    setCart(prevCart => prevCart.filter(item => item.id !== id));
  };

  // Toggle select status for a single item
  const toggleSelectItem = id => {
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === id ? { ...item, selected: !item.selected } : item
      )
    );
  };

  // Remove selected items from cart
  const removeSelectedItems = () => {
    setCart(prevCart => prevCart.filter(item => !item.selected));
  };

  // Select or deselect all items
  const toggleSelectAll = selectAll => {
    setCart(prevCart =>
      prevCart.map(item => ({ ...item, selected: selectAll }))
    );
  };

  // Calculate the total price of the cart
  const calculateTotal = () => {
    return cart.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  // Calculate total selected items
  const calculateSelectedTotal = () => {
    return cart
      .filter(item => item.selected)
      .reduce((total, item) => total + item.price * item.quantity, 0);
  };

  // Navigate to order detail page
  const goToOrderDetail = productId => {
    navigate(`/detail-order/${productId}`);
  };

  // Handle checkout
  const handleCheckout = async () => {
    const selectedItems = cart.filter(item => item.selected);
    if (selectedItems.length === 0) {
      alert('Please select at least one item to checkout.');
      return;
    }

    const orderData = {
      id: `order-${Date.now()}`,
      productName: selectedItems.map(item => item.productName).join(', '),
      price: calculateSelectedTotal(),
      quantity: selectedItems.reduce((total, item) => total + item.quantity, 0),
      customerDetails: {
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@example.com',
        phone: '08123456789',
      },
    };

    try {
      const response = await axios.post('/payment/', orderData);
      const transactionToken = response.data.token;
      window.snap.pay(transactionToken);
    } catch (error) {
      if (error.response) {
        console.error('Checkout error:', error.response.data);
        alert(`Checkout failed: ${error.response.data.error || 'Unknown error'}`);
      } else {
        console.error('Checkout error:', error.message);
        alert('Checkout failed. Please try again.');
      }
    }
  };

  // Check if all items are selected
  const allSelected = cart.length > 0 && cart.every(item => item.selected);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Your Shopping Cart
          </h1>
          <p className="mt-3 text-xl text-gray-500">
            {cart.length} {cart.length === 1 ? 'item' : 'items'} in your cart
          </p>
        </div>

        {/* Cart Actions */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={allSelected}
              onChange={e => toggleSelectAll(e.target.checked)}
              className="h-5 w-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm font-medium text-gray-700">
              Select all ({cart.filter(item => item.selected).length}/{cart.length})
            </span>
          </div>
          {cart.some(item => item.selected) && (
            <button
              onClick={removeSelectedItems}
              className="flex items-center text-sm text-red-600 hover:text-red-800 transition-colors"
            >
              <FiTrash2 className="mr-1" />
              Remove Selected
            </button>
          )}
        </div>

        {/* Cart Items */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg divide-y divide-gray-200">
          {cart.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-500">Your cart is empty</p>
              <button
                onClick={() => navigate('/')}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            cart.map(product => (
              <div
                key={product.id}
                className={`p-6 flex items-start sm:items-center ${product.selected ? 'bg-blue-50' : ''}`}
              >
                <input
                  type="checkbox"
                  checked={product.selected}
                  onChange={() => toggleSelectItem(product.id)}
                  className="h-5 w-5 mt-1 sm:mt-0 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
                <div className="ml-4 flex-shrink-0">
                  <img
                    src={product.image}
                    alt={product.productName}
                    className="w-20 h-20 rounded-lg object-cover"
                  />
                </div>
                <div className="ml-6 flex-1 min-w-0">
                  <div className="flex justify-between">
                    <h3 className="text-lg font-medium text-gray-900 truncate">
                      {product.productName}
                    </h3>
                    <p className="ml-4 text-lg font-semibold text-gray-900">
                      ${(product.price * product.quantity).toFixed(2)}
                    </p>
                  </div>
                  <p className="mt-1 text-sm text-gray-500">
                    ${product.price.toFixed(2)} each
                  </p>

                  {/* Quantity Control */}
                  <div className="mt-4 flex items-center">
                    <div className="flex items-center border border-gray-300 rounded-md">
                      <button
                        onClick={() => updateQuantity(product.id, product.quantity - 1)}
                        disabled={product.quantity <= 1}
                        className="px-3 py-1 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                      >
                        <FiChevronDown />
                      </button>
                      <span className="px-3 py-1 text-gray-900">
                        {product.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(product.id, product.quantity + 1)}
                        className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                      >
                        <FiChevronUp />
                      </button>
                    </div>
                    <button
                      onClick={() => removeItem(product.id)}
                      className="ml-4 flex items-center text-sm text-red-600 hover:text-red-800 transition-colors"
                    >
                      <FiTrash2 className="mr-1" />
                      Remove
                    </button>
                  </div>

                  {/* Product Details */}
                  <div className="mt-4 space-y-1 text-sm text-gray-600">
                    <div className="flex items-start">
                      <span className="font-medium w-24">Address:</span>
                      <span>{product.address}</span>
                    </div>
                    <div className="flex items-start">
                      <span className="font-medium w-24">Customization:</span>
                      <span>{product.customize}</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => goToOrderDetail(product.id)}
                  className="ml-4 flex items-center text-blue-600 hover:text-blue-800 transition-colors"
                  title="View order details"
                >
                  <FiArrowRight className="text-lg" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Cart Summary */}
        {cart.length > 0 && (
          <div className="mt-8 bg-white shadow sm:rounded-lg overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Order Summary</h3>
            </div>
            <div className="px-6 py-5">
              <div className="flex justify-between text-base font-medium text-gray-900">
                <p>Subtotal</p>
                <p>${calculateTotal().toFixed(2)}</p>
              </div>
              <div className="flex justify-between mt-2 text-sm text-gray-600">
                <p>Shipping</p>
                <p>Calculated at checkout</p>
              </div>
              <div className="mt-4 border-t border-gray-200 pt-4 flex justify-between text-lg font-bold text-gray-900">
                <p>Total</p>
                <p>${calculateTotal().toFixed(2)}</p>
              </div>
              <div className="mt-6">
                <button
                  onClick={handleCheckout}
                  className="w-full flex justify-center items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartComponent