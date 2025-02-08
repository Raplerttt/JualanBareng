import React from 'react';

const PromoCard = () => {
  const handleCopyCode = () => {
    const couponCode = "STEALDEAL20";
    navigator.clipboard.writeText(couponCode);
    alert(`Coupon code ${couponCode} copied to clipboard!`);
  };

  return (
    <div className="flex justify-center items-center py-10">
      <div className="bg-white border border-[#DBD3D3] rounded-xl shadow-lg overflow-hidden max-w-lg w-full text-center">
        <div className="bg-gradient-to-r from-[#091057] to-[#024CAA] py-6 px-8 text-white">
          <h3 className="text-2xl font-bold">Exclusive Ride Discount!</h3>
          <p className="text-sm mt-2">20% off on all city rides using HDFC Credit Card</p>
        </div>
        <div className="p-6 flex flex-col items-center">
          <img
            src="https://i.postimg.cc/KvTqpZq9/uber.png"
            className="w-40 mb-4 rounded-lg"
            alt="Promo Logo"
          />
          <div className="flex items-center justify-center bg-[#DBD3D3] border border-gray-300 rounded-lg px-4 py-2 text-lg font-semibold">
            <span className="mr-2 text-[#091057]">STEALDEAL20</span>
            <button
              onClick={handleCopyCode}
              className="bg-[#EC8305] text-white px-3 py-1 rounded-md hover:bg-[#DBD3D3] transition-all"
            >
              Copy
            </button>
          </div>
          <p className="text-xs text-[#024CAA] mt-3">Valid Till: 20 Dec, 2021</p>
        </div>
      </div>
    </div>
  );
};

export default PromoCard;