import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaChevronDown, FaChevronUp, FaSpinner } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

const RegistrationTable = ({ registrations, updateRegistrationStatus }) => {
  const [selectedId, setSelectedId] = useState(null);
  const [zoomedImage, setZoomedImage] = useState(null);
  const [zoomedImageAlt, setZoomedImageAlt] = useState('');
  const [updatingId, setUpdatingId] = useState(null);

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) throw new Error('Invalid date');
      return date.toLocaleString('id-ID', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      }).replace(',', '');
    } catch {
      return 'Tanggal tidak valid';
    }
  };

  const handleStatusChange = async (id, value) => {
    try {
      setUpdatingId(id);
      console.log('Mengubah status pendaftaran:', { id, status: value }); // Debugging
      await updateRegistrationStatus(id, value);
      toast.success(`Status pendaftaran #${id} berhasil diubah ke ${getStatusLabel(value)}`);
      if (value === 'VERIFIED' || value === 'REJECTED') setSelectedId(null);
    } catch (error) {
      console.error('Gagal mengubah status pendaftaran:', error);
      toast.error('Gagal mengubah status pendaftaran');
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusStyles = (status) => {
    switch (status) {
      case 'VERIFIED':
        return 'bg-green-100 text-green-800 ring-green-200';
      case 'REJECTED':
        return 'bg-red-100 text-red-800 ring-red-200';
      case 'PENDING':
      default:
        return 'bg-yellow-100 text-yellow-800 ring-yellow-200';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'VERIFIED':
        return 'Terverifikasi';
      case 'REJECTED':
        return 'Ditolak';
      case 'PENDING':
      default:
        return 'Menunggu Verifikasi';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 max-w-7xl mx-auto">
      {registrations.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-600 text-lg font-medium">Tidak ada pendaftaran ditemukan</div>
          <div className="mt-2 text-sm text-gray-400">Coba ubah filter pencarian Anda</div>
        </div>
      ) : (
        <div className="space-y-3">
          {/* Header Tabel */}
          <div className="hidden md:grid md:grid-cols-3 gap-4 bg-gradient-to-r from-[#80CBC4]/10 to-[#4DB6AC]/10 p-4 rounded-lg font-semibold text-gray-900 text-sm">
            <div>Nama Toko</div>
            <div>Email</div>
            <div>Status</div>
          </div>
          {/* Daftar Pendaftaran */}
          {registrations.map((reg, index) => (
            <div key={reg.id} className={`rounded-lg ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
              <motion.div
                className="border border-gray-200 rounded-lg p-4 hover:bg-[#80CBC4]/10 cursor-pointer transition-colors"
                onClick={() => setSelectedId(selectedId === reg.id ? null : reg.id)}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-800">{reg.storeName || '-'}</span>
                    <span className="md:hidden text-xs text-gray-500">
                      {selectedId === reg.id ? <FaChevronUp /> : <FaChevronDown />}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 truncate">{reg.email || '-'}</div>
                  <div className="flex items-center space-x-2">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ring-1 ring-inset ${getStatusStyles(reg.verificationStatus)}`}
                      aria-label={`Status: ${getStatusLabel(reg.verificationStatus)}`}
                    >
                      {getStatusLabel(reg.verificationStatus)}
                    </span>
                    <span className="hidden md:block text-xs text-gray-500">
                      {selectedId === reg.id ? <FaChevronUp /> : <FaChevronDown />}
                    </span>
                  </div>
                </div>
              </motion.div>
              {/* Detail saat diklik */}
              <AnimatePresence>
                {selectedId === reg.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="border border-gray-200 rounded-lg p-5 mt-2 bg-gray-50"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h3 className="text-sm font-semibold text-gray-900 border-b border-gray-200 pb-2">Informasi Umum</h3>
                        <div>
                          <label className="text-xs font-medium text-gray-500">Nomor Telepon</label>
                          <p className="text-sm text-gray-700">{reg.phoneNumber || '-'}</p>
                        </div>
                        <div>
                          <label className="text-xs font-medium text-gray-500">Alamat</label>
                          <p className="text-sm text-gray-700">{reg.address || '-'}</p>
                        </div>
                        <div>
                          <label className="text-xs font-medium text-gray-500">Kota</label>
                          <p className="text-sm text-gray-700">{reg.city || '-'}</p>
                        </div>
                        <div>
                          <label className="text-xs font-medium text-gray-500">Tanggal Pendaftaran</label>
                          <p className="text-sm text-gray-700">{formatDate(reg.createdAt)}</p>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <h3 className="text-sm font-semibold text-gray-900 border-b border-gray-200 pb-2">Dokumen Verifikasi</h3>
                        <div>
                          <label className="text-xs font-medium text-gray-500">NIK</label>
                          <p className="text-sm text-gray-700">{reg.nik || '-'}</p>
                        </div>
                        <div>
                          <label className="text-xs font-medium text-gray-500">Foto KTP</label>
                          {reg.ktpUrl ? (
                            <img
                              src={`http://localhost:3000/${reg.ktpUrl}`}
                              alt="Foto KTP"
                              className="max-h-40 w-auto rounded-md cursor-pointer hover:shadow-md transition-shadow"
                              onClick={() => {
                                setZoomedImage(reg.ktpUrl);
                                setZoomedImageAlt('Foto KTP');
                              }}
                              loading="lazy"
                              aria-label="Klik untuk memperbesar Foto KTP"
                            />
                          ) : (
                            <p className="text-sm text-gray-700">-</p>
                          )}
                        </div>
                        <div>
                          <label className="text-xs font-medium text-gray-500">Bukti Usaha</label>
                          {reg.usahaProofUrl ? (
                            <img
                              src={`http://localhost:3000/${reg.usahaProofUrl}`}
                              alt="Bukti Usaha"
                              className="max-h-40 w-auto rounded-md cursor-pointer hover:shadow-md transition-shadow"
                              onClick={() => {
                                setZoomedImage(reg.usahaProofUrl);
                                setZoomedImageAlt('Bukti Usaha');
                              }}
                              loading="lazy"
                              aria-label="Klik untuk memperbesar Bukti Usaha"
                            />
                          ) : (
                            <p className="text-sm text-gray-700">-</p>
                          )}
                        </div>
                      </div>
                      <div className="sm:col-span-2 flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
                        <select
                          value={reg.verificationStatus || 'PENDING'}
                          onChange={(e) => handleStatusChange(reg.id, e.target.value)}
                          disabled={updatingId === reg.id}
                          className={`py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 text-sm font-medium ${
                            reg.verificationStatus === 'VERIFIED'
                              ? 'bg-green-50 text-green-800'
                              : reg.verificationStatus === 'REJECTED'
                              ? 'bg-red-50 text-red-800'
                              : 'bg-yellow-50 text-yellow-800'
                          } ${updatingId === reg.id ? 'opacity-70 cursor-not-allowed' : ''}`}
                          aria-label="Ubah status pendaftaran"
                        >
                          <option value="PENDING">Menunggu Verifikasi</option>
                          <option value="VERIFIED">Terverifikasi</option>
                          <option value="REJECTED">Ditolak</option>
                        </select>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      )}

      {/* Zoom Image Modal */}
      <AnimatePresence>
        {zoomedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4 sm:p-6"
            onClick={() => setZoomedImage(null)}
            role="dialog"
            aria-modal="true"
            aria-label="Modal pembesaran gambar"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="relative bg-white rounded-2xl shadow-2xl p-6 max-w-4xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setZoomedImage(null)}
                className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 transition-colors"
                aria-label="Tutup modal"
              >
                <FaTimes size={28} />
              </button>
              <div className="flex flex-col items-center">
                <img
                  src={`http://localhost:3000/${zoomedImage}`}
                  alt={zoomedImageAlt}
                  className="w-full max-h-[80vh] object-contain rounded-lg"
                  loading="lazy"
                />
                <p className="mt-4 text-sm font-medium text-gray-600">{zoomedImageAlt}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RegistrationTable;