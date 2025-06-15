import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaClipboardList, FaCreditCard, FaSpinner } from "react-icons/fa";
import { AuthContext } from "../auth/authContext";
import axios from "../../utils/axios";
import toast from "react-hot-toast";

const OrdersPage = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("pending");

  useEffect(() => {
    if (!user) {
      toast.error("Silakan login untuk melihat pesanan");
      navigate("/user/login");
      return;
    }

    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("/orders", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(response.data.data || []);
        setLoading(false);
      } catch (err) {
        console.error("Gagal mengambil pesanan:", err);
        setError(err.response?.data?.message || "Gagal memuat pesanan");
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user, navigate]);

  // Filter pesanan berdasarkan status
  const filteredOrders = orders.filter((order) => {
    const paymentStatus = order.payments?.[0]?.status || "PENDING";
    const orderStatus = order.status;

    if (activeTab === "pending") {
      return paymentStatus === "PENDING" && orderStatus === "PENDING";
    } else if (activeTab === "completed") {
      return paymentStatus === "SUCCESS" || orderStatus === "PAID";
    } else if (activeTab === "cancelled") {
      return paymentStatus === "FAILED" || orderStatus === "CANCELLED";
    }
    return false;
  });

  // Handler untuk memulai pembayaran ulang
  const handlePayNow = async (orderId, paymentMethod) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `/payment/snap-token/${orderId}`,
        { paymentMethod },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (paymentMethod === "CASH") {
        toast.success("Pesanan dengan COD dikonfirmasi ulang.");
        navigate("/order-confirmation", {
          state: {
            orderId,
            orderDetails: orders.find((o) => o.id === orderId),
            paymentMethod,
            paymentStatus: "PENDING",
          },
        });
        return;
      }

      if (!window.snap) {
        throw new Error("Snap.js belum dimuat. Silakan refresh halaman.");
      }

      window.snap.pay(response.data.token, {
        onSuccess: () => {
          toast.success("Pembayaran berhasil!");
          setOrders((prev) =>
            prev.map((o) =>
              o.id === orderId
                ? { ...o, payments: [{ ...o.payments[0], status: "SUCCESS" }], status: "PAID" }
                : o
            )
          );
        },
        onPending: () => {
          toast("Pembayaran tertunda. Silakan selesaikan pembayaran.");
        },
        onError: (result) => {
          toast.error("Pembayaran gagal. Silakan coba lagi.");
          console.error("Payment error:", result);
        },
        onClose: () => {
          toast.error("Popup pembayaran ditutup. Silakan selesaikan pembayaran.");
        },
      });
    } catch (err) {
      console.error("Gagal memulai pembayaran:", err);
      toast.error(err.message || "Gagal memulai pembayaran");
    }
  };

  // Handler untuk melihat detail pesanan
  const handleViewDetails = (order) => {
    navigate(`/order/${order.id}`, {
      state: {
        orderId: order.id,
        orderDetails: order,
        selectedItems: order.orderDetails.map((item) => ({
          Product: { id: item.productId, productName: item.product?.productName },
          quantity: item.quantity,
        })),
        paymentMethod: order.payments?.[0]?.method,
        paymentStatus: order.payments?.[0]?.status,
      },
    });
  };

  // Pemetaan metode pembayaran ke label
  const paymentMethodLabels = {
    CASH: "Bayar di Tempat (COD)",
    BANK_CARD: "Kartu Kredit/Debit",
    BANK_TRANSFER: "Transfer Bank",
    E_WALLET: "E-Wallet (GoPay, OVO, dll.)",
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}>
          <FaSpinner className="text-indigo-600 text-4xl" />
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center bg-gray-100">
        <p className="text-red-600 text-lg">{error}</p>
        <button
          className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors"
          onClick={() => navigate("/")}
        >
          Kembali ke Beranda
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 text-center"
        >
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl flex items-center justify-center">
            <FaClipboardList className="mr-2 h-8 w-8 text-indigo-600" />
            Pesanan Anda
          </h1>
          <p className="mt-2 text-sm text-gray-600">Lihat riwayat dan status pesanan Anda</p>
        </motion.header>

        {/* Tab Navigation */}
        <div className="bg-white shadow rounded-lg mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-4" aria-label="Tabs">
              {[
                { name: "Menunggu Pembayaran", id: "pending", count: orders.filter((o) => o.payments?.[0]?.status === "PENDING" && o.status === "PENDING").length },
                { name: "Selesai", id: "completed", count: orders.filter((o) => o.payments?.[0]?.status === "SUCCESS" || o.status === "PAID").length },
                { name: "Dibatalkan", id: "cancelled", count: orders.filter((o) => o.payments?.[0]?.status === "FAILED" || o.status === "CANCELLED").length },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`${
                    activeTab === tab.id
                      ? "border-indigo-500 text-indigo-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
                >
                  {tab.name}
                  {tab.count > 0 && (
                    <span className="ml-2 bg-indigo-100 text-indigo-600 text-xs font-semibold rounded-full px-2 py-1">
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Daftar Pesanan */}
        <AnimatePresence>
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            {filteredOrders.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg shadow">
                <p className="text-gray-600">Tidak ada pesanan di kategori ini.</p>
              </div>
            ) : (
              filteredOrders.map((order, index) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="bg-white shadow rounded-lg p-6"
                >
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Pesanan #{order.id}</h3>
                    <span
                      className={`text-sm font-medium px-3 py-1 rounded-full ${
                        activeTab === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : activeTab === "completed"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {activeTab === "pending" ? "Menunggu Pembayaran" : activeTab === "completed" ? "Selesai" : "Dibatalkan"}
                    </span>
                  </div>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p>Total: Rp {order.totalAmount.toLocaleString("id-ID")}</p>
                    <p className="flex items-center">
                      <FaCreditCard className="mr-2 h-4 w-4 text-indigo-600" />
                      Metode Pembayaran: {paymentMethodLabels[order.payments?.[0]?.method] || "Tidak diketahui"}
                    </p>
                    <p>Alamat Pengiriman: {order.deliveryAddress || "Tidak tersedia"}</p>
                    <p>Tanggal Pesanan: {new Date(order.createdAt).toLocaleDateString("id-ID")}</p>
                  </div>
                  <div className="mt-4 flex justify-end space-x-4">
                    {activeTab === "pending" && order.payments?.[0]?.method !== "CASH" && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors"
                        onClick={() => handlePayNow(order.id, order.payments?.[0]?.method)}
                      >
                        Bayar Sekarang
                      </motion.button>
                    )}
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-4 py-2 border border-gray-300 rounded-full text-gray-700 hover:bg-gray-100 transition-colors"
                      onClick={() => handleViewDetails(order)}
                    >
                      Lihat Detail
                    </motion.button>
                  </div>
                </motion.div>
              ))
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default OrdersPage;