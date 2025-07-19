import React from 'react';
import { motion } from 'framer-motion';
import { FaEdit, FaTrash, FaSearch } from 'react-icons/fa';

const VoucherList = ({
  filteredVouchers,
  setVouchers,
  setIsVoucherModalOpen,
  setEditingVoucher,
  setDeleteVoucherId,
  searchQuery,
}) => {
  const formatStatus = (status) => ({
    text: status ? 'Aktif' : 'Nonaktif',
    color: status ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800',
  });

  return (
    <>
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kode</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nama</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipe</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Diskon</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Min. Belanja</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Jumlah Digunakan</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Masa Berlaku</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Aksi</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredVouchers.map((voucher) => {
              const statusInfo = formatStatus(voucher.status);
              return (
                <motion.tr
                  key={voucher.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="hover:bg-gray-50"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-indigo-600">{voucher.code}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{voucher.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{voucher.type}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{voucher.discount}%</td>
                  <td className="px-6 py-4 text-sm text-gray-700">Rp {voucher.minPurchase.toLocaleString()}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{voucher.usageCount}x</td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {new Date(voucher.expiryAt).toLocaleDateString('id-ID')}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
                      {statusInfo.text}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => {
                        setEditingVoucher(voucher);
                        setIsVoucherModalOpen(true);
                      }}
                      className="text-indigo-600 hover:text-indigo-800 mr-4"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => setDeleteVoucherId(voucher.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4 p-4">
        {filteredVouchers.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-gray-100 mb-4">
              <FaSearch className="h-5 w-5 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">Tidak ada voucher ditemukan</h3>
            <p className="text-gray-500">
              {searchQuery ? 'Coba dengan kata kunci lain' : 'Belum ada voucher yang tercatat'}
            </p>
          </div>
        ) : (
          filteredVouchers.map((voucher) => {
            const statusInfo = formatStatus(voucher.status);
            return (
              <motion.div
                key={voucher.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white p-4 rounded-lg shadow-sm border border-gray-200"
              >
                <div className="text-sm font-medium text-indigo-600 mb-2">{voucher.code}</div>
                <div className="text-sm text-gray-900 mb-1">{voucher.name}</div>
                <div className="text-sm text-gray-700 mb-1">Tipe: {voucher.type}</div>
                <div className="text-sm text-gray-700 mb-1">Diskon: {voucher.discount}%</div>
                <div className="text-sm text-gray-700 mb-1">
                  Min. Belanja: Rp {voucher.minPurchase.toLocaleString()}
                </div>
                <div className="text-sm text-gray-700 mb-1">Digunakan: {voucher.usageCount}x</div>
                <div className="text-sm text-gray-700 mb-2">
                  Berlaku sampai: {new Date(voucher.expiryAt).toLocaleDateString('id-ID')}
                </div>
                <div className="mb-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
                    {statusInfo.text}
                  </span>
                </div>
                <div className="flex space-x-4">
                  <button
                    onClick={() => {
                      setEditingVoucher(voucher);
                      setIsVoucherModalOpen(true);
                    }}
                    className="text-indigo-600 hover:text-indigo-800"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => setDeleteVoucherId(voucher.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <FaTrash />
                  </button>
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </>
  );
};

export default React.memo(VoucherList);
