// components/PromoList.js
import React, { useState } from 'react';
import PromoCard from './PromoCard';

const PromoList = () => {
  const [claimedVouchers, setClaimedVouchers] = useState(new Set());

  const promos = [
    {
      id: 1,
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRDgsd7RrQ9pmlPNyJ-ucx_pmRbJv3sqYcNKQ&s",
      title: "Promo Diskon 10%",
      description: "Dapatkan potongan 10% untuk semua makanan!",
      code: "DISCOUNT10",
    },
    {
      id: 2,
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSF8PYZJ5ir2pbsBvrhNsH-aFdfMh27GjMgfA&s",
      title: "Promo Gratis Ongkir",
      description: "Nikmati gratis ongkir untuk setiap pembelian di atas Rp 50.000",
      code: "FREESHIP",
    },
    {
      id: 3,
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSF8PYZJ5ir2pbsBvrhNsH-aFdfMh27GjMgfA&s",
      title: "Promo Cashback 20%",
      description: "Dapatkan cashback 20% untuk pembelian pertama!",
      code: "CASHBACK20",
    },
    {
      id: 4,
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSF8PYZJ5ir2pbsBvrhNsH-aFdfMh27GjMgfA&s",
      title: "Promo Spesial Weekend",
      description: "Diskon tambahan 15% hanya untuk hari Sabtu dan Minggu!",
      code: "WEEKEND15",
    },
  ];

  const claimVoucher = (code) => {
    if (!claimedVouchers.has(code)) {
      setClaimedVouchers(new Set([...claimedVouchers, code]));
      alert(`🎉 Voucher ${code} berhasil diklaim!`);
    } else {
      alert(`❌ Voucher ${code} sudah pernah diklaim.`);
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-12 px-6">
      <h1 className="text-3xl font-extrabold text-center text-[#DBD3D3] mb-6 tracking-wide">
        Promo & Voucher Spesial
      </h1>
      <p className="text-center text-[#DBD3D3] text-lg mb-10">
        Klaim promo menarik dan hemat belanja Anda!
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {promos.map((promo) => (
          <PromoCard
            key={promo.id}
            promo={promo}
            onClaimVoucher={claimVoucher}
            isClaimed={claimedVouchers.has(promo.code)}
          />
        ))}
      </div>
    </div>
  );
};

export default PromoList;
