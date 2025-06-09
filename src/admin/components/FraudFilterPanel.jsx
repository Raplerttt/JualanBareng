import React from 'react';

import { FunnelIcon } from '@heroicons/react/24/outline';

const FraudFilterPanel = ({ filters, setFilters }) => {

const handleChange = (e) => {

const { name, value } = e.target;

setFilters(prev => ({ ...prev, [name]: value }));

};

return (

<div className="bg-white p-4 rounded-xl shadow">

<div className="grid grid-cols-1 md:grid-cols-4 gap-4">

{/* Search Input */}

<div className="md:col-span-2">

<div className="relative">

<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">

<FunnelIcon className="h-5 w-5 text-gray-400" />

</div>

<input

type="text"

name="search"

value={filters.search}

onChange={handleChange}

placeholder="Cari ID Transaksi atau deskripsi..."

className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"

/>

</div>

</div>

{/* Status Filter */}

<div>

<label className="block text-sm font-medium text-gray-700 mb-1">

Status

</label>

<select

name="status"

value={filters.status}

onChange={handleChange}

className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"

>

<option value="all">Semua Status</option>

<option value="open">Open</option>

<option value="investigating">Investigating</option>

<option value="resolved">Resolved</option>

<option value="closed">Closed</option>

</select>

</div>

{/* Date Range Filter */}

<div>

<label className="block text-sm font-medium text-gray-700 mb-1">

Rentang Waktu

</label>

<select

name="dateRange"

value={filters.dateRange}

onChange={handleChange}

className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"

>

<option value="all">Semua</option>

<option value="today">Hari Ini</option>

<option value="week">Minggu Ini</option>

<option value="month">Bulan Ini</option>

</select>

</div>

</div>

</div>

);

};

export default FraudFilterPanel;

