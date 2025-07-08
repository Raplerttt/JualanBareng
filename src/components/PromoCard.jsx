import React from 'react';
import PropTypes from 'prop-types';

const PromoCard = ({ promo, onClaimVoucher, isClaimed }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50">
        <h3 className="text-xl font-bold text-gray-800 mb-2">{promo.title}</h3>
        <p className="text-sm text-gray-600 mb-4 leading-relaxed">{promo.description}</p>
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-sm font-semibold text-gray-700">Kode: </span>
            <span className="text-base font-mono text-indigo-600 bg-indigo-100 px-2 py-1 rounded">{promo.code}</span>
          </div>
          <p className="text-xs text-gray-500">Berlaku hingga: {promo.validUntil}</p>
        </div>
        <button
          onClick={() => onClaimVoucher(promo.code)}
          disabled={isClaimed}
          className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-all duration-200 ${
            isClaimed
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-md'
          }`}
        >
          {isClaimed ? 'Sudah Diklaim' : 'Klaim Voucher'}
        </button>
      </div>
    </div>
  );
};

PromoCard.propTypes = {
  promo: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    code: PropTypes.string.isRequired,
    validUntil: PropTypes.string.isRequired
  }).isRequired,
  onClaimVoucher: PropTypes.func.isRequired,
  isClaimed: PropTypes.bool.isRequired
};

export default PromoCard;