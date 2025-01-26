import React from 'react';

const PromoCard = () => {
  const handleCopyCode = () => {
    const couponCode = "STEALDEAL20";
    navigator.clipboard.writeText(couponCode);
    alert(`Coupon code ${couponCode} copied to clipboard!`);
  };

  return (
    <div className="mx-auto">
      <div className="bg-gradient-to-br from-purple-600 to-indigo-600 text-white text-center py-5 px-6 md:px-20 rounded-lg shadow-md relative">
        <img
          src="https://i.postimg.cc/KvTqpZq9/uber.png"
          className="w-120 mx-auto mb-4 rounded-lg"
          alt="Promo Logo"
        />
        <h3 className="text-xl md:text-2xl font-semibold mb-4">
          20% flat off on all rides within the city using HDFC Credit Card
        </h3>
        <div className="flex justify-center items-center space-x-2 mb-6">
          <span
            id="cpnCode"
            className="border-dashed border border-white px-4 py-2 rounded-l text-white"
          >
            STEALDEAL20
          </span>
          <button
            id="cpnBtn"
            onClick={handleCopyCode}
            className="border border-white bg-white text-purple-600 px-4 py-2 rounded-r cursor-pointer hover:bg-purple-100 transition-colors"
          >
            Copy Code
          </button>
        </div>
        <p className="text-sm">Valid Till: 20 Dec, 2021</p>

        <div className="w-12 h-12 bg-white rounded-full absolute top-1/2 transform -translate-y-1/2 left-0 -ml-6"></div>
        <div className="w-12 h-12 bg-white rounded-full absolute top-1/2 transform -translate-y-1/2 right-0 -mr-6"></div>
      </div>
    </div>
  );
};

export default PromoCard;
