import React, { useState, useEffect } from 'react';

const ProductHits = () => {
  // Dummy data untuk gambar produk dan promo
  const popularProducts = [
    {
      id: 1,
      src: "https://media.suara.com/pictures/970x544/2020/09/29/30882-bimo-picky-picks-menikah.jpg",
      alt: "Produk Populer 1",
    },
    {
      id: 2,
      src: "https://thumb.viva.co.id/media/frontend/thumbs3/2021/01/31/6016677ade030-dj-irene-agustin_1265_711.jpg",
      alt: "Produk Populer 2",
    },
  ];

  const promos = [
    {
      id: 1,
      src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRDgsd7RrQ9pmlPNyJ-ucx_pmRbJv3sqYcNKQ&s",
      alt: "Promo 1",
    },
    {
      id: 2,
      src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSF8PYZJ5ir2pbsBvrhNsH-aFdfMh27GjMgfA&s",
      alt: "Promo 2",
    },
  ];

  // State untuk gambar yang sedang ditampilkan
  const [currentProductIndex, setCurrentProductIndex] = useState(0);
  const [currentPromoIndex, setCurrentPromoIndex] = useState(0);

  // Mengubah gambar setiap 3 detik
  useEffect(() => {
    const productInterval = setInterval(() => {
      setCurrentProductIndex((prevIndex) => (prevIndex + 1) % popularProducts.length);
    }, 3000);

    const promoInterval = setInterval(() => {
      setCurrentPromoIndex((prevIndex) => (prevIndex + 1) % promos.length);
    }, 3000);

    return () => {
      clearInterval(productInterval);
      clearInterval(promoInterval);
    };
  }, []);

  return (
    <div className="container mx-auto py-12">
      {/* Produk Populer dan Promo Section */}
      <div className="flex items-center justify-between space-x-8">
        {/* Produk Populer (Lebih lebar) */}
        <div className="w-2/3">
          <img
            src={popularProducts[currentProductIndex].src}
            alt={popularProducts[currentProductIndex].alt}
            className="w-full h-auto rounded-lg shadow-lg"
          />
        </div>

        {/* Promo (Lebih kecil) */}
        <div className="w-1/3">
          <img
            src={promos[currentPromoIndex].src}
            alt={promos[currentPromoIndex].alt}
            className="w-full h-auto rounded-lg shadow-lg"
          />
        </div>
      </div>
    </div>
  );
};

export default ProductHits;
