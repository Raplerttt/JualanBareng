import React, { useState, useEffect } from "react";
import axios from "../../utils/axios";
import { motion } from "framer-motion";
import {
  FaCog,
  FaTicketAlt,
  FaPlus,
  FaTrash,
} from "react-icons/fa";

const SettingsSection = () => {
  const [activeTab, setActiveTab] = useState("voucher");
  const [vouchers, setVouchers] = useState([]);
  const [newVoucher, setNewVoucher] = useState({
    name: "",
    code: "",
    type: "PERSENTASE",
    discount: 0,
    minPurchase: 0,
    startDate: "",
    expiryAt: "",
  });
  const [showForm, setShowForm] = useState(false);
  const [sellerData, setSellerData] = useState({
    id: "",
    storeName: "",
    email: "",
    phoneNumber: "",
    address: "",
    city: "",
    photo: null,
  });
  const [photoPreview, setPhotoPreview] = useState(null);
  const [notifications, setNotifications] = useState(false);
  const [showOutOfStock, setShowOutOfStock] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("Sellertoken");

  // Fetch seller data
  const fetchSellerData = async () => {
    if (!token) {
      setError("Silakan login untuk mengakses pengaturan.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get("/seller/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      console.log("API Response:", response); // Debugging

      const responseData = response.data?.data || response.data;
      
      if (!responseData) {
        throw new Error("Response data is empty");
      }

      setSellerData({
        id: responseData.id || "",
        storeName: responseData.storeName || "",
        email: responseData.email || "",
        phoneNumber: responseData.phoneNumber || "",
        address: responseData.address || "",
        city: responseData.city || "",
        photo: responseData.photo || null,
      });
      
      setPhotoPreview(responseData.photo || null);
      setNotifications(responseData.notifications || false);
      setShowOutOfStock(responseData.showOutOfStock || false);
      
    } catch (err) {
      console.error("Error fetching seller data:", err);
      setError(
        err.response?.data?.message || 
        err.message || 
        "Gagal memuat data toko. Silakan coba lagi."
      );
    } finally {
      setLoading(false);
    }
  };

  // Fetch vouchers
  const fetchVouchers = async () => {
    if (!token) {
      setError("Silakan login untuk mengakses voucher.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get("/vouchers", {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (!response.data) {
        throw new Error("Invalid response structure");
      }

      setVouchers(response.data.data || []);
    } catch (err) {
      console.error("Error fetching vouchers:", err);
      setError(
        err.response?.data?.message || 
        err.message || 
        "Gagal memuat voucher. Silakan coba lagi."
      );
    }
  };

  useEffect(() => {
    fetchSellerData();
    fetchVouchers();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewVoucher({ ...newVoucher, [name]: value });
  };

  const handleSellerInputChange = (e) => {
    const { name, value } = e.target;
    setSellerData({ ...sellerData, [name]: value });
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSellerData({ ...sellerData, photo: file });
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const addVoucher = async () => {
    if (!token) {
      alert("Token tidak ditemukan. Silakan login ulang.");
      return;
    }

    const voucherType = newVoucher.type.toUpperCase();
    const parsedExpiryAt = Date.parse(newVoucher.expiryAt);
    const parsedStartDate = Date.parse(newVoucher.startDate);

    if (
      !newVoucher.name?.trim() ||
      !newVoucher.code?.trim() ||
      !voucherType ||
      !newVoucher.expiryAt ||
      isNaN(parsedExpiryAt) ||
      !newVoucher.startDate ||
      isNaN(parsedStartDate) ||
      parsedStartDate >= parsedExpiryAt ||
      Number(newVoucher.discount) < 0.01 ||
      Number(newVoucher.minPurchase) < 0 ||
      (voucherType === "PERSENTASE" && Number(newVoucher.discount) > 100)
    ) {
      alert("Harap isi semua kolom wajib dengan benar! Pastikan tanggal mulai sebelum tanggal berakhir.");
      return;
    }

    const payload = {
      name: newVoucher.name.trim(),
      code: newVoucher.code.trim(),
      type: voucherType,
      discount: Number(newVoucher.discount),
      minPurchase: Number(newVoucher.minPurchase),
      usageCount: 0,
      status: true,
      startDate: new Date(newVoucher.startDate).toISOString(),
      expiryAt: new Date(newVoucher.expiryAt).toISOString(),
    };

    try {
      await axios.post("/vouchers", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      setNewVoucher({
        name: "",
        code: "",
        type: "PERSENTASE",
        discount: 0,
        minPurchase: 0,
        startDate: "",
        expiryAt: "",
      });
      fetchVouchers();
      setShowForm(false);
      alert("Voucher berhasil ditambahkan!");
    } catch (error) {
      console.error("Error saat menambahkan voucher:", error.response || error);
      alert("Gagal menambahkan voucher. Periksa kembali data Anda.");
    }
  };

  const toggleVoucherStatus = async (id) => {
    if (!token) {
      alert("Silakan login ulang.");
      return;
    }

    try {
      const voucher = vouchers.find((v) => v.id === id);
      await axios.put(
        `/vouchers/${id}`,
        { status: !voucher.status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setVouchers(
        vouchers.map((v) => (v.id === id ? { ...v, status: !v.status } : v))
      );
      alert(`Voucher berhasil ${voucher.status ? "dinonaktifkan" : "diaktifkan"}!`);
    } catch (err) {
      console.error("Error updating voucher status:", err);
      alert("Gagal memperbarui status voucher. Silakan coba lagi.");
    }
  };

  const deleteVoucher = async (id) => {
    if (!token) {
      alert("Silakan login ulang.");
      return;
    }

    if (!window.confirm("Apakah Anda yakin ingin menghapus voucher ini?")) {
      return;
    }

    try {
      await axios.delete(`/vouchers/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setVouchers(vouchers.filter((voucher) => voucher.id !== id));
      alert("Voucher berhasil dihapus!");
    } catch (err) {
      console.error("Error deleting voucher:", err);
      alert("Gagal menghapus voucher. Silakan coba lagi.");
    }
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    if (!token) {
      alert("Silakan login ulang.");
      return;
    }

    if (
      !sellerData.storeName?.trim() ||
      !sellerData.email?.trim() ||
      !sellerData.phoneNumber?.trim() ||
      !sellerData.address?.trim() ||
      !sellerData.city?.trim()
    ) {
      alert("Harap isi semua kolom wajib!");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("storeName", sellerData.storeName.trim());
      formData.append("email", sellerData.email.trim());
      formData.append("phoneNumber", sellerData.phoneNumber.trim());
      formData.append("address", sellerData.address.trim());
      formData.append("city", sellerData.city.trim());
      formData.append("notifications", notifications);
      formData.append("showOutOfStock", showOutOfStock);
      if (sellerData.photo instanceof File) {
        formData.append("photo", sellerData.photo);
      }

      await axios.put(`/seller/${sellerData.id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Pengaturan berhasil disimpan!");
      fetchSellerData(); // Refresh data setelah simpan
    } catch (err) {
      console.error("Error saving settings:", err);
      alert("Gagal menyimpan pengaturan. Silakan coba lagi.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="bg-white p-5 rounded-xl shadow-sm border border-gray-100"
    >
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-xl font-semibold text-gray-800 flex items-center">
          <FaCog className="mr-2 text-indigo-600" /> Pengaturan
        </h2>
        <div className="text-sm text-gray-500">Sesuaikan toko Anda</div>
      </div>

      {/* Tabs */}
      <div className="border-b mb-6">
        <div className="flex space-x-4">
          <button
            className={`pb-3 px-4 ${
              activeTab === "voucher"
                ? "border-b-2 border-indigo-500 text-indigo-600"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("voucher")}
          >
            <FaTicketAlt className="inline mr-2" /> Voucher Diskon
          </button>
          <button
            className={`pb-3 px-4 ${
              activeTab === "general"
                ? "border-b-2 border-indigo-500 text-indigo-600"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("general")}
          >
            <FaCog className="inline mr-2" /> Pengaturan Umum
          </button>
        </div>
      </div>

      {/* Voucher Tab */}
      {activeTab === "voucher" && (
        <div>
          <div className="flex justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-800">
              Manajemen Voucher
            </h3>
            <button
              className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 flex items-center shadow-md hover:shadow-lg transition-all duration-200"
              onClick={() => setShowForm(!showForm)}
            >
              <FaPlus className="mr-2" /> Buat Voucher Baru
            </button>
          </div>

          {/* Voucher Form */}
          {showForm && (
            <div className="bg-white p-6 rounded-xl shadow-sm mb-6 border border-gray-100">
              <h4 className="text-lg font-medium text-gray-800 mb-4">
                Buat Voucher Baru
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nama Voucher*
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={newVoucher.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    placeholder="Promo Musim Panas"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Kode Voucher*
                  </label>
                  <input
                    type="text"
                    name="code"
                    value={newVoucher.code}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    placeholder="SUMMER25"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Jenis Diskon*
                  </label>
                  <select
                    name="type"
                    value={newVoucher.type}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    required
                  >
                    <option value="PERSENTASE">Persentase (%)</option>
                    <option value="NOMINAL">Nominal (Rp)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {newVoucher.type === "PERSENTASE" ? "Diskon (%) *" : "Diskon (Rp) *"}
                  </label>
                  <input
                    type="number"
                    name="discount"
                    value={newVoucher.discount}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    min={0.01}
                    max={newVoucher.type === "PERSENTASE" ? 100 : undefined}
                    placeholder={newVoucher.type === "PERSENTASE" ? "25" : "50000"}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Minimal Pembelian (Rp)
                  </label>
                  <input
                    type="number"
                    name="minPurchase"
                    value={newVoucher.minPurchase}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    placeholder="0"
                    min={0}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tanggal Mulai*
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    value={newVoucher.startDate}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tanggal Berakhir*
                  </label>
                  <input
                    type="date"
                    name="expiryAt"
                    value={newVoucher.expiryAt}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    required
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-200"
                  onClick={() => setShowForm(false)}
                >
                  Batal
                </button>
                <button
                  type="button"
                  className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200"
                  onClick={addVoucher}
                >
                  Simpan Voucher
                </button>
              </div>
            </div>
          )}

          {/* Voucher List */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
            <table className="min-w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-700">
                    Kode
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-700">
                    Jenis
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-700">
                    Nilai
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-700">
                    Min. Belanja
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-700">
                    Periode
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-700">
                    Penggunaan
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-700">
                    Status
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-700">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(vouchers) && vouchers.length > 0 ? (
                  vouchers.map((voucher) => (
                    <tr
                      key={voucher.id}
                      className="border-b hover:bg-gray-50"
                    >
                      <td className="py-3 px-4 font-medium text-gray-800">
                        {voucher.code || "-"}
                      </td>
                      <td className="py-3 px-4 text-gray-600">
                        {voucher.type || "-"}
                      </td>
                      <td className="py-3 px-4 text-gray-600">
                        {voucher.type === "PERSENTASE"
                          ? `${Number(voucher.discount) || 0}%`
                          : `Rp ${(Number(voucher.discount) || 0).toLocaleString("id-ID")}`}
                      </td>
                      <td className="py-3 px-4 text-gray-600">
                        {(Number(voucher.minPurchase) || 0) > 0
                          ? `Rp ${Number(voucher.minPurchase).toLocaleString("id-ID")}`
                          : "-"}
                      </td>
                      <td className="py-3 px-4 text-gray-600">
                        {voucher.startDate
                          ? new Date(voucher.startDate).toLocaleDateString("id-ID", {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            })
                          : "-"}
                        {" "}s/d{" "}
                        {voucher.expiryAt
                          ? new Date(voucher.expiryAt).toLocaleDateString("id-ID", {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            })
                          : "-"}
                      </td>
                      <td className="py-3 px-4 text-gray-600">
                        {voucher.usageCount ?? 0}x
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            voucher.status
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {voucher.status ? "Aktif" : "Nonaktif"}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <button
                          className="text-yellow-500 hover:text-yellow-700 mr-3"
                          onClick={() => toggleVoucherStatus(voucher.id)}
                        >
                          {voucher.status ? "Nonaktifkan" : "Aktifkan"}
                        </button>
                        <button
                          className="text-red-500 hover:text-red-700"
                          onClick={() => deleteVoucher(voucher.id)}
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="text-center py-4 text-gray-500">
                      Tidak ada voucher yang tersedia.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* General Settings Tab */}
      {activeTab === "general" && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-6">
            Pengaturan Umum Toko
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-lg font-medium text-gray-800 mb-4">
                Informasi Toko
              </h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nama Toko*
                  </label>
                  <input
                    type="text"
                    name="storeName"
                    value={sellerData.storeName}
                    onChange={handleSellerInputChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    placeholder="Nama Toko Anda"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Alamat*
                  </label>
                  <textarea
                    name="address"
                    value={sellerData.address}
                    onChange={handleSellerInputChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    rows="3"
                    placeholder="Alamat lengkap toko"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Kota*
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={sellerData.city}
                    onChange={handleSellerInputChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    placeholder="Kota"
                    required
                  />
                </div>
              </div>
            </div>
            <div>
              <h4 className="text-lg font-medium text-gray-800 mb-4">
                Kontak & Foto
              </h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email*
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={sellerData.email}
                    onChange={handleSellerInputChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    placeholder="contact@tokoanda.com"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Telepon*
                  </label>
                  <input
                    type="text"
                    name="phoneNumber"
                    value={sellerData.phoneNumber}
                    onChange={handleSellerInputChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    placeholder="08123456789"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Foto Toko
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="mt-8 border-t pt-6">
            <h4 className="text-lg font-medium text-gray-800 mb-4">
              Pengaturan Lainnya
            </h4>
            <div className="flex items-center mb-4">
              <input
                type="checkbox"
                id="notifications"
                checked={notifications}
                onChange={(e) => setNotifications(e.target.checked)}
                className="mr-2 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="notifications" className="text-gray-700">
                Aktifkan notifikasi email untuk pesanan baru
              </label>
            </div>
            <div className="flex items-center mb-4">
              <input
                type="checkbox"
                id="inventory"
                checked={showOutOfStock}
                onChange={(e) => setShowOutOfStock(e.target.checked)}
                className="mr-2 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="inventory" className="text-gray-700">
                Tampilkan produk yang habis stok
              </label>
            </div>
          </div>
          <div className="mt-8 flex justify-end space-x-3">
            <button
              onClick={() => {
                fetchSellerData(); // Reset ke data awal
                setPhotoPreview(sellerData.photo || null);
              }}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-200"
            >
              Batal
            </button>
            <button
              onClick={handleSaveSettings}
              className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200"
            >
              Simpan Pengaturan
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default SettingsSection;