import React, { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthService } from '../../auth/authService';
import toast from 'react-hot-toast';

const VoucherModal = ({ isOpen, setIsOpen, editingVoucher, setVouchers }) => {
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    discount: '',
    expiryDate: '',
    minPurchase: '',
    isActive: true,
    type: 'PERSENTASE',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editingVoucher) {
      setFormData({
        code: editingVoucher.code,
        name: editingVoucher.name,
        discount: editingVoucher.discount,
        expiryDate: new Date(editingVoucher.expiryAt).toISOString().split('T')[0],
        minPurchase: editingVoucher.minPurchase,
        isActive: editingVoucher.status,
        type: editingVoucher.type,
      });
    } else {
      setFormData({
        code: '',
        name: '',
        discount: '',
        expiryDate: '',
        minPurchase: '',
        isActive: true,
        type: 'PERCENT',
      });
    }
  }, [editingVoucher]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.code.trim()) newErrors.code = 'Kode voucher diperlukan';
    if (!formData.name.trim()) newErrors.name = 'Nama voucher diperlukan';
    if (!formData.discount || formData.discount <= 0 || formData.discount > 100)
      newErrors.discount = 'Diskon harus antara 1 dan 100';
    if (!formData.expiryDate) newErrors.expiryDate = 'Tanggal berlaku diperlukan';
    if (!formData.minPurchase || formData.minPurchase < 0) newErrors.minPurchase = 'Minimal pembelian wajib diisi';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const voucherData = {
      name: formData.name,
      code: formData.code.toUpperCase(),
      type: formData.type, // "PERSENTASE" atau "TETAP"
      discount: parseFloat(formData.discount),
      minPurchase: parseFloat(formData.minPurchase),
      usageCount: 0,
      status: formData.isActive,
      expiryAt: `${formData.expiryDate}T23:59:59Z`,
    };    

    try {
      if (editingVoucher) {
        // TODO: Tambahkan fungsi update jika ada endpoint updateVoucher
        toast.error('Fitur edit voucher belum tersedia');
      } else {
        const result = await AuthService.addVoucher(voucherData);
        const updatedVouchers = await AuthService.getVouchers();
        setVouchers(updatedVouchers);
        toast.success('Voucher berhasil ditambahkan');
      }
      setIsOpen(false);
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setIsOpen(false)}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-800">
                {editingVoucher ? 'Edit Voucher' : 'Tambah Voucher'}
              </h3>
              <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-gray-700">
                <FaTimes />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Kode Voucher</label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="Masukkan kode voucher"
                />
                {errors.code && <p className="text-red-500 text-xs mt-1">{errors.code}</p>}
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Nama Voucher</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="Contoh: Promo Ramadhan"
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Diskon (%)</label>
                <input
                  type="number"
                  value={formData.discount}
                  onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg"
                  min="1"
                  max="100"
                />
                {errors.discount && <p className="text-red-500 text-xs mt-1">{errors.discount}</p>}
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Minimal Pembelian</label>
                <input
                  type="number"
                  value={formData.minPurchase}
                  onChange={(e) => setFormData({ ...formData, minPurchase: e.target.value })}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="Rp"
                />
                {errors.minPurchase && <p className="text-red-500 text-xs mt-1">{errors.minPurchase}</p>}
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Jenis Voucher</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                <option value="PERSENTASE">Diskon Persen</option>
                <option value="NOMINAL">Potongan Tetap</option>
              </select>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Masa Berlaku</label>
                <input
                  type="date"
                  value={formData.expiryDate}
                  onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
                {errors.expiryDate && <p className="text-red-500 text-xs mt-1">{errors.expiryDate}</p>}
              </div>

              <div className="mb-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">Aktif</span>
                </label>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg"
                >
                  {editingVoucher ? 'Perbarui' : 'Tambah'}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default VoucherModal;
