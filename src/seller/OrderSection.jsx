import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaList, FaSearch, FaCalendarAlt, FaMoneyBillWave, FaTruck, FaCheckCircle, FaTimesCircle, FaSpinner, FaFileExcel } from "react-icons/fa";
import axios from "../../utils/axios";
import { toast } from "react-toastify";
import * as XLSX from "xlsx";

const OrdersSection = ({ orders = [], searchQuery = "", sortBy, loading, error }) => {
  const [localOrders, setLocalOrders] = useState(orders);
  const [updatingStatus, setUpdatingStatus] = useState(null);

  // Enhanced filter and sort
  const filteredOrders = localOrders
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
      if (sortBy === "total") return (a.totalAmount || 0) - (b.totalAmount || 0);
      if (sortBy === "date") return new Date(b.createdAt) - new Date(a.createdAt); // Newest first
      if (sortBy === "status") return a.status.localeCompare(b.status);
      return new Date(b.createdAt) - new Date(a.createdAt); // Default: newest first
    });

  // Enhanced status change handler with confirmation
  const handleStatusChange = async (orderId, newStatus) => {
    if (!window.confirm(`Anda yakin ingin mengubah status pesanan ini ke "${formatStatus(newStatus).text}"?`)) {
      return;
    }

    const token = localStorage.getItem("Admintoken");
    if (!token) {
      toast.error("Sesi habis, silakan login ulang");
      return;
    }

    const previousOrder = localOrders.find((o) => o.id === orderId);
    if (!previousOrder) {
      toast.error("Pesanan tidak ditemukan");
      return;
    }

    try {
      setUpdatingStatus(orderId);
      
      // Optimistic update
      setLocalOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );

      await axios.patch(
        `/orders/${orderId}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success(
        <div>
          <p className="font-semibold">Status pesanan berhasil diubah!</p>
          <p className="text-sm">ID: #{orderId} → {formatStatus(newStatus).text}</p>
        </div>,
        { autoClose: 3000 }
      );
    } catch (err) {
      console.error("Update error:", err);
      toast.error(err.response?.data?.message || "Gagal memperbarui status pesanan");
      // Rollback
      setLocalOrders((prev) =>
        prev.map((o) => (o.id === orderId ? previousOrder : o))
      );
    } finally {
      setUpdatingStatus(null);
    }
  };

  // Enhanced status formatting with icons
  const formatStatus = (status) => {
    const statusMap = {
      PENDING: { text: "Menunggu Pembayaran", icon: <FaSpinner className="mr-1 animate-spin" />, color: "bg-yellow-100 text-yellow-800" },
      DIPROSES: { text: "Diproses", icon: <FaSpinner className="mr-1 animate-spin" />, color: "bg-blue-100 text-blue-800" },
      DIKIRIM: { text: "Dikirim", icon: <FaTruck className="mr-1" />, color: "bg-purple-100 text-purple-800" },
      SELESAI: { text: "Selesai", icon: <FaCheckCircle className="mr-1" />, color: "bg-green-100 text-green-800" },
      DIBATALKAN: { text: "Dibatalkan", icon: <FaTimesCircle className="mr-1" />, color: "bg-red-100 text-red-800" },
    };
    return statusMap[status] || { text: status, icon: null, color: "bg-gray-100 text-gray-800" };
  };

  // Fungsi untuk ekspor pesanan ke Excel
  const exportToExcel = () => {
    // Mengumpulkan data pesanan dalam format yang sesuai untuk Excel
    const data = filteredOrders.map((order) => ({
      "ID Pesanan": `#${order.id}`,
      Pelanggan: order.user?.fullName || "Tidak diketahui",
      Email: order.user?.email || "-",
      "Nama Toko": order.seller?.storeName || "-",
      Total: `Rp ${order.totalAmount?.toLocaleString("id-ID") || "0"}`,
      Status: formatStatus(order.status).text,
      Alamat: order.deliveryAddress || "Tidak ada alamat",
      "Tanggal Pemesanan": new Date(order.createdAt).toLocaleString("id-ID", {
        dateStyle: "medium",
        timeStyle: "short",
      }),
    }));

    // Membuat worksheet dan workbook
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Pesanan");

    // Menyesuaikan lebar kolom (opsional)
    worksheet["!cols"] = [
      { wch: 15 }, // ID Pesanan
      { wch: 25 }, // Pelanggan
      { wch: 30 }, // Email
      { wch: 25 }, // Nama Toko
      { wch: 20 }, // Total
      { wch: 20 }, // Status
      { wch: 40 }, // Alamat
      { wch: 25 }, // Tanggal Pemesanan
    ];

    // Menyimpan file Excel
    XLSX.writeFile(workbook, `Laporan_Pesanan_${new Date().toLocaleDateString("id-ID")}.xlsx`);
  };

  // Loading state with skeleton loader
  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <div className="animate-pulse flex space-x-4">
              <div className="flex-1 space-y-4 py-1">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <FaTimesCircle className="h-5 w-5 text-red-500" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Gagal memuat pesanan</h3>
            <div className="mt-2 text-sm text-red-700">
              {error}
              <button
                onClick={() => window.location.reload()}
                className="ml-2 text-sm font-medium text-red-700 hover:text-red-600 underline"
              >
                Coba lagi
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main UI
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

      {filteredOrders.length === 0 ? (
        <div className="text-center py-12 px-4">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-gray-100 mb-4">
            <FaSearch className="h-5 w-5 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">Tidak ada pesanan ditemukan</h3>
          <p className="text-gray-500">
            {searchQuery ? "Coba dengan kata kunci lain" : "Belum ada pesanan yang tercatat"}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID Pesanan
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pelanggan
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center">
                    <FaMoneyBillWave className="mr-1" /> Total
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Alamat
                </th>
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
                  <motion.tr
                    key={order.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-indigo-600">#{order.id}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {order.user?.fullName || "Tidak diketahui"}
                      </div>
                      <div className="text-sm text-gray-500">
                        {order.user?.email || ""}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      Rp {order.totalAmount?.toLocaleString("id-ID") || "0"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        disabled={updatingStatus === order.id}
                        className={`flex items-center px-3 py-1 rounded-full text-xs font-medium border-none focus:ring-2 focus:ring-indigo-500 ${statusInfo.color} ${
                          updatingStatus === order.id ? "opacity-70 cursor-not-allowed" : "cursor-pointer"
                        }`}
                      >
                        {["PENDING", "DIPROSES", "DIKIRIM", "SELESAI", "DIBATALKAN"].map((status) => {
                          const s = formatStatus(status);
                          return (
                            <option key={status} value={status} className="flex items-center">
                              {s.text}
                            </option>
                          );
                        })}
                      </select>
                      {updatingStatus === order.id && (
                        <span className="ml-2 text-xs text-gray-500">Memperbarui...</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 line-clamp-2">
                        {order.deliveryAddress || "Tidak ada alamat"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(order.createdAt).toLocaleDateString("id-ID")}
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(order.createdAt).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </motion.div>
  );
};

export default OrdersSection;