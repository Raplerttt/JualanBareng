import React from 'react';
import { FaStar } from 'react-icons/fa';

const ProductRecommendation = () => {
  const products = [
    {
      id: 1,
      name: 'Nike Air MX Super 2500 - Red',
      category: 'Sneakers',
      address: 'New York, USA',
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ5mVr92lbt5kgy6B8rBaBTFN9FaqCtdQtirg&s',
      rating: 4.5,
    },
    {
      id: 2,
      name: 'Adidas Ultra Boost 2022',
      category: 'Running Shoes',
      address: 'Los Angeles, USA',
      image: 'https://down-id.img.susercontent.com/file/6312c7533186471bb5ae6c68b1fbd1ef',
      rating: 4.0,
    },
    {
      id: 3,
      name: 'Puma Running Shoes',
      category: 'Sportswear',
      address: 'Miami, USA',
      image: 'https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_500,h_500/global/310199/01/sv01/fnd/IDN/fmt/png/FAST-R-NITRO%E2%84%A2-Elite-2-Running-Shoes-Men',
      rating: 4.2,
    },
    {
      id: 4,
      name: 'Asics Gel Nimbus 23',
      category: 'Running Shoes',
      address: 'San Francisco, USA',
      image: 'https://images.tokopedia.net/img/cache/700/VqbcmM/2022/8/12/1d2d074d-e5ed-48a2-9b88-59b91a7f94df.jpg',
      rating: 4.8,
    },
  ];

  return (
    <div className="container mx-auto py-12">
      <h2 className="text-2xl font-semibold text-center mb-8">Recommended Products</h2>
      {/* Produk Populer dan Promo Section */}
      <div className="flex items-center justify-between space-x-8">
        {/* Produk Populer (Lebih lebar) */}
        <div className="w-full">
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4">
            {products.map((product) => (
              <div
                key={product.id}
                className="group border-white flex flex-col w-full overflow-hidden rounded-lg border bg-white shadow-md"
              >
                <a className="relative mx-2 mt-2 flex h-48 overflow-hidden rounded-xl" href="#">
                  <img
                    className="peer absolute top-0 right-0 h-full w-full object-cover"
                    src={product.image}
                    alt={product.name}
                  />
                </a>
                <div className="mt-4 px-3 pb-3">
                  <a href="#">
                    <h5 className="text-xl tracking-tight text-Black">{product.name}</h5>
                  </a>
                  <div className="mt-2 mb-3 items-center text-sm text-black">
                    <p>Category: {product.category}</p>
                    <p>Address: {product.address}</p>
                  </div>
                  <div className="flex justify-end items-center">
                    <div className="flex">
                      {Array.from({ length: 5 }, (_, index) => (
                        <FaStar
                          key={index}
                          className={`text-yellow-400 ${index < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-400'}`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductRecommendation;
