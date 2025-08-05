import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  FiArrowLeft, 
  FiDollarSign, 
  FiUser, 
  FiCreditCard, 
  FiCalendar,
  FiCheckCircle,
  FiXCircle,
  FiClock,
  FiTruck,
  FiBox
} from 'react-icons/fi';
import axios from '../../utils/axios';

const DetailPencairanDana = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [transaction, setTransaction] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTransactionDetail = async () => {
      try {
        const response = await axios.get(`/disbursement/${id}`);
        const item = response.data.data;
    
        const mapped = {
          id: item.id,
          orderId: item.orderId,
          amount: item.amount,
          disbursementStatus: item.status.toLowerCase(),
          requestDate: new Date(item.createdAt).toLocaleDateString('id-ID'),
          storeName: item.seller?.storeName || '-',
          email: item.seller?.email || '-',
          phoneNumber: item.seller?.phoneNumber || '-',
          bankName: item.seller?.bankAccountNumber || 'Belum diatur',
          sellerAccount: item.seller?.bankAccountNumber || 'Belum diatur',
          sellerAccountName: item.seller?.bankAccountName || 'Belum diatur',
          adminFee: 2500,
          totalTransfer: item.amount - 2500,
          orderStatus: item.order?.status?.toLowerCase() || '-',
          paymentStatus: item.order?.paymentReleasedToSeller ? 'paid' : 'unpaid',
          orderDate: item.order?.createdAt ? new Date(item.order.createdAt).toLocaleDateString('id-ID') : '-',
          deliveryDate: item.order?.updatedAt ? new Date(item.order.updatedAt).toLocaleDateString('id-ID') : '-',
          deliveryAddress: item.order?.deliveryAddress || '-',
          deliveryNotes: item.order?.deliveryNotes || '-',
          products: [] // No product data in the response
        };
    
        setTransaction(mapped);
      } catch (err) {
        console.error('Error fetching disbursement detail:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTransactionDetail();
  }, [id]);
  

  const handleBack = () => {
    navigate(-1);
  };

  const handleApprove = async () => {
    try {
      const response = await axios.put(`/disbursement/${id}/status`, {
        status: 'SELESAI', // <-- pastikan ini ada nilainya
      });
  
      if (response.data.success) {
        console.log("Status berhasil diperbarui:", response.data.data);

        window.open(`/invoice/disbursement/${id}`, "_blank");
      }
    } catch (err) {
      console.error("Gagal memperbarui status:", err);
    }
  
    navigate(-1); // kembali ke halaman sebelumnya
  }; 

  const handleReject = () => {
    // Logic untuk reject
    alert('Pencairan dana ditolak');
    navigate(-1);
  };

  if (isLoading) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!transaction) {
    return (
      <div className="p-6 max-w-4xl mx-auto text-center">
        <div className="bg-red-100 text-red-700 p-4 rounded-lg inline-block">
          Data tidak ditemukan
        </div>
        <button
          onClick={handleBack}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Kembali
        </button>
      </div>
    );
  }

  const statusBadge = (status) => {
    const statusClasses = {
      pending: 'bg-yellow-100 text-yellow-800',
      completed: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      paid: 'bg-blue-100 text-blue-800',
      unpaid: 'bg-gray-100 text-gray-800',
      shipped: 'bg-purple-100 text-purple-800',
      delivered: 'bg-indigo-100 text-indigo-800',
      cancelled: 'bg-gray-300 text-gray-800',
      verified: 'bg-green-100 text-green-800'
    };

    const statusTexts = {
      pending: 'Menunggu',
      completed: 'Selesai',
      rejected: 'Ditolak',
      paid: 'Dibayar',
      unpaid: 'Belum Dibayar',
      shipped: 'Dikirim',
      delivered: 'Diterima',
      cancelled: 'Dibatalkan',
      verified: 'Terverifikasi'
    };

    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusClasses[status] || 'bg-gray-100 text-gray-800'}`}>
        {statusTexts[status] || status}
      </span>
    );
  };

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto">
      <button
        onClick={handleBack}
        className="flex items-center text-blue-600 hover:text-blue-800 mb-6"
      >
        <FiArrowLeft className="mr-2" /> Kembali ke Daftar
      </button>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {/* Header */}
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <h2 className="text-xl font-bold text-gray-800">
              Detail Pencairan Dana - {transaction.orderId}
            </h2>
            <div className="mt-2 md:mt-0">
              {statusBadge(transaction.disbursementStatus)}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Informasi Seller */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <FiUser className="mr-2 text-blue-500" /> Informasi Seller
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <DetailItem label="Nama Toko" value={transaction.storeName} />
              <DetailItem label="Email" value={transaction.email} />
              <DetailItem label="Nomor Telepon" value={transaction.phoneNumber} />
              <DetailItem label="Nomor Rekening" value={transaction.sellerAccount} />
              <DetailItem label="Status Verifikasi" value={statusBadge('verified')} />
            </div>
          </div>

          {/* Informasi Pencairan */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <FiDollarSign className="mr-2 text-blue-500" /> Informasi Pencairan
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <DetailItem 
                label="Total Pesanan" 
                value={`Rp ${transaction.amount.toLocaleString('id-ID')}`} 
              />
              <DetailItem 
                label="Biaya Admin" 
                value={`Rp ${transaction.adminFee.toLocaleString('id-ID')}`} 
              />
              <DetailItem 
                label="Total Transfer" 
                value={`Rp ${transaction.totalTransfer.toLocaleString('id-ID')}`} 
                highlight 
              />
              <DetailItem 
                label="Tanggal Permintaan" 
                value={transaction.requestDate} 
                icon={<FiCalendar className="mr-1" />}
              />
              <DetailItem 
                label="Status Pencairan" 
                value={statusBadge(transaction.disbursementStatus)} 
              />
            </div>
          </div>

          {/* Informasi Pesanan */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <FiBox className="mr-2 text-blue-500" /> Informasi Pesanan
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <DetailItem label="Order ID" value={transaction.orderId} />
              <DetailItem label="Status Pesanan" value={statusBadge(transaction.orderStatus)} />
              <DetailItem label="Status Pembayaran" value={statusBadge(transaction.paymentStatus)} />
              <DetailItem label="Tanggal Pesanan" value={transaction.orderDate} />
              <DetailItem label="Alamat Pengiriman" value={transaction.deliveryAddress} />
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-700 mb-3">Catatan:</h4>
              <p className="text-gray-600">
                {transaction.deliveryNotes || 'Tidak ada catatan pengiriman.'}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          {transaction.disbursementStatus === 'pending' && (
            <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3 mt-6">
              <button
                onClick={handleReject}
                className="flex items-center justify-center px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <FiXCircle className="mr-2" /> Tolak Pencairan
              </button>
              <button
                onClick={handleApprove}
                className="flex items-center justify-center px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <FiCheckCircle className="mr-2" /> Setujui Pencairan
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const DetailItem = ({ label, value, icon, highlight = false }) => {
  return (
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className={`mt-1 font-medium ${highlight ? 'text-blue-600 text-lg' : 'text-gray-800'}`}>
        {icon && <span className="inline-flex items-center">{icon}</span>}
        {value}
      </p>
    </div>
  );
};

export default DetailPencairanDana;