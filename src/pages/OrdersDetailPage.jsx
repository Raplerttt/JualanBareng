import React, { useState, useContext, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaClipboardList, FaCreditCard, FaExclamationTriangle, FaSpinner, FaCheck, FaInfoCircle } from "react-icons/fa";
import toast from "react-hot-toast";
import axios from "../../utils/axios";
import { AuthContext } from "../auth/authContext";
import Navbar from "../components/layout/NavbarComponents";
import Footer from "../components/layout/FooterComponents";

// Define enums
const SubjectType = {
  PRODUCT: "PRODUCT",
  SELLER: "SELLER",
  ORDER: "ORDER",
  APP: "APP",
};

const ReportType = {
  BUG: "BUG",
  FRAUD: "FRAUD",
  ABUSE: "ABUSE",
  OTHER: "OTHER",
};

const OrderDetailsPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useContext(AuthContext);
  const { orderId, orderDetails, selectedItems, paymentMethod, paymentStatus } = state || {};

  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportForm, setReportForm] = useState({
    reportType: ReportType.BUG,
    subjectType: SubjectType.ORDER,
    description: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const paymentMethodLabels = {
    CASH: "Bayar di Tempat (COD)",
    BANK_CARD: "Kartu Kredit/Debit",
    BANK_TRANSFER: "Transfer Bank",
    E_WALLET: "E-Wallet (GoPay, OVO, dll.)",
  };

  useEffect(() => {
    if (isReportModalOpen) {
      showInfoNotification(
        "Laporkan masalah dengan detail",
        "Jelaskan masalah Anda sejelas mungkin untuk membantu kami menindaklanjuti."
      );
    }
  }, [isReportModalOpen]);

  const showSuccessNotification = (title, message) => {
    toast.success(
      <div className="flex items-start">
        <div className="flex-shrink-0 pt-0.5">
          <FaCheck className="h-5 w-5 text-green-500" />
        </div>
        <div className="ml-3">
          <p className="text-sm font-medium text-gray-900">{title}</p>
          <p className="mt-1 text-sm text-gray-500">{message}</p>
        </div>
      </div>,
      {
        duration: 5000,
        style: {
          padding: '16px',
          minWidth: '350px',
          borderLeft: '4px solid #10B981',
          backgroundColor: '#F7FAFC',
        },
      }
    );
  };

  const showErrorNotification = (message) => {
    toast.error(
      <div className="flex items-start">
        <div className="flex-shrink-0 pt-0.5">
          <FaExclamationTriangle className="h-5 w-5 text-red-500" />
        </div>
        <div className="ml-3">
          <p className="text-sm font-medium text-gray-900">Terjadi Kesalahan</p>
          <p className="mt-1 text-sm text-gray-500">{message}</p>
        </div>
      </div>,
      {
        duration: 5000,
        style: {
          padding: '16px',
          minWidth: '350px',
          borderLeft: '4px solid #EF4444',
          backgroundColor: '#F7FAFC',
        },
      }
    );
  };

  const showInfoNotification = (title, message) => {
    toast(
      <div className="flex items-start">
        <div className="flex-shrink-0 pt-0.5">
          <FaInfoCircle className="h-5 w-5 text-blue-500" />
        </div>
        <div className="ml-3">
          <p className="text-sm font-medium text-gray-900">{title}</p>
          <p className="mt-1 text-sm text-gray-500">{message}</p>
        </div>
      </div>,
      {
        duration: 5000,
        style: {
          padding: '16px',
          minWidth: '350px',
          borderLeft: '4px solid #3B82F6',
          backgroundColor: '#F7FAFC',
        },
      }
    );
  };

  const handleReportChange = (e) => {
    const { name, value } = e.target;
    setReportForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleReportSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated || !user?.id) {
      showErrorNotification("Silakan login untuk mengirim laporan");
      navigate("/user/login");
      return;
    }

    if (!user.role || !["USER", "SELLER"].includes(user.role)) {
      showErrorNotification("Hanya USER atau SELLER yang dapat membuat laporan.");
      return;
    }

    if (!reportForm.reportType || !reportForm.subjectType || !reportForm.description) {
      showErrorNotification("Semua field laporan harus diisi.");
      return;
    }

    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("Admintoken");
      if (!token) {
        showErrorNotification("Token tidak ditemukan");
        navigate("/user/login");
        return;
      }

      const payload = {
        reportType: reportForm.reportType,
        subjectType: reportForm.subjectType,
        description: reportForm.description,
        ...(user.role === "USER" ? { userId: user.id } : { sellerId: user.id }),
      };

      await axios.post("/reports", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      showSuccessNotification(
        "Laporan berhasil dikirim!",
        "Tim kami akan meninjau laporan Anda segera."
      );
      
      setIsReportModalOpen(false);
      setReportForm({
        reportType: ReportType.BUG,
        subjectType: SubjectType.ORDER,
        description: "",
      });
    } catch (err) {
      showErrorNotification(err.response?.data?.message || err.message || "Gagal mengirim laporan");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!orderId || !orderDetails) {
    showErrorNotification("Data pesanan tidak valid.");
    return (
      <>
        <Navbar />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center bg-gray-100 min-h-screen flex items-center justify-center"
        >
          <div className="bg-white p-10 rounded-3xl shadow-xl text-center max-w-md">
            <p className="text-red-600 text-lg font-semibold mb-6">Tidak ada data pesanan ditemukan.</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-[#80CBC4] text-white rounded-full hover:bg-[#4BA8A0] transition-all text-base font-medium shadow-md"
              onClick={() => navigate("/orders")}
            >
              Kembali ke Pesanan
            </motion.button>
          </div>
        </motion.div>
        <Footer />
      </>
    );
  }

  const orderItems = Array.isArray(orderDetails.orderDetails) ? orderDetails.orderDetails : [];
  const productNameMap = Array.isArray(selectedItems)
    ? selectedItems.reduce((map, item) => {
        if (item?.Product?.id && item?.Product?.productName) {
          map[item.Product.id] = item.Product.productName;
        }
        return map;
      }, {})
    : {};

  return (
    <>
      <Navbar />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7 }}
        className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center"
      >
        <div className="max-w-5xl w-full mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-[#80CBC4] p-10 text-white relative">
            <div className="flex justify-between items-center">
              <h1 className="text-4xl font-extrabold tracking-tight flex items-center">
                <FaClipboardList className="mr-3 h-8 w-8" />
                Detail Pesanan #{orderId}
              </h1>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-white text-[#80CBC4] rounded-full font-medium text-base hover:bg-gray-100 transition-all shadow-md"
                onClick={() => navigate("/orders")}
              >
                Kembali ke Pesanan
              </motion.button>
            </div>
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-[#4BA8A0] to-transparent" />
          </div>

          {/* Main Content */}
          <div className="p-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-xl font-semibold text-gray-800">Ringkasan Pesanan</h2>
              <div className="mt-4 space-y-3 text-base text-gray-600">
                <p>Alamat Pengiriman: {orderDetails?.deliveryAddress || "Tidak tersedia"}</p>
                <p>Total: Rp {(orderDetails?.totalAmount || 0).toLocaleString("id-ID")}</p>
                <p className="flex items-center">
                  <FaCreditCard className="mr-2 h-5 w-5 text-[#80CBC4]" />
                  Metode Pembayaran: {paymentMethod ? paymentMethodLabels[paymentMethod] : "Tidak diketahui"}
                </p>
                <p>Status Pembayaran: {paymentStatus || "Menunggu konfirmasi"}</p>
              </div>
              <div className="mt-6">
                <h3 className="text-base font-semibold text-gray-700">Item Pesanan:</h3>
                {orderItems.length > 0 ? (
                  orderItems.map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="mt-3 text-base text-gray-600 bg-gray-50 p-4 rounded-2xl shadow-sm"
                    >
                      <p>
                        Nama Produk:{" "}
                        {productNameMap[item?.productId] ||
                          item?.product?.productName ||
                          `Produk ID: ${item?.productId || "Tidak diketahui"}`}{" "}
                        (x{item?.quantity || 0})
                      </p>
                    </motion.div>
                  ))
                ) : (
                  <p className="mt-3 text-base text-gray-600">Tidak ada item pesanan ditemukan.</p>
                )}
              </div>
              <div className="mt-8 flex justify-end">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-3 bg-red-600 text-white rounded-full hover:bg-red-700 transition-all flex items-center text-base font-medium shadow-md"
                  onClick={() => setIsReportModalOpen(true)}
                >
                  <FaExclamationTriangle className="mr-2 h-5 w-5" />
                  Laporkan Masalah
                </motion.button>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Report Modal */}
      <AnimatePresence>
        {isReportModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              className="bg-white rounded-3xl p-8 w-full max-w-lg shadow-2xl"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Buat Laporan</h2>
                <button
                  onClick={() => setIsReportModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <form onSubmit={handleReportSubmit}>
                <div className="space-y-6">
                  <div>
                    <label htmlFor="reportType" className="block text-sm font-semibold text-gray-700 mb-2">
                      Jenis Laporan
                    </label>
                    <select
                      id="reportType"
                      name="reportType"
                      value={reportForm.reportType}
                      onChange={handleReportChange}
                      className="block w-full py-3 px-4 border border-gray-200 rounded-2xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#80CBC4] text-base shadow-sm transition-all"
                      required
                    >
                      <option value={ReportType.BUG}>Bug/Error</option>
                      <option value={ReportType.FRAUD}>Penipuan</option>
                      <option value={ReportType.ABUSE}>Penyalahgunaan</option>
                      <option value={ReportType.OTHER}>Lainnya</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="subjectType" className="block text-sm font-semibold text-gray-700 mb-2">
                      Subjek Laporan
                    </label>
                    <select
                      id="subjectType"
                      name="subjectType"
                      value={reportForm.subjectType}
                      onChange={handleReportChange}
                      className="block w-full py-3 px-4 border border-gray-200 rounded-2xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#80CBC4] text-base shadow-sm transition-all"
                      required
                    >
                      <option value={SubjectType.ORDER}>Pesanan Ini</option>
                      <option value={SubjectType.PRODUCT}>Produk</option>
                      <option value={SubjectType.SELLER}>Penjual</option>
                      <option value={SubjectType.APP}>Aplikasi</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-2">
                      Deskripsi Laporan
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={reportForm.description}
                      onChange={handleReportChange}
                      className="block w-full py-3 px-4 border border-gray-200 rounded-2xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#80CBC4] text-base shadow-sm transition-all"
                      rows="5"
                      placeholder="Jelaskan masalah yang Anda temui secara detail"
                      required
                    />
                  </div>
                </div>
                <div className="mt-8 flex justify-end space-x-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    onClick={() => setIsReportModalOpen(false)}
                    className="px-6 py-3 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 transition-all text-base font-medium shadow-md"
                  >
                    Batal
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    disabled={isSubmitting}
                    className={`px-6 py-3 bg-[#80CBC4] text-white rounded-full hover:bg-[#4BA8A0] transition-all flex items-center text-base font-medium shadow-md ${
                      isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <FaSpinner className="mr-2 h-5 w-5 animate-spin" />
                        Mengirim...
                      </>
                    ) : (
                      "Kirim Laporan"
                    )}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <Footer />
    </>
  );
};

export default OrderDetailsPage;