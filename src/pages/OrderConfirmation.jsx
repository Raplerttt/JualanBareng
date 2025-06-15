import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaCheckCircle, FaCreditCard, FaTimesCircle, FaHourglassHalf, FaSpinner } from 'react-icons/fa';
import toast from 'react-hot-toast';
import axios from '../../utils/axios';

const OrderConfirmation = () => {
  const navigate = useNavigate();
  const { search, state } = useLocation();

  // Ambil query params dari URL (untuk redirect Midtrans)
  const query = new URLSearchParams(search);
  const queryOrderId = query.get('order_id');
  const queryStatus = query.get('transaction_status') || query.get('status') || '';

  // Ambil data dari state (jika tersedia)
  const {
    orderId: stateOrderId,
    orderDetails: stateOrderDetails,
    paymentMethod: statePaymentMethod,
    paymentStatus: statePaymentStatus,
  } = state || {};

  // State untuk data pesanan
  const [orderId, setOrderId] = useState(stateOrderId || (queryOrderId ? parseInt(queryOrderId.split('-')[1], 10) : null));
  const [orderDetails, setOrderDetails] = useState(stateOrderDetails || null);
  const [paymentMethod, setPaymentMethod] = useState(statePaymentMethod || '');
  const [paymentStatus, setPaymentStatus] = useState(statePaymentStatus || queryStatus || 'PENDING');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Ambil detail pesanan dan status pembayaran dari backend
  useEffect(() => {
    if (!orderId) {
      setError('ID pesanan tidak valid.');
      setLoading(false);
      return;
    }

    const fetchOrderData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Silakan login untuk melihat pesanan.');
        }

        // Ambil detail pesanan
        const orderRes = await axios.get(`/orders/${orderId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const orderData = orderRes.data.data || orderRes.data;
        if (!orderData) {
          throw new Error('Data pesanan tidak ditemukan.');
        }

        // Debug: Log the response to verify orderDetails
        console.log('Order Data:', orderData);

        setOrderDetails(orderData);
        setPaymentMethod(orderData.payments?.[0]?.method || '');

        // Ambil status pembayaran
        if (orderData.payments?.[0]?.method !== 'CASH') {
          try {
            const paymentRes = await axios.get(`/payment/order/${orderId}`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            setPaymentStatus(paymentRes.data.status || 'PENDING');
          } catch (paymentErr) {
            console.warn('Payment endpoint error:', paymentErr.message);
            setPaymentStatus(orderData.payments?.[0]?.status || 'PENDING');
          }
        } else {
          setPaymentStatus(orderData.payments?.[0]?.status || 'PENDING');
        }

        setLoading(false);
      } catch (err) {
        console.error('Gagal mengambil data pesanan:', {
          message: err.message,
          response: err.response?.data,
          status: err.response?.status,
        });
        setError(err.response?.data?.message || err.message || 'Gagal memuat data pesanan.');
        setLoading(false);
        toast.error('Gagal memuat data pesanan.');
      }
    };

    fetchOrderData();
  }, [orderId]);

  // Handler untuk retry pengambilan data
  const handleRetry = () => {
    setLoading(true);
    setError(null);
    setOrderId(orderId); // Trigger ulang useEffect
  };

  // Pemetaan metode pembayaran ke label
  const paymentMethodLabels = {
    CASH: 'Bayar di Tempat (COD)',
    BANK_CARD: 'Kartu Kredit/Debit',
    BANK_TRANSFER: 'Transfer Bank',
    E_WALLET: 'E-Wallet (GoPay, OVO, dll.)',
  };

  // Pemetaan status pembayaran ke visual
  const getStatusVisuals = (status) => {
    const normalizedStatus = status?.toUpperCase() || 'UNKNOWN';
    switch (normalizedStatus) {
      case 'SUCCESS':
      case 'SETTLEMENT':
      case 'CAPTURE':
        return {
          icon: <FaCheckCircle className="mx-auto h-12 w-12 text-green-600" />,
          title: 'Pembayaran Berhasil!',
          description: 'Terima kasih, pembayaran Anda telah diterima.',
          bgClass: 'bg-green-100',
          borderClass: 'border-green-500',
        };
      case 'PENDING':
        return {
          icon: <FaHourglassHalf className="mx-auto h-12 w-12 text-yellow-500" />,
          title: 'Menunggu Pembayaran',
          description: 'Pembayaran Anda belum selesai, mohon selesaikan segera.',
          bgClass: 'bg-yellow-100',
          borderClass: 'border-yellow-500',
        };
      case 'CANCEL':
      case 'EXPIRE':
      case 'DENY':
      case 'FAILED':
        return {
          icon: <FaTimesCircle className="mx-auto h-12 w-12 text-red-600" />,
          title: 'Pembayaran Gagal',
          description: 'Transaksi gagal, silakan coba metode lain.',
          bgClass: 'bg-red-100',
          borderClass: 'border-red-500',
        };
      default:
        return {
          icon: <FaHourglassHalf className="mx-auto h-12 w-12 text-gray-500" />,
          title: 'Status Tidak Diketahui',
          description: 'Mohon hubungi admin untuk informasi lebih lanjut.',
          bgClass: 'bg-gray-100',
          borderClass: 'border-gray-500',
        };
    }
  };

  // Pastikan orderItems adalah array
  const orderItems = Array.isArray(orderDetails?.orderDetails) ? orderDetails.orderDetails : [];

  // Format tanggal
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('id-ID', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}>
          <FaSpinner className="text-indigo-600 text-5xl" />
        </motion.div>
      </div>
    );
  }

  if (error || !orderDetails) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center bg-gray-50">
        <FaTimesCircle className="mx-auto h-16 w-16 text-red-600" />
        <p className="mt-4 text-red-600 text-lg font-medium">{error || 'Tidak ada data pesanan ditemukan.'}</p>
        <div className="mt-6 flex justify-center space-x-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
            onClick={handleRetry}
          >
            Coba Lagi
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-100 transition-colors"
            onClick={() => navigate('/')}
          >
            Kembali ke Beranda
          </motion.button>
        </div>
      </div>
    );
  }

  const statusVisuals = getStatusVisuals(paymentStatus);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white shadow-xl rounded-xl overflow-hidden"
        >
          {/* Header */}
          <div className={`p-6 ${statusVisuals.bgClass} border-b-4 ${statusVisuals.borderClass}`}>
            <div className="flex items-center justify-center">
              <div className="ml-4 text-center">
              {statusVisuals.icon}
                <h1 className="text-2xl mt-8 font-bold text-gray-900">{statusVisuals.title}</h1>
                <p className="mt-1 text-sm text-gray-600">{statusVisuals.description}</p>
              </div>
            </div>
          </div>

          {/* Invoice Content */}
          <div className="p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Invoice #{orderId}</h2>
              <p className="text-sm text-gray-500">
                Tanggal: {formatDate(orderDetails.createdAt) || 'Tidak tersedia'}
              </p>
            </div>

            {/* Order Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <h3 className="text-sm font-medium text-gray-700">Informasi Pemesan</h3>
                <p className="mt-2 text-sm text-gray-600">{orderDetails.user?.fullName || 'Tidak tersedia'}</p>
                <p className="text-sm text-gray-600">{orderDetails.user?.email || 'Tidak tersedia'}</p>
                <p className="text-sm text-gray-600">{orderDetails.user?.phoneNumber || 'Tidak tersedia'}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-700">Alamat Pengiriman</h3>
                <p className="mt-2 text-sm text-gray-600">{orderDetails.deliveryAddress || 'Tidak tersedia'}</p>
                {orderDetails.deliveryNotes && (
                  <p className="text-sm text-gray-600">Catatan: {orderDetails.deliveryNotes}</p>
                )}
              </div>
            </div>

            {/* Seller Information */}
            <div className="mb-8">
              <h3 className="text-sm font-medium text-gray-700">Penjual</h3>
              <p className="mt-2 text-sm text-gray-600">{orderDetails.seller?.storeName || 'Tidak tersedia'}</p>
              <p className="text-sm text-gray-600">{orderDetails.seller?.address || 'Tidak tersedia'}, {orderDetails.seller?.city}</p>
            </div>

            {/* Order Items Table */}
            <div className="mb-8">
              <h3 className="text-sm font-medium text-gray-700 mb-4">Detail Pesanan</h3>
              {orderItems.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left text-gray-600">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                      <tr>
                        <th scope="col" className="px-6 py-3">Produk</th>
                        <th scope="col" className="px-6 py-3">Kuantitas</th>
                        <th scope="col" className="px-6 py-3">Harga Sat Periodic</th>
                        <th scope="col" className="px-6 py-3">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orderItems.map((item, index) => (
                        <motion.tr
                          key={index}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                          className="border-b"
                        >
                          <td className="px-6 py-4">{item?.product?.productName || 'Nama produk tidak tersedia'}</td>
                          <td className="px-6 py-4">{item?.quantity || 0}</td>
                          <td className="px-6 py-4">Rp {(item?.product?.price || 0).toLocaleString('id-ID')}</td>
                          <td className="px-6 py-4">Rp {(item?.subtotal || 0).toLocaleString('id-ID')}</td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-sm text-gray-600">Tidak ada item pesanan ditemukan.</p>
              )}
            </div>

            {/* Payment Summary */}
            <div className="border-t pt-6">
              <h3 className="text-sm font-medium text-gray-700 mb-4">Ringkasan Pembayaran</h3>
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Metode Pembayaran:</span>
                <span className="flex items-center">
                  <FaCreditCard className="mr-2 h-4 w-4 text-indigo-600" />
                  {paymentMethod ? paymentMethodLabels[paymentMethod] : 'Tidak diketahui'}
                </span>
              </div>
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Status Pembayaran:</span>
                <span>{paymentStatus || 'Menunggu konfirmasi'}</span>
              </div>
              <div className="flex justify-between text-base font-semibold text-gray-900 mt-4">
                <span>Total:</span>
                <span>Rp {(orderDetails?.totalAmount || 0).toLocaleString('id-ID')}</span>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="bg-gray-50 p-6 flex justify-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
              onClick={() => navigate('/')}
            >
              Lanjut Belanja
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-100 transition-colors"
              onClick={() => navigate('/orders')}
            >
              Lihat Pesanan
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default OrderConfirmation;