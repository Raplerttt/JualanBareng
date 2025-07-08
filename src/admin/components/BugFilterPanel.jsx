import React from 'react';
import { FunnelIcon, Squares2X2Icon } from '@heroicons/react/24/outline';

const BugFilterPanel = ({ filters, setFilters }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-md">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Search Input */}
        <div>
          <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
            <FunnelIcon className="h-5 w-5 text-gray-400 mr-2" />
            Cari Laporan
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FunnelIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="search"
              type="text"
              name="search"
              value={filters.search}
              onChange={handleChange}
              placeholder="Cari judul atau deskripsi..."
              className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-200"
              aria-label="Cari laporan berdasarkan judul atau deskripsi"
            />
          </div>
        </div>

        {/* Category Filter */}
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
            <Squares2X2Icon className="h-5 w-5 text-gray-400 mr-2" />
            Kategori
          </label>
          <div className="relative">
            <select
              id="category"
              name="category"
              value={filters.category}
              onChange={handleChange}
              className="block w-full py-2.5 pl-3 pr-10 border border-gray-200 bg-gray-50 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 appearance-none transition-all duration-200"
              aria-label="Filter berdasarkan kategori laporan"
            >
              <option value="all">Semua Kategori</option>
              <optgroup label="Status">
                <option value="status:PENDING">Status: Pending</option>
                <option value="status:IN_PROGRESS">Status: In Progress</option>
                <option value="status:RESOLVED">Status: Resolved</option>
                <option value="status:REJECTED">Status: Rejected</option>
              </optgroup>
              <optgroup label="Jenis Laporan">
                <option value="reportType:BUG">Jenis: Bug</option>
                <option value="reportType:FRAUD">Jenis: Fraud</option>
                <option value="reportType:ABUSE">Jenis: Abuse</option>
                <option value="reportType:OTHER">Jenis: Other</option>
              </optgroup>
              <optgroup label="Subjek">
                <option value="subjectType:PRODUCT">Subjek: Product</option>
                <option value="subjectType:SELLER">Subjek: Seller</option>
                <option value="subjectType:ORDER">Subjek: Order</option>
                <option value="subjectType:APP">Subjek: App</option>
              </optgroup>
              <optgroup label="Pengirim">
                <option value="senderType:USER">Pengirim: User</option>
                <option value="senderType:SELLER">Pengirim: Seller</option>
              </optgroup>
            </select>
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BugFilterPanel;