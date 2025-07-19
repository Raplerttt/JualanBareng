import React from 'react';
import { motion } from 'framer-motion';
import { FaSearch } from 'react-icons/fa';

const ReportList = ({ reports, activeTab, searchQuery }) => {
  const formatStatus = (status) => {
    const statusMap = {
      SELESAI: { text: 'Selesai', color: 'bg-green-100 text-green-800' },
      DIBATALKAN: { text: 'Dibatalkan', color: 'bg-red-100 text-red-800' },
    };
    return statusMap[status] || { text: status, color: 'bg-gray-100 text-gray-800' };
  };

  return (
    <>
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {activeTab === 'daily' ? (
                <>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jml Pesanan</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Pendapatan</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pesanan Selesai</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pesanan Dibatalkan</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Produk Terlaris</th>
                </>
              ) : (
                <>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bulan</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jml Pesanan</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Pendapatan</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rata-rata Harian</th>
                </>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {reports.map((report, index) => (
              <motion.tr
                key={index}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="hover:bg-gray-50"
              >
                {activeTab === 'daily' ? (
                  <>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-indigo-600">{report.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{report.totalOrders}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Rp {report.totalRevenue.toLocaleString('id-ID')}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{report.completedOrders}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{report.cancelledOrders}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{report.topProduct}</td>
                  </>
                ) : (
                  <>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-indigo-600">{report.month}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{report.totalOrders}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Rp {report.totalRevenue.toLocaleString('id-ID')}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Rp {Math.round(report.avgDailyRevenue).toLocaleString('id-ID')}</td>
                  </>
                )}
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4 p-4">
        {reports.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-gray-100 mb-4">
              <FaSearch className="h-5 w-5 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">Tidak ada laporan ditemukan</h3>
            <p className="text-gray-500">
              {searchQuery ? 'Coba dengan kata kunci lain' : 'Belum ada data penjualan'}
            </p>
          </div>
        ) : (
          reports.map((report, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white p-4 rounded-lg shadow-sm border border-gray-200"
            >
              {activeTab === 'daily' ? (
                <>
                  <div className="text-sm font-medium text-indigo-600 mb-2">{report.date}</div>
                  <div className="text-sm text-gray-900 mb-1">Jml Pesanan: {report.totalOrders}</div>
                  <div className="text-sm text-gray-900 mb-1">Total Pendapatan: Rp {report.totalRevenue.toLocaleString('id-ID')}</div>
                  <div className="text-sm text-gray-900 mb-1">Pesanan Selesai: {report.completedOrders}</div>
                  <div className="text-sm text-gray-900 mb-1">Pesanan Dibatalkan: {report.cancelledOrders}</div>
                  <div className="text-sm text-gray-900">Produk Terlaris: {report.topProduct}</div>
                </>
              ) : (
                <>
                  <div className="text-sm font-medium text-indigo-600 mb-2">{report.month}</div>
                  <div className="text-sm text-gray-900 mb-1">Jml Pesanan: {report.totalOrders}</div>
                  <div className="text-sm text-gray-900 mb-1">Total Pendapatan: Rp {report.totalRevenue.toLocaleString('id-ID')}</div>
                  <div className="text-sm text-gray-900">Rata-rata Harian: Rp {Math.round(report.avgDailyRevenue).toLocaleString('id-ID')}</div>
                </>
              )}
            </motion.div>
          ))
        )}
      </div>
    </>
  );
};

export default React.memo(ReportList);