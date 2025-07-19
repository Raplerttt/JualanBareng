import React from 'react';
import { FaTimes } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthService } from '../../auth/authService'; // tambahkan jika belum ada
import { toast } from 'react-hot-toast'; // opsional untuk feedback visual


const StatusConfirmModal = ({ confirmStatus, confirmOrderId, setConfirmStatus, setConfirmOrderId, setOrders, setUpdatingStatus, formatStatus, }) => {
  const handleConfirmStatusChange = async () => {
    try {
      setUpdatingStatus(confirmOrderId);
  
      await AuthService.updateOrderStatus(confirmOrderId, confirmStatus);
  
      setOrders((prev) =>
        prev.map((order) =>
          order.id === confirmOrderId ? { ...order, status: confirmStatus } : order
        )
      );
  
      toast.success(`Status pesanan #${confirmOrderId} berhasil diubah ke "${formatStatus(confirmStatus).text}"`);
    } catch (error) {
      console.error('Gagal mengubah status pesanan:', error);
      toast.error('Gagal mengubah status pesanan');
    } finally {
      setUpdatingStatus(null);
      setConfirmStatus(null);
      setConfirmOrderId(null);
    }
  };  

  return (
    <AnimatePresence>
      {confirmStatus && confirmOrderId && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => {
            setConfirmStatus(null);
            setConfirmOrderId(null);
          }}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-800">Konfirmasi Perubahan Status</h3>
              <button
                onClick={() => {
                  setConfirmStatus(null);
                  setConfirmOrderId(null);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes />
              </button>
            </div>
            <p className="text-gray-600 mb-6">
              Apakah Anda yakin ingin mengubah status pesanan #{confirmOrderId} ke{' '}
              <span className="font-semibold">{formatStatus(confirmStatus).text}</span>? Tindakan ini tidak dapat dibatalkan.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setConfirmStatus(null);
                  setConfirmOrderId(null);
                }}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleConfirmStatusChange}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Konfirmasi
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default StatusConfirmModal;