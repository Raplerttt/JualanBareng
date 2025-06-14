import React, { useState, useEffect } from 'react';
import PromoCard from './PromoCard';
import axios from '../../utils/axios';
import { useNavigate } from 'react-router-dom';

const PromoList = () => {
  const [promos, setPromos] = useState([]);
  const [claimedVouchers, setClaimedVouchers] = useState(new Set());
  const [notification, setNotification] = useState({ show: false, message: '', isError: false });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPromos = async () => {
      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem('user'));
      const userId = user?.id;
  
      try {
        // 1. Fetch all vouchers
        const response = await axios.get('/vouchers', {
          params: {
            page: 1,
            limit: 10,
            search: ''
          }
        });
  
        const vouchers = response.data.data.map(voucher => ({
          id: voucher.id,
          title: voucher.name,
          description: generateDescription(voucher),
          code: voucher.code,
          validUntil: formatDate(voucher.expiryAt)
        }));
  
        setPromos(vouchers);
        setLoading(false);
  
        // 2. Fetch claimed vouchers (only if user is logged in)
        if (token && userId) {
          try {
            const claimedResponse = await axios.get(`/vouchers/claimed?userId=${userId}`, {
              headers: {
                Authorization: `Bearer ${token}`
              }
            });
  
            const claimedCodes = claimedResponse.data.data.map(v => v.code);
            setClaimedVouchers(new Set(claimedCodes));
          } catch (err) {
            console.warn('Failed to fetch claimed vouchers:', err);
          }
        }
  
      } catch (err) {
        console.error('Failed to fetch promos:', err);
        const message = err.response?.data?.message || 'Gagal memuat promo';
        setError(message);
  
        if (err.response?.status === 401) {
          navigate('/user/login');
        }
  
        setLoading(false);
      }
    };
  
    fetchPromos();
  }, [navigate]);
  

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
    return new Date(date).toISOString().split('T')[0];
  };

  const showNotification = (message, isError = false) => {
    setNotification({ show: true, message, isError });
    setTimeout(() => setNotification({ show: false, message: '', isError: false }), 3000);
  };

  const claimVoucher = async (code) => {
    if (claimedVouchers.has(code)) {
      showNotification(`Voucher ${code} sudah pernah diklaim`, true);
      return;
    }
  
    try {
      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user"));
      const userId = user?.id;
  
      if (!token || !userId) {
        showNotification('Silakan login untuk mengklaim voucher', true);
        navigate('/user/login');
        return;
      }
  
      const response = await axios.post('/vouchers/claim', { userId, code }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      setClaimedVouchers(new Set([...claimedVouchers, code]));
      showNotification(`🎉 Voucher ${code} berhasil diklaim!`);
    } catch (err) {
      console.error('Failed to claim voucher:', err);
      showNotification(err.response?.data?.message || `Gagal mengklaim voucher ${code}`, true);
    }
  };
  

  if (loading) {
    return (
      <section className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-lg text-gray-600">Memuat promo...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-3">
          Promo & Voucher Spesial
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Klaim promo menarik dan hemat belanja Anda!
        </p>
      </header>

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

      {notification.show && (
        <div className={`fixed bottom-4 right-4 p-4 rounded-lg shadow-lg text-white ${
          notification.isError ? 'bg-red-500' : 'bg-green-500'
        } transition-transform duration-300 transform ${
          notification.show ? 'translate-y-0' : 'translate-y-full'
        }`}>
          {notification.message}
        </div>
      )}
    </section>
  );
};

export default PromoList;