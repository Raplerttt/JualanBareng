import React from 'react';
import { FunnelIcon } from '@heroicons/react/24/outline';

const RegistrationFilterPanel = ({ filters, setFilters, filter, setFilter }) => {
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleTypeChange = (e) => {
    setFilter(e.target.value);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <FunnelIcon className="h-5 w-5 text-gray-400 mr-2" />
        Filter Pendaftaran
      </h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Jenis Pendaftaran
          </label>
          <select
            name="type"
            value={filter}
            onChange={handleTypeChange}
            className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
          >
            <option value="all">Semua Pendaftaran</option>
            <option value="pending">Hanya Menunggu Verifikasi</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status Pendaftaran
          </label>
          <select
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
            className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
          >
            <option value="all">Semua Status</option>
            <option value="Pending">Menunggu Verifikasi</option>
            <option value="Verified">Terverifikasi</option>
          </select>
        </div>
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Cari Pendaftar
          </label>
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FunnelIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            name="search"
            value={filters.search}
            onChange={handleFilterChange}
            placeholder="Cari nama toko atau email..."
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
          />
        </div>
      </div>
    </div>
  );
};

export default RegistrationFilterPanel;