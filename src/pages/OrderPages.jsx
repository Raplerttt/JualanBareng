import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaClipboardList, FaCreditCard, FaSpinner, FaStar, FaTimes, FaBan, FaCheckCircle } from 'react-icons/fa';
import { AuthContext } from '../auth/authContext';
import axios from '../../utils/axios';
import toast from 'react-hot-toast';
import Navbar from '../components/layout/NavbarComponents';
import Footer from '../components/layout/FooterComponents';

const OrdersPage = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('pending');
  const [feedbackModal, setFeedbackModal] = useState(null);
  const [successModal, setSuccessModal] = useState(false);
  const [ratings, setRatings] = useState({});
  const [comments, setComments] = useState({});

  useEffect(() => {
    if (!user) {
      toast.error('Silakan login untuk melihat pesanan');
      navigate('/user/login');
      return;
    }

    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('Admintoken');
        const response = await axios.get('/orders', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(response.data.data || []);
      } catch (err) {
        console.error('Gagal mengambil pesanan:', err);
        setError(err.response?.data?.message || 'Gagal memuat pesanan. Silakan coba lagi nanti.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user, navigate]);

  const handlePayNow = async (orderId, paymentMethod) => {
    try {
      const token = localStorage.getItem('Admintoken');
      const response = await axios.post(
        `/payment/snap-token/${orderId}`,
        { paymentMethod },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      if (paymentMethod === 'CASH') {
        toast.success('Pesanan dengan COD dikonfirmasi ulang.');
        navigate('/order-confirmation', {
          state: {
            orderId,
            orderDetails: orders.find((o) => o.id === orderId),
            paymentMethod,
            paymentStatus: 'PENDING',
          },
        });
        return;
      }

      if (!window.snap) {
        throw new Error('Snap.js belum dimuat. Silakan refresh halaman.');
      }

      window.snap.pay(response.data.token, {
        onSuccess: async (result) => {
          toast.success('Pembayaran berhasil!');
          try {
            await axios.patch(
              `/payment/update-status/${orderId}`,
              { status: 'COMPLETED' },
              { headers: { Authorization: `Bearer ${token}` } },
            );

            setOrders((prev) =>
              prev.map((o) =>
                o.id === orderId
                  ? {
                      ...o,
                      payments: [{ ...o.payments?.[0], status: 'COMPLETED' }],
                      status: 'DIPROSES',
                    }
                  : o,
              ),
            );
          } catch (error) {
            console.error('Gagal update status setelah sukses bayar:', error);
            toast.error('Gagal memperbarui status pembayaran. Silakan hubungi dukungan.');
          }
        },
        onPending: () => toast('Pembayaran tertunda. Silakan selesaikan pembayaran.'),
        onError: (result) => {
          toast.error('Pembayaran gagal. Silakan coba lagi.');
          console.error('Payment error:', result);
        },
        onClose: () => toast.error('Popup pembayaran ditutup. Silakan selesaikan pembayaran.'),
      });
    } catch (err) {
      console.error('Gagal memulai pembayaran:', err);
      toast.error(err.message || 'Gagal memulai pembayaran. Silakan coba lagi.');
    }
  };

  const handleConfirmReceived = async (orderId) => {
    try {
      const token = localStorage.getItem('Admintoken');
      await axios.patch(
        `/orders/${orderId}`,
        { status: 'SELESAI' },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      toast.success('Pesanan berhasil dikonfirmasi sebagai selesai!');
      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderId ? { ...o, status: 'SELESAI' } : o,
        ),
      );
    } catch (err) {
      console.error('Gagal mengkonfirmasi pesanan selesai:', err);
      toast.error(err.response?.data?.message || 'Gagal mengkonfirmasi pesanan selesai.');
    }
  };

  const handleCancelOrder = async (orderId) => {
    try {
      const token = localStorage.getItem('Admintoken');
      await axios.patch(
        `/orders/${orderId}`,
        { status: 'DIBATALKAN' },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      toast.success('Pesanan berhasil Vince');
      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderId
            ? {
                ...o,
                status: 'DIBATALKAN',
                payments: o.payments?.length ? [{ ...o.payments[0], status: 'DIBATALKAN' }] : [],
              }
            : o,
        ),
      );
    } catch (err) {
      console.error('Gagal membatalkan pesanan:', err);
      toast.error(err.response?.data?.message || 'Gagal membatalkan pesanan.');
    }
  };

  const handleViewDetails = (order) => {
    navigate(`/order/${order.id}`, {
      state: {
        orderId: order.id,
        orderDetails: order,
        selectedItems: (order.orderDetails || []).map((item) => ({
          Product: { id: item.productId, productName: item.product?.productName || 'Produk tidak tersedia' },
          quantity: item.quantity,
        })),
        paymentMethod: order.payments?.[0]?.method || 'Tidak diketahui',
        paymentStatus: order.payments?.[0]?.status || 'Tidak diketahui',
      },
    });
  };

  const handleOpenFeedbackModal = (orderId, productId, sellerId, productName) => {
    setFeedbackModal({ orderId, productId, sellerId, productName: productName || 'Produk tidak tersedia' });
    setRatings((prev) => ({ ...prev, [productId]: prev[productId] || 0 }));
    setComments((prev) => ({ ...prev, [productId]: prev[productId] || '' }));
  };

  const handleSubmitFeedback = async (orderId, productId, sellerId) => {
    const rating = ratings[productId] || 0;
    const comment = comments[productId] || '';

    if (rating === 0) {
      toast.error('Silakan pilih rating sebelum mengirim feedback.');
      return;
    }

    try {
      const token = localStorage.getItem('Admintoken');
      const response = await axios.post(
        '/feedbacks',
        {
          userId: user.id,
          orderId,
          productId,
          sellerId,
          rating,
          comment,
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      if (response.status === 200 || response.status === 201) {
        toast.success('Feedback berhasil dikirim!');
        setFeedbackModal(null);
        setSuccessModal(true);
        setOrders((prev) =>
          prev.map((o) =>
            o.id === orderId
              ? {
                  ...o,
                  orderDetails: (o.orderDetails || []).map((item) =>
                    item.productId === productId ? { ...item, hasFeedback: true } : item,
                  ),
                }
              : o,
          ),
        );
      }
    } catch (err) {
      console.error('Gagal mengirim feedback:', err);
      toast.error(err.response?.data?.message || 'Gagal mengirim feedback.');
    }
  };

  const filteredOrders = orders.filter((order) => {
    const orderStatus = order.status || 'PENDING';
    const paymentStatus = order.payments?.[0]?.status || 'PENDING';

    if (activeTab === 'pending') {
      return orderStatus === 'PENDING' && paymentStatus === 'PENDING';
    }
    if (activeTab === 'inprogress') {
      return orderStatus === 'DIPROSES' || orderStatus === 'DIKIRIM';
    }
    if (activeTab === 'completed') {
      return orderStatus === 'SELESAI' && paymentStatus === 'COMPLETED';
    }
    if (activeTab === 'cancelled') {
      return orderStatus === 'DIBATALKAN' || paymentStatus === 'DIBATALKAN';
    }
    return false;
  });

  const paymentMethodLabels = {
    CASH: 'Bayar di Tempat (COD)',
    BANK_CARD: 'Kartu Kredit/Debit',
    BANK_TRANSFER: 'Transfer Bank',
    E_WALLET: 'E-Wallet (GoPay, OVO, dll.)',
  };

  const orderStatusLabels = {
    PENDING: 'Menunggu Pembayaran',
    DIPROSES: 'Diproses',
    DIKIRIM: 'Dikirim',
    SELESAI: 'Selesai',
    DIBATALKAN: 'Dibatalkan',
  };

  const formatDate = (dateString) =>
    dateString
      ? new Date(dateString).toLocaleString('id-ID', {
          day: '2-digit',
          month: 'long',
          year: 'numeric',
        })
      : 'Tanggal tidak tersedia';

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="flex justify-center items-center h-screen bg-gray-50">
          <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}>
            <FaSpinner className="text-indigo-600 text-5xl" />
          </motion.div>
        </div>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center bg-gray-50">
          <p className="text-red-600 text-lg font-medium">{error}</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="mt-6 px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
            onClick={() => navigate('/')}
          >
            Kembali ke Beranda
          </motion.button>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
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
            <p className="mt-2 text-sm text-gray-600">Pantau status dan riwayat pesanan Anda</p>
          </motion.header>

          <div className="bg-white shadow rounded-lg mb-6">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-4 sm:space-x-8 px-4" aria-label="Tabs">
                {[
                  {
                    name: 'Menunggu Pembayaran',
                    id: 'pending',
                    count: orders.filter((o) => o.status === 'PENDING' && o.payments?.[0]?.status === 'PENDING').length,
                  },
                  {
                    name: 'Dalam Proses',
                    id: 'inprogress',
                    count: orders.filter((o) => o.status === 'DIPROSES' || o.status === 'DIKIRIM').length,
                  },
                  {
                    name: 'Selesai',
                    id: 'completed',
                    count: orders.filter((o) => o.status === 'SELESAI' && o.payments?.[0]?.status === 'COMPLETED').length,
                  },
                  {
                    name: 'Dibatalkan',
                    id: 'cancelled',
                    count: orders.filter(
                      (o) => o.status === 'DIBATALKAN' || o.payments?.[0]?.status === 'DIBATALKAN',
                    ).length,
                  },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`${
                      activeTab === tab.id
                        ? 'border-indigo-500 text-indigo-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
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

          <AnimatePresence>
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {filteredOrders.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg shadow">
                  <p className="text-gray-600 text-sm">Tidak ada pesanan di kategori ini.</p>
                </div>
              ) : (
                filteredOrders.map((order, index) => (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="bg-white shadow-xl rounded-lg p-6"
                  >
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">Pesanan #{order.id}</h3>
                      <span
                        className={`text-sm font-medium px-3 py-1 rounded-full ${
                          order.status === 'PENDING'
                            ? 'bg-yellow-100 text-yellow-800'
                            : order.status === 'DIPROSES'
                            ? 'bg-blue-100 text-blue-800'
                            : order.status === 'DIKIRIM'
                            ? 'bg-purple-100 text-purple-800'
                            : order.status === 'SELESAI'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {orderStatusLabels[order.status] || 'Tidak Diketahui'}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-600 mb-4">
                      <div>
                        <p>
                          <span className="font-medium">Tanggal Pesanan:</span> {formatDate(order.createdAt)}
                        </p>
                        <p>
                          <span className="font-medium">Total:</span> Rp{' '}
                          {(order.totalAmount || 0).toLocaleString('id-ID')}
                        </p>
                        <p className="flex items-center">
                          <FaCreditCard className="mr-2 h-4 w-4 text-indigo-600" />
                          <span className="font-medium">Metode Pembayaran:</span>{' '}
                          {paymentMethodLabels[order.payments?.[0]?.method] || 'Tidak diketahui'}
                        </p>
                      </div>
                      <div>
                        <p>
                          <span className="font-medium">Alamat Pengiriman:</span>{' '}
                          {order.deliveryAddress || 'Tidak tersedia'}
                        </p>
                        <p>
                          <span className="font-medium">Penjual:</span> {order.seller?.storeName || 'Tidak tersedia'}
                        </p>
                      </div>
                    </div>
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Item Pesanan:</h4>
                      {(order.orderDetails || []).length > 0 ? (
                        <ul className="text-sm text-gray-600 space-y-1">
                          {order.orderDetails.map((item, idx) => (
                            <li key={idx} className="flex justify-between items-center">
                              <span>
                                {item.product?.productName || 'Produk tidak tersedia'} (x{item.quantity || 0}) - Rp{' '}
                                {(item.subtotal || 0).toLocaleString('id-ID')}
                              </span>
                              {activeTab === 'completed' && !item.hasFeedback && order.status === 'SELESAI' && (
                                <motion.button
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  className="px-3 py-1 bg-green-600 text-white rounded-lg text-xs font-medium hover:bg-green-700 transition-colors"
                                  onClick={() =>
                                    handleOpenFeedbackModal(
                                      order.id,
                                      item.productId,
                                      order.sellerId,
                                      item.product?.productName,
                                    )
                                  }
                                >
                                  Beri Feedback
                                </motion.button>
                              )}
                              {activeTab === 'completed' && item.hasFeedback && (
                                <span className="text-green-600 text-xs font-medium">Feedback telah diberikan</span>
                              )}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-sm text-gray-600">Tidak ada item pesanan.</p>
                      )}
                    </div>
                    <div className="flex justify-end space-x-4">
                      {order.status === 'PENDING' && order.payments?.[0]?.status === 'PENDING' && (
                        <>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
                            onClick={() => handlePayNow(order.id, order.payments?.[0]?.method)}
                          >
                            {order.payments?.[0]?.method === 'CASH' ? 'Konfirmasi COD' : 'Bayar Sekarang'}
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg font-semibold flex items-center gap-2 hover:bg-red-700 transition-colors"
                            onClick={() => handleCancelOrder(order.id)}
                          >
                            <FaBan className="text-sm" />
                            Batalkan Pesanan
                          </motion.button>
                        </>
                      )}
                      {order.status === 'DIKIRIM' && order.payments?.[0]?.status === 'COMPLETED' && (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg font-semibold flex items-center gap-2 hover:bg-green-700 transition-colors"
                          onClick={() => handleConfirmReceived(order.id)}
                        >
                          <FaCheckCircle className="text-sm" />
                          Diterima
                        </motion.button>
                      )}
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
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

          {feedbackModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="bg-white rounded-2xl p-8 w-full max-w-md relative shadow-2xl"
              >
                <button
                  className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 transition-colors"
                  onClick={() => setFeedbackModal(null)}
                >
                  <FaTimes className="h-6 w-6" />
                </button>
                <h3 className="text-xl font-bold text-gray-900 mb-6">
                  Beri Feedback untuk {feedbackModal.productName}
                </h3>
                <div className="flex justify-center mb-6">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <motion.button
                      key={star}
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setRatings((prev) => ({ ...prev, [feedbackModal.productId]: star }))}
                      className={`text-3xl mx-1 ${
                        ratings[feedbackModal.productId] >= star ? 'text-yellow-500' : 'text-gray-300'
                      }`}
                    >
                      <FaStar />
                    </motion.button>
                  ))}
                </div>
                <textarea
                  className="w-full h-32 p-4 bg-gray-50 border border-gray-200 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none placeholder-gray-500"
                  placeholder="Tulis ulasan Anda di sini..."
                  value={comments[feedbackModal.productId] || ''}
                  onChange={(e) =>
                    setComments((prev) => ({ ...prev, [feedbackModal.productId]: e.target.value }))
                  }
                />
                <div className="flex justify-end mt-6">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-3 bg-indigo-600 text-white rounded-lg shadow-md font-semibold hover:bg-indigo-700 transition-colors"
                    onClick={() =>
                      handleSubmitFeedback(feedbackModal.orderId, feedbackModal.productId, feedbackModal.sellerId)
                    }
                  >
                    Kirim Feedback
                  </motion.button>
                </div>
              </motion.div>
            </div>
          )}

          {successModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="bg-white rounded-2xl p-8 w-full max-w-sm relative shadow-2xl flex items-center justify-center flex-col"
              >
                <FaCheckCircle className="text-green-500 text-5xl mb-4" />
                <h3 className="text-lg font-bold text-gray-900 mb-2">Feedback Berhasil Dikirim!</h3>
                <p className="text-sm text-gray-600 text-center">Terima kasih atas ulasan Anda.</p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="mt-6 px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
                  onClick={() => setSuccessModal(false)}
                >
                  Tutup
                </motion.button>
              </motion.div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default OrdersPage;