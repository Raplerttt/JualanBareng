import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTrash, FaSpinner, FaChevronUp, FaChevronDown, FaCheckCircle, FaTag } from 'react-icons/fa';
import axios from '../../utils/axios';
import { AuthContext } from '../auth/authContext';
import toast from 'react-hot-toast';

const Cart = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [vouchers, setVouchers] = useState([]);
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const [voucherCode, setVoucherCode] = useState('');
  const [discount, setDiscount] = useState(0);

  // Fetch data keranjang dan voucher
  useEffect(() => {
    const fetchData = async () => {
      if (!user) {
        toast.error('Silakan login untuk melihat keranjang');
        setError('Silakan login untuk melihat keranjang');
        setLoading(false);
        navigate('/user/login');
        return;
      }
      try {
        const token = localStorage.getItem('token');
        const [cartResponse, voucherResponse] = await Promise.all([
          axios.get('/cart', { headers: { Authorization: `Bearer ${token}` } }),
          axios.get('/vouchers', { headers: { Authorization: `Bearer ${token}` } }),
        ]);
        const cartData = {
          ...cartResponse.data.data,
          CartItems: cartResponse.data.data.CartItems.map(item => ({
            ...item,
            selected: false,
          })),
        };
        setCart(cartData);
        setVouchers(voucherResponse.data.data);
        setLoading(false);
      } catch (err) {
        console.error('Gagal mengambil data:', err);
        toast.error(err.response?.data?.message || 'Gagal memuat data');
        setError(err.response?.data?.message || 'Gagal memuat data');
        setLoading(false);
      }
    };
    fetchData();
  }, [user, navigate]);

  // Update jumlah item
  const updateQuantity = async (cartItemId, newQuantity) => {
    if (newQuantity < 1) {
      handleRemoveItem(cartItemId);
      return;
    }
    try {
      const token = localStorage.getItem('token');
      await axios.patch(
        `/cart/item/${cartItemId}`,
        { quantity: newQuantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCart(prev => ({
        ...prev,
        CartItems: prev.CartItems.map(item =>
          item.id === cartItemId ? { ...item, quantity: newQuantity } : item
        ),
      }));
      toast.success('Jumlah item diperbarui');
      // Reset voucher jika total berubah
      setSelectedVoucher(null);
      setDiscount(0);
    } catch (err) {
      console.error('Gagal memperbarui jumlah:', err);
      toast.error(err.response?.data?.message || 'Gagal memperbarui jumlah');
    }
  };

  // Hapus item dari keranjang
  const handleRemoveItem = async cartItemId => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/cart/item/${cartItemId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCart(prev => ({
        ...prev,
        CartItems: prev.CartItems.filter(item => item.id !== cartItemId),
      }));
      toast.success('Item dihapus dari keranjang');
      // Reset voucher jika total berubah
      setSelectedVoucher(null);
      setDiscount(0);
    } catch (err) {
      console.error('Gagal menghapus item:', err);
      toast.error(err.response?.data?.message || 'Gagal menghapus item');
    }
  };

  // Toggle pilih item
  const toggleSelectItem = id => {
    setCart(prev => ({
      ...prev,
      CartItems: prev.CartItems.map(item =>
        item.id === id ? { ...item, selected: !item.selected } : item
      ),
    }));
    // Reset voucher jika seleksi berubah
    setSelectedVoucher(null);
    setDiscount(0);
  };

  // Pilih atau batalkan semua item
  const toggleSelectAll = selectAll => {
    setCart(prev => ({
      ...prev,
      CartItems: prev.CartItems.map(item => ({ ...item, selected: selectAll })),
    }));
    // Reset voucher jika seleksi berubah
    setSelectedVoucher(null);
    setDiscount(0);
  };

  // Hapus item yang dipilih
  const removeSelectedItems = async () => {
    const selectedIds = cart.CartItems.filter(item => item.selected).map(item => item.id);
    if (selectedIds.length === 0) {
      toast.error('Pilih setidaknya satu item untuk dihapus');
      return;
    }
    try {
      const token = localStorage.getItem('token');
      await Promise.all(
        selectedIds.map(id =>
          axios.delete(`/cart/item/${id}`, { headers: { Authorization: `Bearer ${token}` } })
        )
      );
      setCart(prev => ({
        ...prev,
        CartItems: prev.CartItems.filter(item => !item.selected),
      }));
      toast.success('Item terpilih dihapus');
      // Reset voucher
      setSelectedVoucher(null);
      setDiscount(0);
    } catch (err) {
      console.error('Gagal menghapus item terpilih:', err);
      toast.error(err.response?.data?.message || 'Gagal menghapus item terpilih');
    }
  };

  // Terapkan voucher
  const applyVoucher = async () => {
    if (!voucherCode && !selectedVoucher) {
      toast.error('Masukkan kode voucher atau pilih voucher');
      return;
    }
    try {
      const token = localStorage.getItem('token');
      const selectedItems = cart.CartItems.filter(item => item.selected);
      if (selectedItems.length === 0) {
        toast.error('Pilih setidaknya satu item untuk menerapkan voucher');
        return;
      }
      const payload = voucherCode
        ? { code: voucherCode, cartItemIds: selectedItems.map(item => item.id) }
        : { voucherId: selectedVoucher.id, cartItemIds: selectedItems.map(item => item.id) };
      const response = await axios.post('/cart/apply-voucher', payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDiscount(response.data.data.discount);
      setSelectedVoucher(response.data.data.voucher);
      setVoucherCode('');
      toast.success('Voucher berhasil diterapkan!');
    } catch (err) {
      console.error('Gagal menerapkan voucher:', err);
      toast.error(err.response?.data?.message || 'Gagal menerapkan voucher');
    }
  };

  // Hitung total harga sebelum diskon
  const calculateSubtotal = () => {
    if (!cart) return 0;
    return cart.CartItems.filter(item => item.selected).reduce(
      (sum, item) => sum + item.quantity * item.Product.price,
      0
    );
  };

  // Hitung total harga setelah diskon
  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    return Math.max(subtotal - discount, 0);
  };

  // Handle checkout
  const handleCheckout = () => {
    const selectedItems = cart?.CartItems.filter(item => item.selected) || [];
    if (selectedItems.length === 0) {
      toast.error('Pilih setidaknya satu item untuk checkout');
      return;
    }
    toast.success('Menuju checkout...');
    navigate('/checkout', {
      state: { selectedItems, voucherId: selectedVoucher?.id, discount },
    });
  };

  // Cek apakah semua item dipilih
  const allSelected =
    cart && cart.CartItems.length > 0 && cart.CartItems.every(item => item.selected);

  // Render loading
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1 }}
        >
          <FaSpinner className="text-indigo-600 text-4xl" />
        </motion.div>
      </div>
    );
  }

  // Render error
  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center bg-gray-50">
        <p className="text-red-600 text-lg">{error}</p>
        <button
          className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors duration-200"
          onClick={() => navigate('/')}
        >
          Kembali ke Beranda
        </button>
      </div>
    );
  }

  // Render keranjang kosong
  if (!cart || cart.CartItems.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center bg-gray-50">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-gray-600 text-lg">Keranjang Anda kosong</p>
          <button
            className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors duration-200"
            onClick={() => navigate('/')}
          >
            Belanja Sekarang
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Keranjang Belanja
          </h1>
          <p className="mt-3 text-xl text-gray-500">
            {cart.CartItems.length} {cart.CartItems.length === 1 ? 'item' : 'item'} di keranjang Anda
          </p>
        </motion.div>

        {/* Aksi Keranjang */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={allSelected}
              onChange={e => toggleSelectAll(e.target.checked)}
              className="h-5 w-5 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
            />
            <span className="ml-2 text-sm font-medium text-gray-700">
              Pilih semua ({cart.CartItems.filter(item => item.selected).length}/{cart.CartItems.length})
            </span>
          </div>
          {cart.CartItems.some(item => item.selected) && (
            <button
              onClick={removeSelectedItems}
              className="flex items-center text-sm text-red-600 hover:text-red-800 transition-colors"
            >
              <FaTrash className="mr-1" />
              Hapus Terpilih
            </button>
          )}
        </div>

        {/* Item Keranjang */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white shadow-lg rounded-xl overflow-hidden divide-y divide-gray-200"
        >
          {cart.CartItems.map(item => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className={`p-6 flex items-start sm:items-center ${item.selected ? 'bg-indigo-50' : ''} hover:bg-gray-50 transition-colors`}
            >
              <input
                type="checkbox"
                checked={item.selected}
                onChange={() => toggleSelectItem(item.id)}
                className="h-5 w-5 mt-1 sm:mt-0 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
              />
              <div className="ml-4 flex-shrink-0">
                <img
                  src={`http://localhost:3000/${item.Product.image}`}
                  alt={item.Product.productName}
                  className="w-20 h-20 rounded-lg object-cover"
                  onError={e => (e.target.src = 'https://via.placeholder.com/80?text=Gambar')}
                />
              </div>
              <div className="ml-6 flex-1 min-w-0">
                <div className="flex justify-between">
                  <h3 className="text-lg font-medium text-gray-900 truncate">
                    {item.Product.productName}
                  </h3>
                  <p className="ml-4 text-lg font-semibold text-gray-900">
                    Rp {(item.quantity * item.Product.price).toLocaleString('id-ID')}
                  </p>
                </div>
                <p className="mt-1 text-sm text-gray-500">
                  Rp {item.Product.price.toLocaleString('id-ID')} per item
                </p>
                <div className="mt-4 flex items-center">
                  <div className="flex items-center border border-gray-300 rounded-full">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                      className="px-3 py-1 text-gray-600 hover:bg-gray-100 disabled:opacity-50 rounded-l-full"
                    >
                      <FaChevronDown className="h-4 w-4" />
                    </button>
                    <span className="px-4 py-1 text-gray-900">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="px-3 py-1 text-gray-600 hover:bg-gray-100 rounded-r-full"
                    >
                      <FaChevronUp className="h-4 w-4" />
                    </button>
                  </div>
                  <button
                    onClick={() => handleRemoveItem(item.id)}
                    className="ml-4 flex items-center text-sm text-red-600 hover:text-red-800 transition-colors"
                  >
                    <FaTrash className="mr-1 h-4 w-4" />
                    Hapus
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Voucher Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-8 bg-white shadow-lg rounded-xl overflow-hidden"
        >
          <div className="px-6 py-5 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Gunakan Voucher</h3>
          </div>
          <div className="px-6 py-5 space-y-4">
            <div className="flex items-center space-x-2">
              <div className="flex-1">
                <label htmlFor="voucherCode" className="block text-sm font-medium text-gray-700">
                  Masukkan Kode Voucher
                </label>
                <div className="mt-1 flex rounded-md shadow-sm">
                  <input
                    type="text"
                    id="voucherCode"
                    value={voucherCode}
                    onChange={e => setVoucherCode(e.target.value)}
                    className="flex-1 rounded-l-md border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Kode Voucher"
                  />
                  <button
                    onClick={applyVoucher}
                    className="inline-flex items-center px-4 py-2 rounded-r-md border border-l-0 border-gray-300 bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <FaTag className="mr-2 h-4 w-4" />
                    Terapkan
                  </button>
                </div>
              </div>
            </div>
            <div>
              <label htmlFor="voucherSelect" className="block text-sm font-medium text-gray-700">
                Pilih Voucher
              </label>
              <select
                id="voucherSelect"
                value={selectedVoucher?.id || ''}
                onChange={e => {
                  const voucher = vouchers.find(v => v.id === parseInt(e.target.value));
                  setSelectedVoucher(voucher || null);
                  setVoucherCode('');
                }}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="">Pilih voucher</option>
                {vouchers.map(voucher => (
                  <option key={voucher.id} value={voucher.id}>
                    {voucher.code} ({voucher.type === 'PERSENTASE' ? `${voucher.discount}%` : `Rp ${voucher.discount.toLocaleString('id-ID')}`})
                  </option>
                ))}
              </select>
            </div>
            {selectedVoucher && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-2 text-sm text-green-600"
              >
                Voucher {selectedVoucher.code} diterapkan! Diskon: Rp {discount.toLocaleString('id-ID')}
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Ringkasan Pesanan */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-8 bg-white shadow-lg rounded-xl overflow-hidden"
        >
          <div className="px-6 py-5 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Ringkasan Pesanan</h3>
          </div>
          <div className="px-6 py-5">
            <div className="flex justify-between text-base font-medium text-gray-900">
              <p>Subtotal</p>
              <p>Rp {calculateSubtotal().toLocaleString('id-ID')}</p>
            </div>
            {discount > 0 && (
              <div className="flex justify-between mt-2 text-base font-medium text-green-600">
                <p>Diskon Voucher</p>
                <p>- Rp {discount.toLocaleString('id-ID')}</p>
              </div>
            )}
            <div className="flex justify-between mt-2 text-sm text-gray-600">
              <p>Ongkir</p>
              <p>Dihitung saat checkout</p>
            </div>
            <div className="mt-4 border-t border-gray-200 pt-4 flex justify-between text-lg font-bold text-gray-900">
              <p>Total</p>
              <p>Rp {calculateTotal().toLocaleString('id-ID')}</p>
            </div>
            <div className="mt-6">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleCheckout}
                className="w-full flex justify-center items-center px-6 py-3 border border-transparent rounded-full shadow-sm text-base font-medium text-white bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
              >
                <FaCheckCircle className="mr-2 h-5 w-5" />
                Lanjut ke Checkout
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Cart;