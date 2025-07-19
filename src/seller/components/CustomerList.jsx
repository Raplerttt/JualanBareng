import React, { useMemo } from 'react';
import { FaSearch, FaTimes } from 'react-icons/fa';
import { motion } from 'framer-motion';

const CustomerList = ({ customers, setCustomers, selectedCustomer, setSelectedCustomer, searchQuery, isSidebarOpen, setIsSidebarOpen }) => {
    const filteredCustomers = useMemo(() => {
        const keyword = (searchQuery || '').toLowerCase();
        return customers.filter((customer) =>
          (customer?.name || '').toLowerCase().includes(keyword)
        );
      }, [customers, searchQuery]);
      

  return (
    <motion.div
      initial={{ x: -50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`w-full md:w-80 bg-white rounded-2xl shadow-lg border-r border-gray-200 flex flex-col fixed md:static top-0 left-0 h-full z-20 ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } md:translate-x-0 transition-transform duration-300`}
    >
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">Pesan Pelanggan</h2>
        <button
          onClick={() => setIsSidebarOpen(false)}
          className="md:hidden text-gray-600 hover:text-gray-800"
        >
          <FaTimes size={18} />
        </button>
      </div>
      <div className="p-4 border-b border-gray-200">
        <div className="relative">
          <FaSearch className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Cari pelanggan..."
            className="w-full pl-8 pr-4 py-2 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)} // Managed in App.jsx
          />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        {filteredCustomers.length === 0 ? (
          <div className="p-4 text-center text-gray-500">Tidak ada chat ditemukan</div>
        ) : (
          filteredCustomers.map((customer) => (
            <motion.div
              key={customer.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`flex items-center p-3 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                selectedCustomer?.id === customer.id ? 'bg-indigo-50' : ''
              }`}
              onClick={() => setSelectedCustomer(customer)}
            >
              <div className="relative">
                <img
                  src={customer.profilePic}
                  alt={customer.name}
                  className="w-12 h-12 rounded-full object-cover mr-3"
                />
                {customer.isOnline && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-medium text-gray-900 truncate">{customer.name}</h3>
                  <span className="text-xs text-gray-500">{customer.time}</span>
                </div>
                <p className="text-sm text-gray-500 truncate">{customer.lastMessage}</p>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  );
};

export default CustomerList;