import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaList, FaCalendarAlt, FaFileExcel, FaSpinner, FaTruck, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import OrderList from './OrderList';
import StatusConfirmModal from './StatusConfirmModal';
import * as XLSX from 'xlsx';

const OrdersSection = ({ orders, setOrders, searchQuery, sortBy }) => {
  const [updatingStatus, setUpdatingStatus] = useState(null);
  const [confirmStatus, setConfirmStatus] = useState(null);
  const [confirmOrderId, setConfirmOrderId] = useState(null);
 
  // Filter and sort orders
  const filteredOrders = React.useMemo(() => {
    return orders
      .filter((order) => {
        const searchTerm = searchQuery.toLowerCase();
        return (
          order.user?.fullName?.toLowerCase().includes(searchTerm) ||
          order.seller?.storeName?.toLowerCase().includes(searchTerm) ||
          order.deliveryAddress?.toLowerCase().includes(searchTerm) ||
          order.id.toString().includes(searchTerm)
        );
      })
      .sort((a, b) => {
        if (sortBy === 'total') return (a.totalAmount || 0) - (b.totalAmount || 0);
        if (sortBy === 'date') return new Date(b.createdAt) - new Date(a.createdAt);
        if (sortBy === 'status') return a.status.localeCompare(b.status);
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
  }, [orders, searchQuery, sortBy]);

  // Export to Excel
  const exportToExcel = () => {
    const data = filteredOrders.map((order) => ({
      'ID Pesanan': `#${order.id}`,
      Pelanggan: order.user?.fullName || 'Tidak diketahui',
      Email: order.user?.email || '-',
      'Nama Toko': order.seller?.storeName || '-',
      Total: `Rp ${order.totalAmount?.toLocaleString('id-ID') || '0'}`,
      Status: formatStatus(order.status).text,
      Alamat: order.deliveryAddress || 'Tidak ada alamat',
      'Tanggal Pemesanan': new Date(order.createdAt).toLocaleString('id-ID', {
        dateStyle: 'medium',
        timeStyle: 'short',
      }),
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Pesanan');
    worksheet['!cols'] = [
      { wch: 15 }, // ID Pesanan
      { wch: 25 }, // Pelanggan
      { wch: 30 }, // Email
      { wch: 25 }, // Nama Toko
      { wch: 20 }, // Total
      { wch: 20 }, // Status
      { wch: 40 }, // Alamat
      { wch: 25 }, // Tanggal Pemesanan
    ];
    XLSX.writeFile(workbook, `Laporan_Pesanan_${new Date().toLocaleDateString('id-ID')}.xlsx`);
  };

  // Format status
  const formatStatus = (status) => {
    const statusMap = {
      PENDING: { text: 'Menunggu Pembayaran', icon: <FaSpinner className="mr-1 animate-spin" />, color: 'bg-yellow-100 text-yellow-800' },
      DIPROSES: { text: 'Diproses', icon: <FaSpinner className="mr-1 animate-spin" />, color: 'bg-blue-100 text-blue-800' },
      DIKIRIM: { text: 'Dikirim', icon: <FaTruck className="mr-1" />, color: 'bg-purple-100 text-purple-800' },
      SELESAI: { text: 'Selesai', icon: <FaCheckCircle className="mr-1" />, color: 'bg-green-100 text-green-800' },
      DIBATALKAN: { text: 'Dibatalkan', icon: <FaTimesCircle className="mr-1" />, color: 'bg-red-100 text-red-800' },
    };
    return statusMap[status] || { text: status, icon: null, color: 'bg-gray-100 text-gray-800' };
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
    >
      <div className="p-5 border-b border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="flex items-center mb-4 md:mb-0">
            <FaList className="text-indigo-600 mr-3 text-xl" />
            <h2 className="text-xl font-semibold text-gray-800">
              Manajemen Pesanan
              <span className="ml-2 text-sm bg-indigo-100 text-indigo-800 px-2.5 py-0.5 rounded-full">
                {filteredOrders.length} pesanan
              </span>
            </h2>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <FaCalendarAlt className="text-gray-400" />
              <span>Terakhir diperbarui: {new Date().toLocaleTimeString('id-ID')}</span>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={exportToExcel}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none flex items-center"
            >
              <FaFileExcel className="mr-2" />
              Ekspor ke Excel
            </motion.button>
          </div>
        </div>
      </div>
      <OrderList
        filteredOrders={filteredOrders}
        setOrders={setOrders}
        updatingStatus={updatingStatus}
        setUpdatingStatus={setUpdatingStatus}
        setConfirmStatus={setConfirmStatus}
        setConfirmOrderId={setConfirmOrderId}
        formatStatus={formatStatus}
        searchQuery={searchQuery}
      />
      <StatusConfirmModal
        confirmStatus={confirmStatus}
        confirmOrderId={confirmOrderId}
        setConfirmStatus={setConfirmStatus}
        setConfirmOrderId={setConfirmOrderId}
        setOrders={setOrders}
        setUpdatingStatus={setUpdatingStatus}
        formatStatus={formatStatus}
      />
    </motion.div>
  );
};

export default OrdersSection;