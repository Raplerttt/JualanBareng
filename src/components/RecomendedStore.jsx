import React, { useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { motion } from 'framer-motion';
import axios from '../../utils/axios'; // Pastikan path ini sesuai

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
      <a href={`/detail-store/${store.id}`} className="w-full flex flex-col items-center">
        <div className="w-32 h-32 md:w-40 md:h-40 bg-gray-700 flex justify-center items-center rounded-full overflow-hidden shadow-lg group-hover:shadow-xl transition-all duration-500 group-hover:scale-105">
          <img
            src={store.photo}
            alt={store.storeName}
            className="w-3/4 h-3/4 object-contain rounded-full transition-all duration-500 group-hover:scale-110"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = `https://dummyimage.com/150x150/cccccc/000000.png&text=No+Image`;
            }}
          />
        </div>
        <h3 className="mt-6 text-xl font-medium text-gray-200 group-hover:text-orange-400 transition-colors duration-300">
          {store.storeName}
        </h3>
      </a>
    </motion.div>
  );
};

const RecommendedStore = () => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const fetchSellers = async () => {
      try {
        const response = await axios.get('/seller?page=1&limit=10&status=VERIFIED');
        console.log('Response:', response.data); // Debugging
        const data = response.data.data || response.data; // Fallback jika data tidak nested

        if (!isMounted) return;

        const mappedStores = data.map((store) => ({
          id: store.id,
          storeName: store.storeName || 'Unknown',
          photo: store.photo
            ? `http://localhost:3000/${store.photo}`
            : `https://via.placeholder.com/150?text=${encodeURIComponent(store.storeName || 'Store')}`,
        }));

        console.log('Mapped stores:', mappedStores); // Debugging
        setStores(mappedStores);
      } catch (err) {
        console.error('Error:', err.response?.data); // Debugging
        if (isMounted) {
          setError(err.response?.data?.message || 'Gagal mengambil data toko');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchSellers();

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return (
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center text-gray-700">Loading...</div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center text-red-500">{error}</div>
      </section>
    );
  }

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <h2 className="text-4xl font-bold text-black mb-4">Toko Terverifikasi</h2>
        <div className="w-24 h-1 bg-orange-500 mx-auto"></div>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {stores.length > 0 ? (
          stores.map((store, index) => (
            <StoreCard key={store.id} store={store} index={index} />
          ))
        ) : (
          <div className="text-center text-gray-500 col-span-full">
            Tidak ada toko yang tersedia.
          </div>
        )}
      </div>
    </section>
  );
};

export default RecommendedStore;