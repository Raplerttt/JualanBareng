import React from 'react';
import { useInView } from 'react-intersection-observer';
import { motion } from 'framer-motion';

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

const StoreCard = ({ store, index }) => {
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="flex flex-col items-center p-6 rounded-2xl bg-gradient-to-b from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 transition-all duration-500 group cursor-pointer"
    >
      <a href="/detail-store" className="w-full flex flex-col items-center">
        <div className="w-32 h-32 md:w-40 md:h-40 bg-gray-700 flex justify-center items-center rounded-full overflow-hidden shadow-lg group-hover:shadow-xl transition-all duration-500 group-hover:scale-105">
          <img
            src={store.image}
            alt={store.name}
            className="w-3/4 h-3/4 object-contain rounded-full transition-all duration-500 group-hover:scale-110"
          />
        </div>
        <h3 className="mt-6 text-xl font-medium text-gray-200 group-hover:text-orange-400 transition-colors duration-300">
          {store.name}
        </h3>
      </a>
    </motion.div>
  );
};

const RecommendedStore = () => {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <h2 className="text-4xl font-bold text-gray-100 mb-4">
          Recommended Stores
        </h2>
        <div className="w-24 h-1 bg-orange-500 mx-auto"></div>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {stores.map((store, index) => (
          <StoreCard key={store.id} store={store} index={index} />
        ))}
      </div>
    </section>
  );
};

export default RecommendedStore;