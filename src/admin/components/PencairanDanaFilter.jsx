import React from 'react';
import { FiSearch } from 'react-icons/fi';

const PencairanDanaFilter = ({ searchQuery, setSearchQuery }) => {
  return (
    <div className="relative">
      <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
      <input
        type="text"
        placeholder="Cari Order ID atau Nama Seller..."
        className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
    </div>
  );
};

export default PencairanDanaFilter;