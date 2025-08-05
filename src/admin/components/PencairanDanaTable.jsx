import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiAlertCircle } from 'react-icons/fi';

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  completed: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
  paid: 'bg-blue-100 text-blue-800',
  unpaid: 'bg-gray-100 text-gray-800',
  shipped: 'bg-purple-100 text-purple-800',
  delivered: 'bg-indigo-100 text-indigo-800',
  cancelled: 'bg-gray-300 text-gray-800',
};

const PencairanDanaTable = ({ transactions, isLoading, onApprove, onReject }) => {
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="py-8">
        <div className="space-y-4 sm:hidden">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white p-4 rounded-lg shadow animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            </div>
          ))}
        </div>
        <div className="hidden sm:block">
          <table className="min-w-full divide-y divide-gray-200">
            <tbody>
              {[...Array(3)].map((_, i) => (
                <tr key={i} className="animate-pulse">
                  {[...Array(6)].map((_, j) => (
                    <td key={j} className="px-4 py-4">
                      <div className="h-4 bg-gray-200 rounded w-full"></div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="text-center py-8">
        <FiAlertCircle className="mx-auto text-gray-400 text-2xl mb-2" />
        <p className="text-sm text-gray-500">Tidak ada data pencairan dana</p>
      </div>
    );
  }

  return (
    <div>
      {/* Mobile: Card Layout */}
      <div className="sm:hidden space-y-4">
        {transactions.map((transaction) => (
          <div key={transaction.id} className="bg-white p-4 rounded-lg shadow">
            <div className="flex justify-between items-start">
              <div>
                <div className="text-sm font-medium text-gray-900">{transaction.orderId}</div>
                <div className="text-xs text-gray-500 mt-1 truncate">{transaction.sellerName}</div>
              </div>
              <StatusBadge status={transaction.disbursementStatus} />
            </div>
            <div className="mt-2">
              <p className="text-sm font-semibold text-gray-800">
                Rp {transaction.amount.toLocaleString('id-ID')}
              </p>
            </div>
            <div className="mt-3 flex space-x-2">
              <button
                onClick={() => navigate(`/admin/escrow-to-seller/${transaction.id}`)}
                className="flex-1 bg-blue-600 text-white text-sm px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Detail
              </button>
              {transaction.disbursementStatus === 'pending' && (
                <>
                  <button
                    onClick={() => onApprove(transaction.id)}
                    className="flex-1 bg-green-600 text-white text-sm px-3 py-2 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => onReject(transaction.id)}
                    className="flex-1 bg-red-600 text-white text-sm px-3 py-2 rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Reject
                  </button>
                </>
              )}
            </div>
            <div className="mt-2 text-xs text-gray-500">
              <p>Nomor Rekening: {transaction.sellerAccount}</p>
              <p>Tanggal: {transaction.requestDate}</p>
              <p>Status Order: {statusText[transaction.orderStatus] || transaction.orderStatus}</p>
              <p>Status Bayar: {statusText[transaction.paymentStatus] || transaction.paymentStatus}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop: Table Layout */}
      <div className="hidden sm:block">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Seller</th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Nomor Rekening</th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jumlah</th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">Status Order</th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">Status Bayar</th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Tanggal</th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {transactions.map((transaction) => (
              <tr key={transaction.id} className="hover:bg-gray-50">
                <td className="px-3 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{transaction.orderId}</td>
                <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-500 truncate max-w-xs">{transaction.sellerName}</td>
                <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-500 truncate hidden md:table-cell">{transaction.sellerAccount}</td>
                <td className="px-3 py-3 whitespace-nowrap text-sm font-semibold text-gray-800">
                  Rp {transaction.amount.toLocaleString('id-ID')}
                </td>
                <td className="px-3 py-3 whitespace-nowrap hidden lg:table-cell">
                  <StatusBadge status={transaction.orderStatus} />
                </td>
                <td className="px-3 py-3 whitespace-nowrap hidden lg:table-cell">
                  <StatusBadge status={transaction.paymentStatus} />
                </td>
                <td className="px-3 py-3 whitespace-nowrap">
                  <StatusBadge status={transaction.disbursementStatus} />
                </td>
                <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-500 hidden md:table-cell">{transaction.requestDate}</td>
                <td className="px-3 py-3 whitespace-nowrap">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => navigate(`/admin/escrow-to-seller/${transaction.id}`)}
                      className="bg-blue-600 text-white text-sm px-3 py-1.5 rounded hover:bg-blue-700 transition-colors"
                    >
                      Detail
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const statusText = {
  pending: 'Menunggu',
  completed: 'Selesai',
  rejected: 'Ditolak',
  paid: 'Dibayar',
  unpaid: 'Belum Bayar',
  shipped: 'Dikirim',
  delivered: 'Diterima',
  cancelled: 'Dibatalkan',
};

const StatusBadge = ({ status }) => {
  return (
    <span
      className={`px-2 py-1 inline-flex text-xs sm:text-sm font-semibold rounded-full ${statusColors[status]}`}
    >
      {statusText[status] || status}
    </span>
  );
};

export default PencairanDanaTable;