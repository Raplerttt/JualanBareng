import React, { useState } from 'react';
import { FunnelIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { FaSpinner } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

const RegistrationFilterPanel = ({ totalSellers, filters, setFilters, isFiltering }) => {

  const handleStatusChange = (e) => {
    const { name, value } = e.target;
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
  };
  

  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
  };
  

  const handleResetFilters = () => {
    const resetFilters = { status: 'ALL', search: '' };
    setFilters(resetFilters);
    toast.success('Filter telah direset');
  };
  

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 max-w-7xl mx-auto mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <FunnelIcon className="h-5 w-5 text-gray-400 mr-2" aria-hidden="true" />
          Filter Pendaftaran
        </h3>
        <p className="text-sm text-gray-500 flex items-center">
          {isFiltering && (
            <FaSpinner className="animate-spin h-4 w-4 text-blue-600 mr-2" aria-hidden="true" />
          )}
          Menampilkan {totalSellers} pendaftaran
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="status"
            className="block text-sm font-medium text-gray-700 mb-1"
            title="Filter berdasarkan status verifikasi pendaftaran"
          >
            Status Pendaftaran
          </label>
          <select
            id="status"
            name="status"
            value={filters.status}
            onChange={handleStatusChange}
            className="block w-full py-3 px-4 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 text-sm"
            aria-label="Pilih status pendaftaran"
          >
            <option value="ALL">Semua Status</option>
            <option value="PENDING">Menunggu Verifikasi</option>
            <option value="VERIFIED">Terverifikasi</option>
            <option value="REJECTED">Ditolak</option>
          </select>
        </div>
        <div className="relative">
          <label
            htmlFor="search"
            className="block text-sm font-medium text-gray-700 mb-1"
            title="Cari berdasarkan nama toko atau email"
          >
            Cari Pendaftar
          </label>
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FunnelIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </div>
          <input
            id="search"
            type="text"
            name="search"
            value={filters.search}
            onChange={handleSearchChange}
            placeholder="Cari nama toko atau email..."
            className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 text-sm"
            aria-label="Cari pendaftar berdasarkan nama toko atau email"
          />
        </div>
        <div className="sm:col-span-2 flex justify-end">
          <button
            onClick={handleResetFilters}
            className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors text-sm font-medium"
            aria-label="Reset semua filter"
          >
            <XMarkIcon className="h-5 w-5 mr-2" aria-hidden="true" />
            Reset Filter
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegistrationFilterPanel;