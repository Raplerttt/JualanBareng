import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const RecommendedStore = () => {
  const stores = [
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
    <div className="mx-auto py-12 px-4">
      <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Recommended Stores</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8">
        {stores.map((store, index) => {
          const { ref, inView } = useInView({ threshold: 0.2 });
          return (
            <motion.div
              ref={ref}
              key={store.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="flex flex-col items-center group"
            >
              <div className="w-48 h-48 bg-gray-200 flex justify-center items-center rounded-full overflow-hidden shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                <img
                  src={store.image}
                  alt={store.name}
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-800 group-hover:text-blue-600 transition-colors duration-300">
                {store.name}
              </h3>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default RecommendedStore;
