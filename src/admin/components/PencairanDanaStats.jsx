import React from 'react';
import { FiDollarSign, FiCheckCircle, FiClock, FiXCircle } from 'react-icons/fi';

const PencairanDanaStats = ({ transactions, totalPendingAmount }) => {
  const stats = {
    total: transactions.length,
    pending: transactions.filter((t) => t.disbursementStatus === 'pending').length,
    completed: transactions.filter((t) => t.disbursementStatus === 'completed').length,
    rejected: transactions.filter((t) => t.disbursementStatus === 'rejected').length,
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow p-4 sm:p-5 flex flex-col justify-between">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xs sm:text-sm text-gray-500">Total Pencairan</h3>
            <p className="text-lg sm:text-xl font-bold text-gray-800 mt-1">{stats.total}</p>
          </div>
          <FiDollarSign className="text-lg sm:text-xl text-blue-600" />
        </div>
      </div>
      <div className="bg-white rounded-lg shadow p-4 sm:p-5 flex flex-col justify-between">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xs sm:text-sm text-gray-500">Menunggu</h3>
            <p className="text-lg sm:text-xl font-bold text-gray-800 mt-1">{stats.pending}</p>
          </div>
          <FiClock className="text-lg sm:text-xl text-yellow-600" />
        </div>
      </div>
      <div className="bg-white rounded-lg shadow p-4 sm:p-5 flex flex-col justify-between">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xs sm:text-sm text-gray-500">Selesai</h3>
            <p className="text-lg sm:text-xl font-bold text-gray-800 mt-1">{stats.completed}</p>
          </div>
          <FiCheckCircle className="text-lg sm:text-xl text-green-600" />
        </div>
      </div>
      <div className="bg-white rounded-lg shadow p-4 sm:p-5 flex flex-col justify-between">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xs sm:text-sm text-gray-500">Ditolak</h3>
            <p className="text-lg sm:text-xl font-bold text-gray-800 mt-1">{stats.rejected}</p>
          </div>
          <FiXCircle className="text-lg sm:text-xl text-red-600" />
        </div>
      </div>
      <div className="bg-white rounded-lg shadow p-4 sm:p-5 flex flex-col justify-between">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xs sm:text-sm text-gray-500">Total Pencairan Tertunda</h3>
            <p className="text-lg sm:text-xl font-bold text-gray-800 mt-1 truncate">
              Rp {totalPendingAmount.toLocaleString('id-ID')}
            </p>
          </div>
          <FiDollarSign className="text-lg sm:text-xl text-blue-600" />
        </div>
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-500">Jumlah yang akan dicairkan</p>
        </div>
      </div>
    </>
  );
};

export default PencairanDanaStats;