import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaTrash, FaSpinner, FaChevronUp, FaChevronDown, FaCheckCircle, FaTag } from 'react-icons/fa';
import axios from '../../utils/axios';
import { AuthContext } from '../auth/authContext';
import toast from 'react-hot-toast';

const Cart = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [applyingVoucher, setApplyingVoucher] = useState(false);
  const [error, setError] = useState(null);
  const [vouchers, setVouchers] = useState([]);
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const [voucherCode, setVoucherCode] = useState('');
  const [discount, setDiscount] = useState(0);

  const refreshCart = async () => {
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.get('/cart', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCart(data.data);
      setSelectedItems(prev => {
        const validIds = new Set(data.data.CartItems.map(item => item.id));
        return new Set([...prev].filter(id => validIds.has(id)));
      });
      return true;
    } catch (err) {
      console.error('Gagal refresh keranjang:', err);
      const message = err.code === 'ERR_NETWORK'
        ? 'Tidak dapat terhubung ke server. Pastikan server berjalan.'
        : err.response?.data?.message || 'Gagal memuat keranjang';
      toast.error(message);
      setError(message);
      return false;
    }
  };

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
        axios.get(`/vouchers?userId=${user.id}`, { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      setCart(cartResponse.data.data);
      setVouchers(voucherResponse.data.data);
      setLoading(false);
    } catch (err) {
      console.error('Gagal mengambil data:', err);
      const message = err.code === 'ERR_NETWORK'
        ? 'Tidak dapat terhubung ke server. Pastikan server berjalan.'
        : err.response?.data?.message || 'Gagal memuat data';
      toast.error(message);
      setError(message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user, navigate]);

  const calculateSubtotal = () => {
    if (!cart) return 0;
    return cart.CartItems.filter(item => selectedItems.has(item.id)).reduce(
      (sum, item) => sum + item.quantity * item.Product.price,
      0
    );
  };

  const calculatePotentialDiscount = (voucher, subtotal) => {
    if (!voucher || !subtotal || subtotal < voucher.minPurchase) return 0;
    let discountAmount = voucher.type === 'PERSENTASE'
      ? subtotal * (voucher.discount / 100)
      : voucher.discount;
    if (voucher.maxDiscount) {
      discountAmount = Math.min(discountAmount, voucher.maxDiscount);
    }
    return Math.floor(discountAmount);
  };

  const updateQuantity = async (cartItemId, newQuantity, oldQuantity) => {
    if (!Number.isInteger(newQuantity) || newQuantity < 1) {
      toast.error('Jumlah harus bilangan bulat positif');
      return false;
    }
  
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `/cart/item/${cartItemId}`,
        { quantity: newQuantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await refreshCart();
      toast.success('Jumlah item diperbarui');
  
      setSelectedVoucher(null);
      setDiscount(0);
      return true;
    } catch (err) {
      console.error('Gagal memperbarui jumlah:', err);
  
      // 🔔 Ambil pesan error dari server jika ada
      const message =
        err.code === 'ERR_NETWORK'
          ? 'Tidak dapat terhubung ke server. Pastikan server berjalan.'
          : err.response?.data?.message || 'Kesalahan server saat memperbarui jumlah';
  
      // 🔔 Tambahkan pengecekan khusus untuk stok
      if (message === 'Stok tidak cukup') {
        toast.warning('Stok produk tidak mencukupi untuk jumlah yang diminta');
      } else {
        toast.error(message);
      }
      
      const refreshCart = async () => {
        try {
          const token = localStorage.getItem('token');
          const response = await axios.get('/cart', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
      
          if (response.data && response.data.CartItems) {
            // Set ulang state cart dari backend (data fresh)
            setCart(response.data);
          } else {
            setCart({ CartItems: [], voucher: null });
          }
        } catch (err) {
          console.error('Gagal mengambil data keranjang:', err);
          toast.error('Tidak bisa memuat data keranjang');
        }
      };
      await refreshCart();
      return false;
    }
  };


  const handleRemoveItem = async cartItemId => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/cart/item/${cartItemId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      await refreshCart();
      toast.success('Item dihapus dari keranjang');
      setSelectedVoucher(null);
      setDiscount(0);
    } catch (err) {
      console.error('Gagal menghapus item:', err);
      const message = err.code === 'ERR_NETWORK'
        ? 'Tidak dapat terhubung ke server. Pastikan server berjalan.'
        : err.response?.data?.message || 'Gagal menghapus item';
      toast.error(message);
    }
  };

  const toggleSelectItem = id => {
    setSelectedItems(prev => {
      const newSet = new Set(prev);
      newSet.has(id) ? newSet.delete(id) : newSet.add(id);
      return newSet;
    });
    setDiscount(0);
  };

  const toggleSelectAll = selectAll => {
    setSelectedItems(selectAll ? new Set(cart.CartItems.map(item => item.id)) : new Set());
    setDiscount(0);
  };

  const removeSelectedItems = async () => {
    const selectedIds = Array.from(selectedItems);
    if (!selectedIds.length) {
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
      await refreshCart();
      toast.success('Item terpilih dihapus');
      setSelectedVoucher(null);
      setDiscount(0);
    } catch (err) {
      console.error('Gagal menghapus item terpilih:', err);
      const message = err.code === 'ERR_NETWORK'
        ? 'Tidak dapat terhubung ke server. Pastikan server berjalan.'
        : err.response?.data?.message || 'Gagal menghapus item terpilih';
      toast.error(message);
    }
  };

  const applyVoucher = async () => {
    if (!voucherCode && (!selectedVoucher || !selectedVoucher.code)) {
      toast.error('Masukkan kode voucher atau pilih voucher yang valid');
      return;
    }
    setApplyingVoucher(true);
    try {
      const token = localStorage.getItem('token');
      if (!(await refreshCart())) {
        throw new Error('Gagal refresh keranjang');
      }
      const selectedCartItems = cart.CartItems.filter(item => selectedItems.has(item.id));
      if (!selectedCartItems.length) {
        toast.error('Pilih setidaknya satu item untuk menerapkan voucher');
        return;
      }
      const codeToUse = voucherCode || selectedVoucher.code;
      const payload = {
        code: codeToUse,
        cartItemIds: selectedCartItems.map(item => item.id),
      };
      const { data } = await axios.post('/cart/apply-voucher', payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDiscount(data.data.discount);
      setSelectedVoucher(data.data.voucher);
      setVoucherCode('');
      toast.success('Voucher berhasil diterapkan!');
    } catch (err) {
      console.error('Gagal menerapkan voucher:', err);
      const message = err.code === 'ERR_NETWORK'
        ? 'Tidak dapat terhubung ke server. Pastikan server berjalan.'
        : err.response?.data?.message || 'Gagal menerapkan voucher';
      toast.error(message);
    } finally {
      setApplyingVoucher(false);
    }
  };

  const validateVoucherCode = code => {
    const voucher = vouchers.find(v => v.code.toUpperCase() === code.toUpperCase());
    setSelectedVoucher(voucher || null);
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const potentialDiscount = selectedVoucher && !discount
      ? calculatePotentialDiscount(selectedVoucher, subtotal)
      : 0;
    return Math.max(subtotal - (discount || potentialDiscount), 0);
  };

  const handleCheckout = () => {
    const selectedCartItems = cart?.CartItems.filter(item => selectedItems.has(item.id)) || [];
    if (!selectedCartItems.length) {
      toast.error('Pilih setidaknya satu item untuk checkout');
      return;
    }
    toast.success('Menuju checkout...');
    navigate('/checkout-order', {
      state: {
        selectedItems: selectedCartItems,
        voucher: selectedVoucher,
        discount,
        subtotal: calculateSubtotal(),
        total: calculateTotal(),
      },
    });
  };

  const allSelected = cart && cart.CartItems.length > 0 && cart.CartItems.every(item => selectedItems.has(item.id));

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
          onClick={() => navigate('/')}
        >
          Kembali ke Beranda
        </button>
      </div>
    );
  }

  if (!cart || !cart.CartItems.length) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center bg-gray-50">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <p className="text-gray-600 text-lg">Keranjang Anda kosong</p>
          <button
            className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors"
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
      <div className="max-w-6xl mx-auto">
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 text-center"
        >
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">Keranjang Belanja</h1>
          <p className="mt-2 text-sm text-gray-600">
            {cart.CartItems.length} {cart.CartItems.length === 1 ? 'item' : 'item'} di keranjang Anda
          </p>
        </motion.header>

        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={allSelected}
              onChange={e => toggleSelectAll(e.target.checked)}
              className="w-5 h-5 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
            />
            <span className="ml-2 text-sm font-medium text-gray-700">
              Pilih semua ({selectedItems.size}/{cart.CartItems.length})
            </span>
          </div>
          {selectedItems.size > 0 && (
            <button
              onClick={removeSelectedItems}
              className="flex items-center text-sm text-red-600 hover:text-red-800 transition-colors"
            >
              <FaTrash className="mr-1 h-4 w-4" />
              Hapus Terpilih
            </button>
          )}
        </div>

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
              transition={{ duration: 0.3 }}
              className={`p-6 flex items-center ${selectedItems.has(item.id) ? 'bg-indigo-50' : ''} hover:bg-gray-50 transition-colors`}
            >
              <input
                type="checkbox"
                checked={selectedItems.has(item.id)}
                onChange={() => toggleSelectItem(item.id)}
                className="w-5 h-5 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
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
                  <h3 className="text-lg font-medium text-gray-900 truncate">{item.Product.productName}</h3>
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
                      onClick={() => updateQuantity(item.id, item.quantity - 1, item.quantity)}
                      className="px-3 py-1 text-gray-600 hover:bg-gray-100 rounded-l-full"
                    >
                      <FaChevronDown className="h-4 w-4" />
                    </button>
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={e => {
                        const value = parseInt(e.target.value, 10);
                        if (!isNaN(value)) {
                          updateQuantity(item.id, value, item.quantity);
                        }
                      }}
                      className="w-16 text-center border-none focus:ring-0"
                      min="1"
                      step="1"
                    />
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1, item.quantity)}
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
            <div className="flex-1">
              <label htmlFor="voucherCode" className="block text-sm font-medium text-gray-700">
                Masukkan Kode Voucher
              </label>
              <div className="mt-1 flex rounded-md shadow-sm">
                <input
                  type="text"
                  id="voucherCode"
                  value={voucherCode}
                  onChange={e => {
                    const code = e.target.value.toUpperCase();
                    setVoucherCode(code);
                    validateVoucherCode(code);
                  }}
                  className="flex-1 rounded-l-md border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Kode Voucher"
                />
                <button
                  onClick={applyVoucher}
                  disabled={applyingVoucher}
                  className={`inline-flex items-center px-4 py-2 rounded-r-md border border-l-0 border-gray-300 bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 ${applyingVoucher ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {applyingVoucher ? (
                    <FaSpinner className="animate-spin mr-2 h-4 w-4" />
                  ) : (
                    <FaTag className="mr-2 h-4 w-4" />
                  )}
                  {applyingVoucher ? 'Menerapkan...' : 'Terapkan'}
                </button>
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
                  setVoucherCode(voucher ? voucher.code : '');
                }}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="">Pilih voucher</option>
                {vouchers.map(voucher => (
                  <option key={voucher.id} value={voucher.id}>
                    {voucher.code} ({voucher.type === 'PERSENTASE' ? `${voucher.discount}%` : `Rp ${voucher.discount.toLocaleString('id-ID')}`}) - Min. Rp {voucher.minPurchase.toLocaleString('id-ID')}
                  </option>
                ))}
              </select>
            </div>
            {selectedVoucher && !discount && calculatePotentialDiscount(selectedVoucher, calculateSubtotal()) > 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-2 text-sm text-gray-600"
              >
                Voucher {selectedVoucher.code} memenuhi syarat! Potensi diskon: Rp {calculatePotentialDiscount(selectedVoucher, calculateSubtotal()).toLocaleString('id-ID')}
              </motion.div>
            )}
            {discount > 0 && (
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
            {selectedVoucher && !discount && calculatePotentialDiscount(selectedVoucher, calculateSubtotal()) > 0 && (
              <div className="flex justify-between mt-2 text-base font-medium text-gray-600">
                <p>Potensi Diskon ({selectedVoucher.code})</p>
                <p>- Rp {calculatePotentialDiscount(selectedVoucher, calculateSubtotal()).toLocaleString('id-ID')}</p>
              </div>
            )}
            {discount > 0 && (
              <div className="flex justify-between mt-2 text-base font-medium text-green-600">
                <p>Diskon Voucher ({selectedVoucher.code})</p>
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
                className="w-full flex justify-center items-center px-6 py-3 border border-transparent rounded-full shadow-sm text-base font-medium text-white bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
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