import React, { useState, useEffect } from 'react';
import PencairanDanaTable from './components/PencairanDanaTable';
import PencairanDanaFilter from './components/PencairanDanaFilter';
import PencairanDanaStats from './components/PencairanDanaStats';
import { FiDownload, FiFilter, FiCheckCircle, FiClock, FiXCircle } from 'react-icons/fi';
import axios from '../../utils/axios';

const PencairanDanaPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/disbursement');
        const result = response.data;
  
        const mappedTransactions = result.data.map((item) => ({
          id: item.id,
          orderId: item.orderId.slice(0, 12), // hanya ambil 8 karakter pertama
          amount: item.amount,
          disbursementStatus: item.status.toLowerCase(),
          requestDate: item.createdAt.split('T')[0],
          sellerName: item.seller?.storeName || item.user?.fullName || '-',
          sellerAccount: item.seller?.bankAccountNumber || '-',
          orderStatus: item.order?.status?.toLowerCase() || '-',
          paymentStatus: item.order?.paymentReleasedToSeller ? 'paid' : 'unpaid',
        }));
  
        setTransactions(mappedTransactions);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);
  

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch =
      transaction.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.sellerName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || transaction.disbursementStatus === statusFilter;
    const matchesDate =
      (!dateRange.start || transaction.requestDate >= dateRange.start) &&
      (!dateRange.end || transaction.requestDate <= dateRange.end);
    return matchesSearch && matchesStatus && matchesDate;
  });

  const totalPendingAmount = transactions
  .filter((t) => t.disbursementStatus === 'pending')
  .reduce((sum, t) => sum + Math.max(0, t.amount - 2500), 0);


  const handleApprove = (id) => {
    setTransactions(
      transactions.map((tx) =>
        tx.id === id
          ? {
              ...tx,
              disbursementStatus: 'completed',
              completedDate: new Date().toISOString().split('T')[0],
            }
          : tx
      )
    );
  };

  const handleReject = (id) => {
    setTransactions(
      transactions.map((tx) =>
        tx.id === id
          ? {
              ...tx,
              disbursementStatus: 'rejected',
              completedDate: new Date().toISOString().split('T')[0],
            }
          : tx
      )
    );
  };

  const handleExport = () => {
    alert('Fitur export data akan diimplementasikan');
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800">
            Pencairan Dana Seller
          </h1>
          <p className="text-sm text-gray-600 mt-1">Kelola permintaan pencairan dana dari seller</p>
        </div>
        <button
          onClick={handleExport}
          className="mt-4 md:mt-0 flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <FiDownload className="mr-2 text-base" />
          Export Data
        </button>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <PencairanDanaStats transactions={transactions} totalPendingAmount={totalPendingAmount} />
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:flex-wrap justify-between items-start sm:items-center mb-6 gap-4">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-0">
              Daftar Permintaan Pencairan
            </h2>
            <div className="flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-center gap-3 w-full sm:w-auto">
              <div className="relative w-full sm:w-48">
                <FiFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-base" />
                <select
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">Semua Status</option>
                  <option value="pending">Menunggu</option>
                  <option value="completed">Selesai</option>
                  <option value="rejected">Ditolak</option>
                </select>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                <input
                  type="date"
                  className="w-full sm:w-40 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  value={dateRange.start}
                  onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                />
                <span className="flex items-center text-gray-600">-</span>
                <input
                  type="date"
                  className="w-full sm:w-40 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  value={dateRange.end}
                  onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                />
              </div>
            </div>
          </div>

          <PencairanDanaFilter searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

          <PencairanDanaTable
            transactions={filteredTransactions}
            isLoading={isLoading}
            onApprove={handleApprove}
            onReject={handleReject}
          />
        </div>

        <div className="bg-gray-50 px-4 sm:px-6 py-4 border-t border-gray-200">
          <div className="flex flex-col md:flex-row flex-wrap justify-between items-center gap-4">
            <p className="text-sm text-gray-600">
              Menampilkan {filteredTransactions.length} dari {transactions.length} permintaan
            </p>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center">
                <FiCheckCircle className="text-green-500 mr-1 text-base" />
                <span className="text-sm text-gray-600">
                  {transactions.filter((t) => t.disbursementStatus === 'completed').length} Disetujui
                </span>
              </div>
              <div className="flex items-center">
                <FiClock className="text-yellow-500 mr-1 text-base" />
                <span className="text-sm text-gray-600">
                  {transactions.filter((t) => t.disbursementStatus === 'pending').length} Menunggu
                </span>
              </div>
              <div className="flex items-center">
                <FiXCircle className="text-red-500 mr-1 text-base" />
                <span className="text-sm text-gray-600">
                  {transactions.filter((t) => t.disbursementStatus === 'rejected').length} Ditolak
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PencairanDanaPage;