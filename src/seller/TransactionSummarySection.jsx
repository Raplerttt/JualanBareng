import React from "react";
import { motion } from "framer-motion";
import { FaFileExcel, FaMoneyBillWave, FaListAlt, FaCalendarAlt } from "react-icons/fa";
import * as XLSX from "xlsx";

const TransactionSummarySection = ({ orders = [] }) => {
  // Menghitung statistik rekap
  const totalTransactions = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
  const orderCountByStatus = orders.reduce(
    (acc, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1;
      return acc;
    },
    { PENDING: 0, DIPROSES: 0, DIKIRIM: 0, SELESAI: 0, DIBATALKAN: 0 }
  );
  const averageTransaction = orders.length > 0 ? totalTransactions / orders.length : 0;
  const dateRange = orders.length > 0
    ? {
        min: new Date(Math.min(...orders.map((o) => new Date(o.createdAt)))).toLocaleDateString("id-ID"),
        max: new Date(Math.max(...orders.map((o) => new Date(o.createdAt)))).toLocaleDateString("id-ID"),
      }
    : { min: "-", max: "-" };

  // Format status untuk tampilan
  const formatStatus = (status) => {
    const statusMap = {
      PENDING: "Menunggu Pembayaran",
      DIPROSES: "Diproses",
      DIKIRIM: "Dikirim",
      SELESAI: "Selesai",
      DIBATALKAN: "Dibatalkan",
    };
    return statusMap[status] || status;
  };

  // Fungsi untuk ekspor rekap ke Excel
  const exportToExcel = () => {
    const data = [
      {
        "Metrik": "Total Transaksi",
        "Nilai": `Rp ${totalTransactions.toLocaleString("id-ID")}`,
        "Keterangan": "Jumlah semua transaksi",
      },
      {
        "Metrik": "Jumlah Pesanan (Menunggu Pembayaran)",
        "Nilai": orderCountByStatus.PENDING,
        "Keterangan": "Pesanan dengan status Menunggu Pembayaran",
      },
      {
        "Metrik": "Jumlah Pesanan (Diproses)",
        "Nilai": orderCountByStatus.DIPROSES,
        "Keterangan": "Pesanan dengan status Diproses",
      },
      {
        "Metrik": "Jumlah Pesanan (Dikirim)",
        "Nilai": orderCountByStatus.DIKIRIM,
        "Keterangan": "Pesanan dengan status Dikirim",
      },
      {
        "Metrik": "Jumlah Pesanan (Selesai)",
        "Nilai": orderCountByStatus.SELESAI,
        "Keterangan": "Pesanan dengan status Selesai",
      },
      {
        "Metrik": "Jumlah Pesanan (Dibatalkan)",
        "Nilai": orderCountByStatus.DIBATALKAN,
        "Keterangan": "Pesanan dengan status Dibatalkan",
      },
      {
        "Metrik": "Rata-rata Transaksi",
        "Nilai": `Rp ${averageTransaction.toLocaleString("id-ID", { maximumFractionDigits: 2 })}`,
        "Keterangan": "Rata-rata nilai per transaksi",
      },
      {
        "Metrik": "Rentang Tanggal",
        "Nilai": `${dateRange.min} - ${dateRange.max}`,
        "Keterangan": "Rentang tanggal transaksi",
      },
    ];

    // Membuat worksheet dan workbook
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Rekap Transaksi");

    // Menyesuaikan lebar kolom
    worksheet["!cols"] = [
      { wch: 30 }, // Metrik
      { wch: 20 }, // Nilai
      { wch: 40 }, // Keterangan
    ];

    // Menyimpan file Excel
    XLSX.writeFile(workbook, `Rekap_Transaksi_${new Date().toLocaleDateString("id-ID")}.xlsx`);
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
            <FaListAlt className="text-indigo-600 mr-3 text-xl" />
            <h2 className="text-xl font-semibold text-gray-800">
              Rekap Transaksi
              <span className="ml-2 text-sm bg-indigo-100 text-indigo-800 px-2.5 py-0.5 rounded-full">
                {orders.length} transaksi
              </span>
            </h2>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <FaCalendarAlt className="text-gray-400" />
              <span>Terakhir diperbarui: {new Date().toLocaleTimeString("id-ID")}</span>
            </div>
            <button
              onClick={exportToExcel}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none flex items-center"
            >
              <FaFileExcel className="mr-2" />
              Ekspor ke Excel
            </button>
          </div>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-12 px-4">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-gray-100 mb-4">
            <FaMoneyBillWave className="h-5 w-5 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">Tidak ada transaksi ditemukan</h3>
          <p className="text-gray-500">Belum ada transaksi yang tercatat.</p>
        </div>
      ) : (
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h3 className="text-sm font-medium text-gray-500">Total Transaksi</h3>
              <p className="text-2xl font-semibold text-gray-800 mt-1">
                Rp {totalTransactions.toLocaleString("id-ID")}
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h3 className="text-sm font-medium text-gray-500">Jumlah Pesanan per Status</h3>
              <div className="mt-2 space-y-1">
                {Object.entries(orderCountByStatus).map(([status, count]) => (
                  <p key={status} className="text-sm text-gray-700">
                    {formatStatus(status)}: <span className="font-semibold">{count}</span>
                  </p>
                ))}
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h3 className="text-sm font-medium text-gray-500">Rata-rata Transaksi</h3>
              <p className="text-2xl font-semibold text-gray-800 mt-1">
                Rp {averageTransaction.toLocaleString("id-ID", { maximumFractionDigits: 2 })}
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h3 className="text-sm font-medium text-gray-500">Rentang Tanggal</h3>
              <p className="text-sm text-gray-700 mt-1">
                {dateRange.min} - {dateRange.max}
              </p>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default TransactionSummarySection;