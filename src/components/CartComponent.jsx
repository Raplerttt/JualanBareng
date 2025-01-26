import React, { useState } from 'react';
import FormPaymentComponents from './forms/FormPaymentComponents';

const CartComponent = () => {
  const [cart, setCart] = useState([
    {
      id: 1,
      name: 'Nike Air Max 2022',
      price: 150,
      quantity: 2,
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ5mVr92lbt5kgy6B8rBaBTFN9FaqCtdQtirg&s',
    },
    {
      id: 2,
      name: 'Adidas Ultra Boost',
      price: 180,
      quantity: 1,
      image: 'https://down-id.img.susercontent.com/file/6312c7533186471bb5ae6c68b1fbd1ef',
    },
  ]);

  const [showPaymentPopup, setShowPaymentPopup] = useState(false);

  const updateQuantity = (id, quantity) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const removeItem = (id) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  return (
    <div className="mx-auto py-12 px-4">
      <h2 className="text-3xl font-bold text-center mb-8">Shopping Cart</h2>
      <div className="space-y-6">
        {cart.map((product) => (
          <div key={product.id} className="flex items-center space-x-4 bg-white p-4 rounded-lg shadow-md">
            <img
              src={product.image}
              alt={product.name}
              className="w-24 h-24 object-cover rounded-md"
            />
            <div className="flex-1">
              <h3 className="text-lg font-semibold">{product.name}</h3>
              <p className="text-sm text-gray-600">Price: ${product.price}</p>
              <div className="flex items-center space-x-2 mt-2">
                <button
                  onClick={() => updateQuantity(product.id, product.quantity - 1)}
                  disabled={product.quantity <= 1}
                  className="px-2 py-1 bg-gray-200 rounded-full"
                >
                  -
                </button>
                <input
                  type="number"
                  value={product.quantity}
                  min="1"
                  className="w-12 text-center border rounded-md"
                  onChange={(e) => updateQuantity(product.id, Number(e.target.value))}
                />
                <button
                  onClick={() => updateQuantity(product.id, product.quantity + 1)}
                  className="px-2 py-1 bg-gray-200 rounded-full"
                >
                  +
                </button>
                <button
                  onClick={() => removeItem(product.id)}
                  className="ml-4 text-red-600 hover:underline"
                >
                  Remove
                </button>
              </div>
            </div>
            <div className="text-lg font-semibold">${product.price * product.quantity}</div>
          </div>
        ))}
      </div>
      <div className="flex justify-between items-center mt-6">
        <div className="text-2xl font-bold">Total: ${calculateTotal()}</div>
        <button
          onClick={() => setShowPaymentPopup(true)}
          className="py-2 px-6 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
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
