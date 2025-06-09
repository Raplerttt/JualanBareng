import React, { useState } from 'react';
import PromoCard from './PromoCard';

const PromoList = () => {
  const [claimedVouchers, setClaimedVouchers] = useState(new Set());
  const [notification, setNotification] = useState({ show: false, message: '', isError: false });

  const promos = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
      title: "Promo Diskon 10%",
      description: "Dapatkan potongan 10% untuk semua makanan!",
      code: "DISCOUNT10",
      validUntil: "2023-12-31",
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80",
      title: "Promo Gratis Ongkir",
      description: "Nikmati gratis ongkir untuk setiap pembelian di atas Rp 50.000",
      code: "FREESHIP",
      validUntil: "2023-11-30",
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
      title: "Promo Cashback 20%",
      description: "Dapatkan cashback 20% untuk pembelian pertama!",
      code: "CASHBACK20",
      validUntil: "2024-01-15",
    },
    {
      id: 4,
      image: "https://images.unsplash.com/photo-1555244162-803834f70033?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
      title: "Promo Spesial Weekend",
      description: "Diskon tambahan 15% hanya untuk hari Sabtu dan Minggu!",
      code: "WEEKEND15",
      validUntil: "2023-12-25",
    },
  ];

  const showNotification = (message, isError = false) => {
    setNotification({ show: true, message, isError });
    setTimeout(() => setNotification({ ...notification, show: false }), 3000);
  };

  const claimVoucher = (code) => {
    if (claimedVouchers.has(code)) {
      showNotification(`Voucher ${code} sudah pernah diklaim`, true);
      return;
    }

    setClaimedVouchers(new Set([...claimedVouchers, code]));
    showNotification(`🎉 Voucher ${code} berhasil diklaim!`);
  };

  return (
    <section className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-3">
          Promo & Voucher Spesial
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Klaim promo menarik dan hemat belanja Anda!
        </p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {promos.map((promo) => (
          <PromoCard
            key={promo.id}
            promo={promo}
            onClaimVoucher={claimVoucher}
            isClaimed={claimedVouchers.has(promo.code)}
          />
        ))}
      </div>

      {/* Notification Toast */}
      {notification.show && (
        <div className={`fixed bottom-4 right-4 p-4 rounded-lg shadow-lg text-white ${
          notification.isError ? 'bg-red-500' : 'bg-green-500'
        } transition-transform duration-300 transform ${
          notification.show ? 'translate-y-0' : 'translate-y-full'
        }`}>
          {notification.message}
        </div>
      )}
    </section>
  );
};

export default PromoList;