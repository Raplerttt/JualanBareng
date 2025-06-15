// pages/CheckoutConfirmation.jsx
import React, { useState, useEffect, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaCheckCircle, FaSpinner, FaHome, FaTruck, FaStickyNote, FaTimes, FaCreditCard } from 'react-icons/fa';
import axios from '../../utils/axios';
import { AuthContext } from '../auth/authContext';
import toast from 'react-hot-toast';

const CheckoutConfirmation = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [deliveryAddress, setDeliveryAddress] = useState({
    street: '',
    city: '',
    postalCode: '',
  });
  const [deliveryNotes, setDeliveryNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [addressErrors, setAddressErrors] = useState({
    street: '',
    city: '',
    postalCode: '',
  });
  const [paymentError, setPaymentError] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const paymentMethods = [
    { value: 'CASH', label: 'Bayar di Tempat (COD)' },
    { value: 'BANK_CARD', label: 'Kartu Kredit/Debit' },
    { value: 'BANK_TRANSFER', label: 'Transfer Bank' },
    { value: 'E_WALLET', label: 'E-Wallet (GoPay, OVO, dll.)' },
  ];

  const { selectedItems, voucher, discount, subtotal, total } = location.state || {};

  useEffect(() => {
    if (!user) {
      toast.error('Silakan login untuk melanjutkan checkout');
      setError('Silakan login untuk melanjutkan checkout');
      setLoading(false);
      navigate('/user/login');
      return;
    }

    if (!selectedItems || selectedItems.length === 0) {
      toast.error('Tidak ada item yang dipilih untuk checkout');
      setError('Tidak ada item yang dipilih untuk checkout');
      setLoading(false);
      navigate('/cart');
      return;
    }

    const sellerIds = new Set(selectedItems.map(item => item.Product.sellerId));
    if (sellerIds.size > 1) {
      toast.error('Semua item harus dari satu penjual');
      setError('Semua item harus dari satu penjual');
      setLoading(false);
      navigate('/cart');
      return;
    }

    for (const item of selectedItems) {
      if (!item.id || !item.quantity || !item.Product || !item.Product.id || !item.Product.price || !item.Product.sellerId) {
        toast.error('Data item tidak valid');
        setError('Data item tidak valid');
        setLoading(false);
        navigate('/cart');
        return;
      }
    }

    const calculatedSubtotal = selectedItems.reduce(
      (sum, item) => sum + item.quantity * item.Product.price,
      0
    );
    const calculatedTotal = calculatedSubtotal - (discount || 0);
    if (calculatedSubtotal !== subtotal || calculatedTotal !== total) {
      console.warn('Perhitungan tidak sesuai:', {
        calculatedSubtotal,
        receivedSubtotal: subtotal,
        calculatedTotal,
        receivedTotal: total,
        discount,
      });
    }

    setLoading(false);
  }, [user, selectedItems, subtotal, total, discount, navigate]);

  const validateAddress = () => {
    const errors = {
      street: deliveryAddress.street.trim() ? '' : 'Jalan harus diisi',
      city: deliveryAddress.city.trim() ? '' : 'Kota harus diisi',
      postalCode: deliveryAddress.postalCode.trim()
        ? /^\d{5}$/.test(deliveryAddress.postalCode.trim())
          ? ''
          : 'Kode pos harus 5 digit angka'
        : 'Kode pos harus diisi',
    };
    setAddressErrors(errors);
    return !errors.street && !errors.city && !errors.postalCode;
  };

  const validatePaymentMethod = () => {
    const isValid = !!paymentMethod;
    setPaymentError(isValid ? '' : 'Pilih metode pembayaran');
    return isValid;
  };

  const handleConfirmOrder = async () => {
    if (!validateAddress() || !validatePaymentMethod()) {
      toast.error('Harap lengkapi alamat pengiriman dan pilih metode pembayaran');
      return;
    }

    setSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const fullAddress = `${deliveryAddress.street}, ${deliveryAddress.city}, ${deliveryAddress.postalCode}`;
      const payload = {
        userId: user.id,
        sellerId: selectedItems[0].Product.sellerId,
        totalAmount: total,
        deliveryAddress: fullAddress,
        deliveryNotes: deliveryNotes.trim() || null,
        voucherId: voucher?.id || null,
        selectedItems: selectedItems.map(item => ({
          id: item.id,
          quantity: item.quantity,
          Product: {
            id: item.Product.id,
            price: item.Product.price,
            sellerId: item.Product.sellerId,
          },
        })),
      };

      const { data } = await axios.post('/orders/', payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!data.data.id) {
        throw new Error('ID pesanan tidak ditemukan dalam respons');
      }

      // Panggil endpoint untuk membuat Snap token atau catat pembayaran
      const paymentResponse = await axios.post(
        `/payment/snap-token/${data.data.id}`,
        { paymentMethod },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (paymentMethod === 'CASH') {
        toast.success('Pesanan berhasil dibuat! Pembayaran akan dilakukan saat pengiriman.');
        navigate('/order-confirmation', {
          state: {
            orderId: data.data.id,
            orderDetails: data.data,
            selectedItems,
            paymentMethod,
            paymentStatus: 'PENDING', // Status awal untuk CASH
          },
        });
      } else {
        if (!window.snap) {
          throw new Error('Snap.js belum dimuat. Silakan refresh halaman.');
        }
        window.snap.pay(paymentResponse.data.token, {
          onSuccess: result => {
            toast.success('Pembayaran berhasil!');
            navigate('/order-confirmation', {
              state: {
                orderId: data.data.id,
                orderDetails: data.data,
                selectedItems,
                paymentMethod,
                paymentStatus: 'SUCCESS',
              },
            });
          },
          onPending: result => {
            toast('Pembayaran tertunda. Silakan selesaikan pembayaran.');
            navigate('/order-confirmation', {
              state: {
                orderId: data.data.id,
                orderDetails: data.data,
                selectedItems,
                paymentMethod,
                paymentStatus: 'PENDING',
              },
            });
          },
          onError: result => {
            toast.error('Pembayaran gagal. Silakan coba lagi.');
            console.error('Payment error:', result);
            navigate('/order-confirmation', {
              state: {
                orderId: data.data.id,
                orderDetails: data.data,
                selectedItems,
                paymentMethod,
                paymentStatus: 'FAILED',
              },
            });
          },
          onClose: () => {
            toast.error('Popup pembayaran ditutup. Silakan selesaikan pembayaran.');
            navigate('/order-confirmation', {
              state: {
                orderId: data.data.id,
                orderDetails: data.data,
                selectedItems,
                paymentMethod,
                paymentStatus: 'PENDING',
              },
            });
          },
        });
      }
    } catch (err) {
      console.error('Gagal membuat pesanan:', err);
      const message =
        err.code === 'ERR_NETWORK'
          ? 'Tidak dapat terhubung ke server. Pastikan server berjalan.'
          : err.response?.data?.message || err.message || 'Gagal membuat pesanan';
      toast.error(message);
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  const isFormValid = () =>
    deliveryAddress.street.trim() &&
    deliveryAddress.city.trim() &&
    deliveryAddress.postalCode.trim() &&
    /^\d{5}$/.test(deliveryAddress.postalCode.trim()) &&
    paymentMethod;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}>
          <FaSpinner className="text-indigo-600 text-4xl" />
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center bg-gray-50">
        <p className="text-red-600 text-lg">{error}</p>
        <button
          className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors"
          onClick={() => navigate('/cart')}
        >
          Kembali ke Keranjang
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
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">Konfirmasi Pesanan</h1>
          <p className="mt-2 text-sm text-gray-600">Lengkapi detail pesanan Anda untuk melanjutkan</p>
        </motion.header>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white shadow-2xl rounded-2xl overflow-hidden"
        >
          <div className="px-6 py-5 bg-indigo-50 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-indigo-700 flex items-center">
              <FaCheckCircle className="mr-2 h-5 w-5" />
              Detail Pesanan
            </h3>
          </div>
          <div className="px-6 py-8 space-y-8">
            {/* Delivery Information */}
            <div>
              <h4 className="text-base font-medium text-gray-900 flex items-center mb-4">
                <FaHome className="mr-2 h-5 w-5 text-indigo-600" />
                Alamat Pengiriman
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="street" className="block text-sm font-medium text-gray-700">
                    Jalan
                  </label>
                  <input
                    type="text"
                    id="street"
                    value={deliveryAddress.street}
                    onChange={e => setDeliveryAddress({ ...deliveryAddress, street: e.target.value })}
                    className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${addressErrors.street ? 'border-red-500' : ''}`}
                    placeholder="Masukkan nama jalan"
                    required
                    aria-invalid={addressErrors.street ? 'true' : 'false'}
                    aria-describedby="street-error"
                  />
                  {addressErrors.street && (
                    <p id="street-error" className="mt-1 text-sm text-red-600">
                      {addressErrors.street}
                    </p>
                  )}
                </div>
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                    Kota
                  </label>
                  <input
                    type="text"
                    id="city"
                    value={deliveryAddress.city}
                    onChange={e => setDeliveryAddress({ ...deliveryAddress, city: e.target.value })}
                    className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${addressErrors.city ? 'border-red-500' : ''}`}
                    placeholder="Masukkan nama kota"
                    required
                    aria-invalid={addressErrors.city ? 'true' : 'false'}
                    aria-describedby="city-error"
                  />
                  {addressErrors.city && (
                    <p id="city-error" className="mt-1 text-sm text-red-600">
                      {addressErrors.city}
                    </p>
                  )}
                </div>
                <div>
                  <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700">
                    Kode Pos
                  </label>
                  <input
                    type="text"
                    id="postalCode"
                    value={deliveryAddress.postalCode}
                    onChange={e => setDeliveryAddress({ ...deliveryAddress, postalCode: e.target.value })}
                    className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${addressErrors.postalCode ? 'border-red-500' : ''}`}
                    placeholder="Masukkan kode pos (5 digit)"
                    required
                    aria-invalid={addressErrors.postalCode ? 'true' : 'false'}
                    aria-describedby="postalCode-error"
                  />
                  {addressErrors.postalCode && (
                    <p id="postalCode-error" className="mt-1 text-sm text-red-600">
                      {addressErrors.postalCode}
                    </p>
                  )}
                </div>
              </div>
              <div className="mt-4">
                <label htmlFor="deliveryNotes" className="block text-sm font-medium text-gray-700">
                  Catatan Pengiriman (Opsional)
                </label>
                <textarea
                  id="deliveryNotes"
                  value={deliveryNotes}
                  onChange={e => setDeliveryNotes(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Contoh: Bel pintu jika sampai"
                  rows="3"
                  aria-describedby="deliveryNotes-help"
                />
                <p id="deliveryNotes-help" className="mt-1 text-sm text-gray-500">
                  Tambahkan instruksi khusus untuk pengiriman, jika ada.
                </p>
              </div>
            </div>

            {/* Payment Method */}
            <div>
              <h4 className="text-base font-medium text-gray-900 flex items-center mb-4">
                <FaCreditCard className="mr-2 h-5 w-5 text-indigo-600" />
                Metode Pembayaran
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {paymentMethods.map(method => (
                  <div key={method.value} className="flex items-center">
                    <input
                      type="radio"
                      id={method.value}
                      name="paymentMethod"
                      value={method.value}
                      checked={paymentMethod === method.value}
                      onChange={e => setPaymentMethod(e.target.value)}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                      aria-describedby={`paymentMethod-${method.value}-description`}
                    />
                    <label htmlFor={method.value} className="ml-3 block text-sm font-medium text-gray-700">
                      {method.label}
                    </label>
                  </div>
                ))}
              </div>
              {paymentError && (
                <p id="paymentMethod-error" className="mt-2 text-sm text-red-600">
                  {paymentError}
                </p>
              )}
            </div>

            {/* Order Items */}
            <div>
              <h4 className="text-base font-medium text-gray-900 flex items-center mb-4">
                <FaTruck className="mr-2 h-5 w-5 text-indigo-600" />
                Item Pesanan
              </h4>
              <div className="space-y-4">
                {selectedItems.map(item => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex items-center bg-gray-50 p-4 rounded-lg"
                  >
                    <img
                      src={`http://localhost:3000/${item.Product.image}`}
                      alt={item.Product.productName}
                      className="w-16 h-16 rounded-lg object-cover"
                      onError={e => (e.target.src = 'https://via.placeholder.com/80?text=Gambar')}
                    />
                    <div className="ml-4 flex-1">
                      <p className="text-sm font-medium text-gray-900">{item.Product.productName}</p>
                      <p className="text-sm text-gray-600">
                        Rp {item.Product.price.toLocaleString('id-ID')} x {item.quantity}
                      </p>
                    </div>
                    <p className="text-sm font-semibold text-gray-900">
                      Rp {(item.quantity * item.Product.price).toLocaleString('id-ID')}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div>
              <h4 className="text-base font-medium text-gray-900 mb-4">Ringkasan Pembayaran</h4>
              <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                <div className="flex justify-between text-sm text-gray-600">
                  <p>Subtotal</p>
                  <p>Rp {subtotal.toLocaleString('id-ID')}</p>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <p>Diskon Voucher ({voucher?.code})</p>
                    <p>- Rp {discount.toLocaleString('id-ID')}</p>
                  </div>
                )}
                <div className="flex justify-between text-sm text-gray-600">
                  <p>Ongkir</p>
                  <p>Dihitung setelah konfirmasi</p>
                </div>
                <div className="flex justify-between text-base font-bold text-gray-900">
                  <p>Total</p>
                  <p>Rp {total.toLocaleString('id-ID')}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="px-6 py-5 border-t border-gray-200 bg-gray-50 flex justify-between items-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/cart')}
              className="flex items-center px-4 py-2 border border-gray-300 rounded-full text-sm font-medium text-gray-700 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <FaTimes className="mr-2 h-4 w-4" />
              Batal
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleConfirmOrder}
              disabled={submitting || !isFormValid()}
              className={`flex items-center px-6 py-3 border border-transparent rounded-full shadow-sm text-base font-medium text-white bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${submitting || !isFormValid() ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {submitting ? (
                <FaSpinner className="animate-spin mr-2 h-5 w-5" />
              ) : (
                <FaCheckCircle className="mr-2 h-5 w-5" />
              )}
              {submitting ? 'Mengonfirmasi...' : 'Konfirmasi Pesanan'}
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CheckoutConfirmation;