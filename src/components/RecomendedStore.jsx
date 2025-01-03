import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

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
      {store.map((store, index) => {
          const { ref, inView } = useInView({ threshold: 0.2 });
          return (
            <motion.div
              ref={ref}
              key={store.id}
              initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
              animate={inView ? { opacity: 1, scale: 1, rotate: 0 } : { opacity: 0, scale: 0.8, rotate: -5 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="text-center"
            >
              <div className="w-48 h-48 mx-auto mb-4 bg-gray-200 flex justify-center items-center rounded-full overflow-hidden">
                <img
                  src={store.image}
                  alt={store.name}
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">{store.name}</h3>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default RecommendedStore;
