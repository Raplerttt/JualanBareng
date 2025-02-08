import React from 'react';
import { useInView } from 'react-intersection-observer';

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

const StoreCard = ({ store }) => {
  const { ref, inView } = useInView({ threshold: 0.2, triggerOnce: true });

  return (
    <div
      ref={ref}
      className="flex flex-col items-center group p-4 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300"
    >
      <a href="/detail-store">
        <div className="w-40 h-40 bg-[#024CAA] flex justify-center items-center rounded-full overflow-hidden shadow-md group-hover:shadow-lg transition-shadow duration-300">
          <img
            src={store.image}
            alt={store.name}
            className="w-full h-full object-contain rounded-full p-4"
          />
        </div>
      </a>
      <h3 className="mt-4 text-lg font-semibold text-[#DBD3D3] group-hover:text-[#EC8305] transition-colors duration-300">
        {store.name}
      </h3>
    </div>
  );
};

const RecommendedStore = () => {
  return (
    <div className="mx-auto py-12 px-4">
      <h2 className="text-3xl font-bold text-center mb-10 text-[#DBD3D3]">
        Recommended Stores
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8">
        {stores.map((store) => (
          <StoreCard key={store.id} store={store} />
        ))}
      </div>
    </div>
  );
};

export default RecommendedStore;
