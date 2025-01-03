import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const RecommendedCausine = () => {
  // Contoh data untuk produk rekomendasi
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
    <div className="container mx-auto py-12">
      <h2 className="text-2xl font-semibold text-center mb-8">Recommended Causine</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
      {products.map((product, index) => {
          const { ref, inView } = useInView({ threshold: 0.2 });
          return (
            <motion.div
              ref={ref}
              key={product.id}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              transition={{ duration: 0.9, ease: 'easeOut' }}
              className="bg-white rounded-lg shadow-lg overflow-hidden relative"
            >
              <div className="w-full h-48 bg-gray-200">
                <img src={product.image} className="w-full h-full object-cover rounded-md" alt={product.name} />
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default RecommendedCausine;
