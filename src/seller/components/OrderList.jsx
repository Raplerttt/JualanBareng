import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaMoneyBillWave, FaCalendarAlt, FaSearch, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import StatusConfirmModal from './StatusConfirmModal';
import { AuthService } from '../../auth/authService';
import { toast } from 'react-hot-toast';

const OrderList = ({ filteredOrders, setOrders, updatingStatus, setUpdatingStatus, formatStatus, searchQuery }) => {
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [confirmStatus, setConfirmStatus] = useState(null);
  const [confirmOrderId, setConfirmOrderId] = useState(null);
  const [updatingPayment, setUpdatingPayment] = useState(null);

  const toggleDetails = (orderId) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  const handlePaymentConfirm = async (orderId) => {
    try {
      setUpdatingPayment(orderId);
      const order = filteredOrders.find((o) => o.id === orderId);
      const paymentId = order?.payments?.[0]?.id;
      if (!paymentId) {
        throw new Error('ID pembayaran tidak ditemukan');
      }
      await AuthService.updatePaymentStatus(paymentId, 'COMPLETED');
      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderId
            ? {
                ...o,
                payments: o.payments.map((p, i) =>
                  i === 0 ? { ...p, status: 'COMPLETED' } : p
                ),
              }
            : o
        )
      );
      toast.success(`Pembayaran untuk pesanan #${orderId} berhasil dikonfirmasi`);
    } catch (error) {
      console.error('Gagal mengkonfirmasi pembayaran:', error);
      toast.error('Gagal mengkonfirmasi pembayaran');
    } finally {
      setUpdatingPayment(null);
    }
  };

  const detailVariants = {
    hidden: { height: 0, opacity: 0 },
    visible: { height: 'auto', opacity: 1, transition: { duration: 0.3 } },
    exit: { height: 0, opacity: 0, transition: { duration: 0.2 } }
  };

  return (
    <>
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID Pesanan</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pelanggan</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div className="flex items-center">
                  <FaMoneyBillWave className="mr-1" /> Total
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Alamat</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div className="flex items-center">
                  <FaCalendarAlt className="mr-1" /> Tanggal
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredOrders.map((order) => {
              const statusInfo = formatStatus(order.status);
              return (
                <React.Fragment key={order.id}>
                  <motion.tr
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => toggleDetails(order.id)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-indigo-600 flex items-center">
                        #{order.id}
                        {expandedOrderId === order.id ? (
                          <FaChevronUp className="ml-2 text-xs" />
                        ) : (
                          <FaChevronDown className="ml-2 text-xs" />
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{order.user?.fullName || 'Tidak diketahui'}</div>
                      <div className="text-sm text-gray-500">{order.user?.email || ''}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      Rp {order.totalAmount?.toLocaleString('id-ID') || '0'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={order.status}
                        onChange={(e) => {
                          setConfirmStatus(e.target.value);
                          setConfirmOrderId(order.id);
                        }}
                        disabled={updatingStatus === order.id}
                        className={`flex items-center px-3 py-1 rounded-full text-xs font-medium border-none focus:ring-2 focus:ring-indigo-500 ${statusInfo.color} ${
                          updatingStatus === order.id ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'
                        }`}
                        onClick={(e) => e.stopPropagation()}
                      >
                        {['PENDING', 'DIPROSES', 'DIKIRIM', 'SELESAI', 'DIBATALKAN'].map((status) => (
                          <option key={status} value={status}>
                            {formatStatus(status).text}
                          </option>
                        ))}
                      </select>
                      {updatingStatus === order.id && (
                        <span className="ml-2 text-xs text-gray-500">Memperbarui...</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 line-clamp-2">{order.deliveryAddress || 'Tidak ada alamat'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{new Date(order.createdAt).toLocaleDateString('id-ID')}</div>
                      <div className="text-xs text-gray-500">
                        {new Date(order.createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </td>
                  </motion.tr>
                  <AnimatePresence>
                    {expandedOrderId === order.id && (
                      <motion.tr
                        variants={detailVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="bg-gray-50"
                      >
                        <td colSpan="6" className="px-6 py-4">
                          <div className="text-sm text-gray-900">
                            <h4 className="font-medium text-gray-900 mb-2">Detail Pesanan</h4>
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                              <div>
                                <p className="font-medium">Items:</p>
                                <ul className="list-disc pl-5">
                                  {order.orderDetails?.map((item, index) => (
                                    <li key={index}>
                                      {item.product?.productName || 'Produk tidak diketahui'} - {item.quantity} x Rp {item.subtotal.toLocaleString('id-ID')}
                                    </li>
                                  )) || <li>Tidak ada item</li>}
                                </ul>
                              </div>
                              <div>
                                <p className="font-medium">Catatan Pengiriman:</p>
                                <p>{order.deliveryNotes || 'Tidak ada catatan'}</p>
                                <p className="font-medium mt-2">Status Pembayaran:</p>
                                <p>{order.payments[0]?.status || 'Belum dibayar'}</p>
                                <p className="font-medium mt-2">Metode Pembayaran:</p>
                                <p>{order.payments[0]?.method || 'Tidak ada metode'}</p>
                                {order.payments[0]?.method === 'CASH' && order.payments[0]?.status !== 'COMPLETED' && (
                                  <button
                                    onClick={() => handlePaymentConfirm(order.id)}
                                    disabled={updatingPayment === order.id}
                                    className={`mt-3 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors ${
                                      updatingPayment === order.id ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'
                                    }`}
                                  >
                                    {updatingPayment === order.id ? 'Mengkonfirmasi...' : 'Konfirmasi Pembayaran'}
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>
                      </motion.tr>
                    )}
                  </AnimatePresence>
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4 p-4">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-gray-100 mb-4">
              <FaSearch className="h-5 w-5 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">Tidak ada pesanan ditemukan</h3>
            <p className="text-gray-500">
              {searchQuery ? 'Coba dengan kata kunci lain' : 'Belum ada pesanan yang tercatat'}
            </p>
          </div>
        ) : (
          filteredOrders.map((order) => {
            const statusInfo = formatStatus(order.status);
            return (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white p-4 rounded-lg shadow-sm border border-gray-200"
              >
                <div
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => toggleDetails(order.id)}
                >
                  <div className="text-sm font-medium text-indigo-600">#{order.id}</div>
                  {expandedOrderId === order.id ? (
                    <FaChevronUp className="text-xs" />
                  ) : (
                    <FaChevronDown className="text-xs" />
                  )}
                </div>
                <div className="text-sm font-medium text-gray-900">{order.user?.fullName || 'Tidak diketahui'}</div>
                <div className="text-sm text-gray-500 mb-2">{order.user?.email || ''}</div>
                <div className="text-sm font-medium text-gray-900 mb-2">
                  Rp {order.totalAmount?.toLocaleString('id-ID') || '0'}
                </div>
                <div className="mb-2">
                  <select
                    value={order.status}
                    onChange={(e) => {
                      setConfirmStatus(e.target.value);
                      setConfirmOrderId(order.id);
                    }}
                    disabled={updatingStatus === order.id}
                    className={`flex items-center px-3 py-1 rounded-full text-xs font-medium border-none focus:ring-2 focus:ring-indigo-500 ${statusInfo.color} ${
                      updatingStatus === order.id ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'
                    }`}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {['PENDING', 'DIPROSES', 'DIKIRIM', 'SELESAI', 'DIBATALKAN'].map((status) => (
                      <option key={status} value={status}>
                        {formatStatus(status).text}
                      </option>
                    ))}
                  </select>
                  {updatingStatus === order.id && (
                    <span className="ml-2 text-xs text-gray-500">Memperbarui...</span>
                  )}
                </div>
                <div className="text-sm text-gray-900 line-clamp-2 mb-2">{order.deliveryAddress || 'Tidak ada alamat'}</div>
                <div className="text-sm text-gray-900">
                  {new Date(order.createdAt).toLocaleDateString('id-ID')}
                </div>
                <div className="text-xs text-gray-500">
                  {new Date(order.createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                </div>
                <AnimatePresence>
                  {expandedOrderId === order.id && (
                    <motion.div
                      variants={detailVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="mt-4 pt-4 border-t border-gray-200"
                    >
                      <h4 className="font-medium text-gray-900 mb-2">Detail Pesanan</h4>
                      <div className="grid grid-cols-1 gap-4">
                        <div>
                          <p className="font-medium">Items:</p>
                          <ul className="list-disc pl-5">
                            {order.orderDetails?.map((item, index) => (
                              <li key={index}>
                                {item.product?.name || 'Produk tidak diketahui'} - {item.quantity} x Rp {item.subtotal.toLocaleString('id-ID')}
                              </li>
                            )) || <li>Tidak ada item</li>}
                          </ul>
                        </div>
                        <div>
                          <p className="font-medium">Catatan Pengiriman:</p>
                          <p>{order.deliveryNotes || 'Tidak ada catatan'}</p>
                          <p className="font-medium mt-2">Status Pembayaran:</p>
                          <p>{order.payments[0]?.status || 'Belum dibayar'}</p>
                          <p className="font-medium mt-2">Metode Pembayaran:</p>
                          <p>{order.payments[0]?.method || 'Tidak ada metode'}</p>
                          {order.payments[0]?.method === 'CASH' && order.payments[0]?.status !== 'COMPLETED' && (
                            <button
                              onClick={() => handlePaymentConfirm(order.id)}
                              disabled={updatingPayment === order.id}
                              className={`mt-3 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors ${
                                updatingPayment === order.id ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'
                              }`}
                            >
                              {updatingPayment === order.id ? 'Mengkonfirmasi...' : 'Konfirmasi Pembayaran'}
                            </button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })
        )}
      </div>

      {/* Status Confirm Modal */}
      <StatusConfirmModal
        confirmStatus={confirmStatus}
        confirmOrderId={confirmOrderId}
        setConfirmStatus={setConfirmStatus}
        setConfirmOrderId={setConfirmOrderId}
        setOrders={setOrders}
        setUpdatingStatus={setUpdatingStatus}
        formatStatus={formatStatus}
      />
    </>
  );
};

export default React.memo(OrderList);