// components/PromoList.js
import React, { useState } from 'react';
import PromoCard from './PromoCard';

const PromoList = () => {
  const [claimedVouchers, setClaimedVouchers] = useState([]);

  // Data promo
  const promos = [
    {
      id: 1,
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRDgsd7RrQ9pmlPNyJ-ucx_pmRbJv3sqYcNKQ&s",
      title: "Promo Diskon 10%",
      description: "Dapatkan potongan 10% untuk semua makanan!",
      code: "DISCOUNT10"
    },
    {
      id: 2,
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSF8PYZJ5ir2pbsBvrhNsH-aFdfMh27GjMgfA&s",
      title: "Promo Gratis Ongkir",
      description: "Nikmati gratis ongkir untuk setiap pembelian di atas Rp 50.000",
      code: "FREESHIP"
    },    
    {
        id: 3,
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSF8PYZJ5ir2pbsBvrhNsH-aFdfMh27GjMgfA&s",
        title: "Promo Gratis Ongkir",
        description: "Nikmati gratis ongkir untuk setiap pembelian di atas Rp 50.000",
        code: "FREESHIP"
      },    
      {
        id: 4,
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSF8PYZJ5ir2pbsBvrhNsH-aFdfMh27GjMgfA&s",
        title: "Promo Gratis Ongkir",
        description: "Nikmati gratis ongkir untuk setiap pembelian di atas Rp 50.000",
        code: "FREESHIP"
      },
  ];

  // Fungsi untuk klaim voucher
  const claimVoucher = (code) => {
    if (!claimedVouchers.includes(code)) {
      setClaimedVouchers([...claimedVouchers, code]);
      alert(`Voucher ${code} berhasil diklaim!`);
    } else {
      alert(`Voucher ${code} sudah pernah diklaim.`);
    }
  };

  return (
    <div className="max-w-1xl mx-auto p-8">
      <h1 className="text-2xl font-extrabold text-center text-gray-900 mb-12">Promo dan Voucher</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-10">
        {promos.map((promo) => (
          <PromoCard
            key={promo.id}
            promo={promo}
            onClaimVoucher={claimVoucher}
            isClaimed={claimedVouchers.includes(promo.code)}
          />
        ))}
      </div>
    </div>
  );
};

export default PromoList;
