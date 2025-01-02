import React from 'react';

const RecommendedStore = () => {
  // Dummy Data untuk Produk Toko
  const store = [
    {
      id: 1,
      name: 'Nike Store',
      image: 'https://brandlogos.net/wp-content/uploads/2020/11/nike-swoosh-logo-512x512.png',
    },
    {
      id: 2,
      name: 'Adidas Originals',
      image: 'https://artmosphere-design.com/wp-content/uploads/2023/09/adidas03.jpg',
    },
    {
      id: 3,
      name: 'Puma Sports',
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR8YdDNmFYfmx1RmbbML9r5bv_7-1upIvJGjA&s',
    },
    {
      id: 4,
      name: 'Asics Store',
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQvhZtywmjwYyyg5e9YcoPzRZ32W0KW72j2hA&s',
    },
  ];

  return (
    <div className="container mx-auto py-12">
      <h2 className="text-2xl font-semibold text-center mb-8">Recommended Store</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        {store.map((store) => (
          <div key={store.id} className="text-center">
            {/* Gambar Produk dalam bentuk bulat */}
            <div className="w-32 h-32 mx-auto mb-4 bg-gray-200 flex justify-center items-center rounded-full overflow-hidden">
              <img
                src={store.image}
                alt={store.name}
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            {/* Nama Toko */}
            <h3 className="text-lg font-semibold text-gray-800">{store.name}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecommendedStore;
