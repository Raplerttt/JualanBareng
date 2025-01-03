import React, { useState } from 'react';
import { FaWallet, FaCashRegister, FaMapMarkedAlt,FaStoreAlt } from 'react-icons/fa';

const FormPaymentComponents = ({ showPopup, closePopup, totalPrice, totalItems }) => {
  const [paymentMethod, setPaymentMethod] = useState('');
  const [deliveryOption, setDeliveryOption] = useState('');

  const handlePaymentMethodChange = (e) => {
    setPaymentMethod(e.target.value);
  };

  const handleDeliveryOptionChange = (e) => {
    setDeliveryOption(e.target.value);
  };

  const handleSubmitPayment = (e) => {
    e.preventDefault();
    alert(`Payment Method: ${paymentMethod}\nDelivery: ${deliveryOption}`);
    closePopup(); // Close the popup after submitting
  };

  if (!showPopup) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-lg w-96">
        <h2 className="text-2xl font-semibold text-center mb-4">Payment</h2>
        
        {/* Divider */}
        <div className="border-t border-gray-300 mt-2 mb-4"></div>

        {/* Payment Methods */}
        <h3 className="text-lg font-medium mb-2">Select Payment Method</h3>
        <div className="mb-6">
        <label className="block mb-4">
            <div className={`flex items-center p-4 border rounded-lg ${paymentMethod === 'Dana' ? 'border-blue-500' : 'border-gray-300'}`}>
            <FaWallet size={30} />
            <span className="ml-2 flex-1">Dana</span>
            <div className="text-xs text-gray-500">123-456-789</div>
            <input
                type="radio"
                name="paymentMethod"
                value="Dana"
                onChange={handlePaymentMethodChange}
                className="ml-4"
            />
            </div>
        </label>
        </div>

        <div className="mb-6">
        <label className="block mb-4">
            <div className={`flex items-center p-4 border rounded-lg ${paymentMethod === 'OVO' ? 'border-blue-500' : 'border-gray-300'}`}>
            <FaWallet size={30} />
            <span className="ml-2 flex-1">OVO</span>
            <div className="text-xs text-gray-500">987-654-321</div>
            <input
                type="radio"
                name="paymentMethod"
                value="OVO"
                onChange={handlePaymentMethodChange}
                className="ml-4"
            />
            </div>
        </label>
        </div>

        <div className="mb-6">
        <label className="block mb-4">
            <div className={`flex items-center p-4 border rounded-lg ${paymentMethod === 'GoPay' ? 'border-blue-500' : 'border-gray-300'}`}>
            <FaWallet size={30} />
            <span className="ml-2 flex-1">GoPay</span>
            <div className="text-xs text-gray-500">112-233-445</div>
            <input
                type="radio"
                name="paymentMethod"
                value="GoPay"
                onChange={handlePaymentMethodChange}
                className="ml-4"
            />
            </div>
        </label>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-300 mt-2 mb-4"></div>

        {/* Delivery Options */}
        <h3 className="text-lg font-medium mb-2">Select Delivery Option</h3>
        <div className="mb-6 flex justify-center gap-12">
        <label className="block mb-4">
            <div className="flex justify-between items-center">
            <div className={`p-4 border rounded-lg inline-block ${deliveryOption === 'Delivery' ? 'border-green-500' : 'border-gray-300'}`} onClick={() => setDeliveryOption('Delivery')}>
                <FaMapMarkedAlt size={30} />
                <span className="ml-2">Delivery</span>
            </div>
            </div>
        </label>
        <label className="block mb-4">
            <div className="flex justify-between items-center">
            <div className={`p-4 border rounded-lg inline-block ${deliveryOption === 'Pickup' ? 'border-green-500' : 'border-gray-300'}`} onClick={() => setDeliveryOption('Pickup')}>
                <FaStoreAlt size={30} />
                <span className="ml-2">Pickup</span>
            </div>
            </div>
        </label>
        </div>


        {/* Divider */}
        <div className="border-t border-gray-300 mt-2 mb-4"></div>

        {/* Cash Payment Option */}
        <div className="mb-6">
            <label className="flex items-center p-4 border rounded-lg">
                <FaCashRegister size={30} />
                <span className="ml-2 flex-1">Pay with Cash</span>
                <input
                type="radio"
                name="paymentMethod"
                value="Cash"
                onChange={(e) => setPaymentMethod(e.target.checked ? 'Cash' : '')}
                className="ml-4"
                />
            </label>
        </div>


        {/* Submit and Order Button */}
        <div className="flex justify-between items-center mt-6">
          <button
            type="button"
            onClick={closePopup}
            className="py-2 px-4 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={handleSubmitPayment}
            className="py-2 px-6 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Order and Delivery Now
          </button>
        </div>

        {/* Total Price and Total Items */}
        <div className="flex justify-between items-center mt-4">
          <div className="text-lg font-semibold">Total Price: ${totalPrice}</div>
          <div className="text-lg font-semibold">Total Items: {totalItems}</div>
        </div>
      </div>
    </div>
  );
};

export default FormPaymentComponents;
