import React, { useState,useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaTag, FaUser, FaCog, FaFileExcel } from 'react-icons/fa';
import VoucherList from './VoucherList';
import VoucherModal from './VoucherModal';
import DeleteVoucherModal from './DeleteVoucherModal';
import SellerProfile from './SellerProfile';
import * as XLSX from 'xlsx';

const SettingsSection = ({ vouchers, setVouchers, sellerData, setSellerData, searchQuery }) => {
  const [activeTab, setActiveTab] = useState('vouchers');
  const [isVoucherModalOpen, setIsVoucherModalOpen] = useState(false);
  const [editingVoucher, setEditingVoucher] = useState(null);
  const [deleteVoucherId, setDeleteVoucherId] = useState(null);
  
  // Filter vouchers
  const filteredVouchers = React.useMemo(() => {
    const searchTerm = searchQuery.toLowerCase();
    return vouchers
      .filter((voucher) => voucher && voucher.code && voucher.name)
      .filter((voucher) =>
        voucher.code.toLowerCase().includes(searchTerm) ||
        (voucher.name?.toLowerCase().includes(searchTerm))
      )      
  }, [vouchers, searchQuery]);
  
  // Export to Excel
  const exportToExcel = () => {
    const data = filteredVouchers.map((voucher) => ({
      'Kode Voucher': voucher.code,
      Deskripsi: voucher.description,
      Diskon: `${voucher.discount}%`,
      'Masa Berlaku': new Date(voucher.expiryDate).toLocaleDateString('id-ID'),
      Status: voucher.isActive ? 'Aktif' : 'Nonaktif',
      'Tanggal Dibuat': new Date(voucher.createdAt).toLocaleDateString('id-ID'),
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Voucher');
    worksheet['!cols'] = [
      { wch: 15 }, // Kode Voucher
      { wch: 30 }, // Deskripsi
      { wch: 10 }, // Diskon
      { wch: 20 }, // Masa Berlaku
      { wch: 10 }, // Status
      { wch: 20 }, // Tanggal Dibuat
    ];
    XLSX.writeFile(workbook, `Laporan_Voucher_${new Date().toLocaleDateString('id-ID')}.xlsx`);
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
            <FaCog className="text-indigo-600 mr-3 text-xl" />
            <h2 className="text-xl font-semibold text-gray-800">Pengaturan</h2>
          </div>
          <div className="flex space-x-4">
            <button
              onClick={() => setActiveTab('vouchers')}
              className={`px-4 py-2 rounded-md font-medium ${
                activeTab === 'vouchers'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              } transition-colors`}
            >
              <FaTag className="inline mr-2" /> Voucher
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              className={`px-4 py-2 rounded-md font-medium ${
                activeTab === 'profile'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              } transition-colors`}
            >
              <FaUser className="inline mr-2" /> Profil Seller
            </button>
          </div>
        </div>
      </div>
      {activeTab === 'vouchers' ? (
        <>
          <div className="p-5 border-b border-gray-200">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="flex items-center mb-4 md:mb-0">
                <FaTag className="text-indigo-600 mr-3 text-xl" />
                <h3 className="text-lg font-semibold text-gray-800">
                  Pengelolaan Voucher
                  <span className="ml-2 text-sm bg-indigo-100 text-indigo-800 px-2.5 py-0.5 rounded-full">
                    {filteredVouchers.length} voucher
                  </span>
                </h3>
              </div>
              <div className="flex items-center space-x-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setEditingVoucher(null);
                    setIsVoucherModalOpen(true);
                  }}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none flex items-center"
                >
                  Tambah Voucher
                </motion.button>
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
          <VoucherList
            filteredVouchers={filteredVouchers}
            setVouchers={setVouchers}
            setIsVoucherModalOpen={setIsVoucherModalOpen}
            setEditingVoucher={setEditingVoucher}
            setDeleteVoucherId={setDeleteVoucherId}
          />
          <VoucherModal
            isOpen={isVoucherModalOpen}
            setIsOpen={setIsVoucherModalOpen}
            editingVoucher={editingVoucher}
            setVouchers={setVouchers}
          />
          <DeleteVoucherModal
            deleteVoucherId={deleteVoucherId}
            setDeleteVoucherId={setDeleteVoucherId}
            setVouchers={setVouchers}
          />
        </>
      ) : (
        <SellerProfile sellerData={sellerData} setSellerData={setSellerData} />
      )}
    </motion.div>
  );
};

export default SettingsSection;