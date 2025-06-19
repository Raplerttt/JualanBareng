import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaClipboardList, FaCreditCard } from "react-icons/fa";
import toast from "react-hot-toast";
import Navbar from "../components/layout/NavbarComponents"
import Footer from "../components/layout/FooterComponents"

const OrderDetailsPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { orderId, orderDetails, selectedItems, paymentMethod, paymentStatus } = state || {};

  const paymentMethodLabels = {
    CASH: "Bayar di Tempat (COD)",
    BANK_CARD: "Kartu Kredit/Debit",
    BANK_TRANSFER: "Transfer Bank",
    E_WALLET: "E-Wallet (GoPay, OVO, dll.)",
  };

  if (!orderId || !orderDetails) {
    toast.error("Data pesanan tidak valid.");
    return (
      <>
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center bg-gray-100">
        <p className="text-red-600 text-lg">Tidak ada data pesanan ditemukan.</p>
        <button
          className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors"
          onClick={() => navigate("/orders")}
        >
          Kembali ke Pesanan
        </button>
      </div>
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
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white shadow-2xl rounded-2xl overflow-hidden p-8"
        >
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <FaClipboardList className="mr-2 h-6 w-6 text-indigo-600" />
            Detail Pesanan #{orderId}
          </h1>
          <div className="mt-6 text-left">
            <h2 className="text-base font-medium text-gray-900">Ringkasan Pesanan</h2>
            <p className="mt-2 text-sm text-gray-600">
              Alamat Pengiriman: {orderDetails?.deliveryAddress || "Tidak tersedia"}
            </p>
            <p className="mt-1 text-sm text-gray-600">
              Total: Rp {(orderDetails?.totalAmount || 0).toLocaleString("id-ID")}
            </p>
            <p className="mt-1 text-sm text-gray-600 flex items-center">
              <FaCreditCard className="mr-2 h-4 w-4 text-indigo-600" />
              Metode Pembayaran: {paymentMethod ? paymentMethodLabels[paymentMethod] : "Tidak diketahui"}
            </p>
            <p className="mt-1 text-sm text-gray-600">
              Status Pembayaran: {paymentStatus || "Menunggu konfirmasi"}
            </p>
            <div className="mt-4">
              <h3 className="text-sm font-medium text-gray-700">Item Pesanan:</h3>
              {orderItems.length > 0 ? (
                orderItems.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="mt-2 text-sm text-gray-600"
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
                <p className="mt-2 text-sm text-gray-600">Tidak ada item pesanan ditemukan.</p>
              )}
            </div>
          </div>
          <div className="mt-8 flex justify-end space-x-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors"
              onClick={() => navigate("/orders")}
            >
              Kembali ke Pesanan
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
    <Footer />
    </>
  );
};

export default OrderDetailsPage;