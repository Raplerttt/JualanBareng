import React, { useState, useEffect, useContext } from 'react';
import PromoCard from './PromoCard';
import axios from '../../utils/axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../auth/authContext';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { FaSpinner } from 'react-icons/fa';


const PromoList = () => {
  const { user, isAuthenticated } = useContext(AuthContext);
  const [promos, setPromos] = useState([]);
  const [claimedVouchers, setClaimedVouchers] = useState(new Set());
  const [notification, setNotification] = useState({ show: false, message: '', isError: false });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPromos = async () => {
      try {
        console.log('Mengambil daftar promo...');
        const response = await axios.get('/vouchers', {
          params: {
            page: 1,
            limit: 10,
            search: '',
          },
        });
        console.log('Respons API vouchers:', JSON.stringify(response.data, null, 2));

        const vouchersData = response.data.data || response.data || [];
        const vouchers = vouchersData.map((voucher) => ({
          id: voucher.id,
          title: voucher.name,
          description: generateDescription(voucher),
          code: voucher.code,
          validUntil: formatDate(voucher.expiryAt),
        }));

        setPromos(vouchers);
        setLoading(false);

        if (isAuthenticated && user?.id) {
          try {
            const token = localStorage.getItem('Admintoken');
            if (!token) {
              throw new Error('Token tidak ditemukan');
            }
            console.log('Mengambil voucher yang sudah diklaim...');
            const claimedResponse = await axios.get(`/vouchers/claim?userId=${user.id}`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
            console.log('Respons API claimed vouchers:', JSON.stringify(claimedResponse.data, null, 2));

            const claimedCodes = (claimedResponse.data.data || claimedResponse.data || []).map((v) => v.code);
            setClaimedVouchers(new Set(claimedCodes));
          } catch (err) {
            console.warn('Gagal mengambil voucher yang sudah diklaim:', err.response?.data || err.message);
          }
        }
      } catch (err) {
        console.error('Gagal memuat promo:', err.response?.data || err.message);
        const message = err.response?.data?.message || 'Gagal memuat promo';
        setError(message);
        toast.error(message);
        if (err.response?.status === 401) {
          navigate('/user/login');
        }
        setLoading(false);
      }
    };

    fetchPromos();
  }, [navigate, isAuthenticated, user]);

  const generateDescription = (voucher) => {
    const minPurchase = voucher.minPurchase.toLocaleString('id-ID');
    switch (voucher.type) {
      case 'PERSENTASE':
        return `Diskon ${voucher.discount}% untuk pembelian di atas Rp ${minPurchase}`;
      case 'NOMINAL':
        return `Potongan Rp ${voucher.discount.toLocaleString('id-ID')} untuk pembelian di atas Rp ${minPurchase}`;
      default:
        return `Nikmati promo spesial ini!`;
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const showNotification = (message, isError = false) => {
    setNotification({ show: true, message, isError });
    setTimeout(() => setNotification({ show: false, message: '', isError: false }), 3000);
  };

  const claimVoucher = async (code) => {
    if (claimedVouchers.has(code)) {
      showNotification(`Voucher ${code} sudah pernah diklaim`, true);
      toast.error(`Voucher ${code} sudah pernah diklaim`);
      return;
    }

    try {
      if (!isAuthenticated || !user?.id) {
        showNotification('Silakan login untuk mengklaim voucher', true);
        toast.error('Silakan login untuk mengklaim voucher');
        navigate('/user/login');
        return;
      }

      const token = localStorage.getItem('Admintoken');
      if (!token) {
        showNotification('Token tidak ditemukan', true);
        toast.error('Token tidak ditemukan');
        navigate('/user/login');
        return;
      }

      console.log(`Mengklaim voucher dengan kode: ${code}`);
      const response = await axios.post(
        '/vouchers/claim',
        { userId: user.id, code },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log('Respons API claim voucher:', JSON.stringify(response.data, null, 2));

      setClaimedVouchers(new Set([...claimedVouchers, code]));
      showNotification(`🎉 Voucher ${code} berhasil diklaim!`);
      toast.success(`Voucher ${code} berhasil diklaim`);
    } catch (err) {
      console.error('Gagal mengklaim voucher:', err.response?.data || err.message);
      const message = err.response?.data?.message || `Gagal mengklaim voucher ${code}`;
      showNotification(message, true);
      toast.error(message);
    }
  };

  if (loading) {
    return (
      <section className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center items-center h-64">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
          >
            <FaSpinner className="text-indigo-600 text-4xl" />
          </motion.div>
          <p className="ml-4 text-lg font-medium text-gray-700">Memuat promo...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center py-12">
          <div className="inline-block p-6 bg-red-50 rounded-lg shadow-md">
            <p className="text-lg font-semibold text-red-600">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Coba Lagi
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl font-bold text-gray-900 mb-3">
          Promo & Voucher Spesial
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Klaim promo menarik dan hemat belanja Anda!
        </p>
      </motion.header>

      {promos.length === 0 ? (
        <div className="text-center py-12">
          <div className="inline-block p-6 bg-gray-50 rounded-xl shadow-md">
            <p className="text-lg font-medium text-gray-500">Tidak ada promo tersedia saat ini</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {promos.map((promo) => (
            <PromoCard
              key={promo.id}
              promo={promo}
              onClaimVoucher={claimVoucher}
              isClaimed={claimedVouchers.has(promo.code)}
            />
          ))}
        </div>
      )}

      {notification.show && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          transition={{ duration: 0.3 }}
          className={`fixed bottom-4 right-4 p-4 rounded-lg shadow-lg text-white ${
            notification.isError ? 'bg-red-500' : 'bg-indigo-600'
          }`}
        >
          {notification.message}
        </motion.div>
      )}
    </section>
  );
};

export default PromoList;