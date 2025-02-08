import React from 'react';

const RecommendedCuisine = () => {
  const products = [
    {
      id: 1,
      name: 'Product 1',
      category: 'Category A',
      address: 'Address 1',
      image: 'https://images.tokopedia.net/img/cache/700/product-1/2019/12/6/485599702/485599702_b62d148d-ea90-437c-96a6-ec39f1686832_2000_2000.jpg',
      rating: 4.5,
    },
    {
      id: 2,
      name: 'Product 2',
      category: 'Category B',
      address: 'Address 2',
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSYEExHm6TQf6bP_scJnNpzfZgEeA3eW6vbag&s',
      rating: 3.8,
    },
    {
      id: 3,
      name: 'Product 3',
      category: 'Category C',
      address: 'Address 3',
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS1K2jn_HDBg-y807pjTQXRF22frhpOdn7wIQ&s',
      rating: 4.2,
    },
    {
      id: 4,
      name: 'Product 4',
      category: 'Category D',
      address: 'Address 4',
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS8cWEKa23KUn9BWF-9Di3A09GBU-8FrVB_jQ&s',
      rating: 5.0,
    },
  ];

  return (
    <div className="mx-auto py-12">
      <h2 className="text-3xl font-bold text-[#DBD3D3] text-center mb-8">Recommended Cuisine</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 px-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transform transition-all duration-300 hover:scale-105"
          >
            <div className="w-full h-56 bg-gray-200 relative overflow-hidden">
              <img
                src={product.image}
                className="w-full h-full object-cover transition-transform duration-300 ease-in-out hover:scale-110"
                alt={product.name}
                onError={(e) => (e.target.src = 'https://via.placeholder.com/200')}
              />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold text-[#091057] mb-2">{product.name}</h3>
              <p className="text-sm text-gray-600">Category: <span className="text-[#024CAA]">{product.category}</span></p>
              <p className="text-sm text-gray-600 mb-4">Address: {product.address}</p>
              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, index) => (
                  <svg
                    key={index}
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    fill={index < Math.floor(product.rating) ? '#EC8305' : index < product.rating ? '#F5B041' : '#DBD3D3'}
                    className="bi bi-star-fill"
                    viewBox="0 0 16 16"
                  >
                    <path d="M3.612 15.443c-.396.232-.872-.016-.755-.524l1.276-5.245-4.229-3.478c-.358-.296-.171-.888.314-.95l5.279-.454 1.62-5.184c.148-.482.854-.482 1.003 0l1.62 5.184 5.278.454c.485.062.673.653.314.95l-4.229 3.478 1.276 5.245c.117.508-.358.756-.754.524l-5.184-3.01-5.184 3.01z" />
                  </svg>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecommendedCuisine;