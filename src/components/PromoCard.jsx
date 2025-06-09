import React, { useState } from 'react';

const PromoCard = () => {
  const [isCopied, setIsCopied] = useState(false);
  const couponCode = "STEALDEAL20";
  const validUntil = "December 20, 2021";

  const handleCopyCode = () => {
    navigator.clipboard.writeText(couponCode);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="flex justify-center items-center min-h-[50vh] px-4">
      <div className="bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden w-full max-w-md transition-all hover:shadow-xl">
        {/* Header with gradient */}
        <div className="bg-gradient-to-r from-teal-400 to-teal-200 py-6 px-6 text-center">
          <h3 className="text-2xl font-bold text-gray-800">Exclusive Ride Discount</h3>
          <p className="text-sm mt-2 text-gray-700">
            20% off on all city rides using HDFC Credit Card
          </p>
        </div>
        
        {/* Content */}
        <div className="p-6 flex flex-col items-center">
          <img
            src="https://i.postimg.cc/KvTqpZq9/uber.png"
            className="w-32 mb-6"
            alt="Uber logo"
            loading="lazy"
          />
          
          {/* Coupon code box */}
          <div className="w-full max-w-xs bg-gray-100 border border-gray-200 rounded-lg p-3 flex items-center justify-between mb-4">
            <span className="font-mono text-lg text-indigo-800 font-medium">
              {couponCode}
            </span>
            <button
              onClick={handleCopyCode}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                isCopied 
                  ? 'bg-green-500 text-white' 
                  : 'bg-amber-500 hover:bg-amber-600 text-white'
              }`}
              aria-label="Copy coupon code"
            >
              {isCopied ? 'Copied!' : 'Copy'}
            </button>
          </div>
          
          <p className="text-sm text-blue-600 mt-2">
            Valid until: <time dateTime="2021-12-20">{validUntil}</time>
          </p>
          
          <div className="mt-6 w-full border-t border-gray-100 pt-4">
            <p className="text-xs text-gray-500">
              * Terms and conditions apply. Valid only on rides within city limits.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromoCard;