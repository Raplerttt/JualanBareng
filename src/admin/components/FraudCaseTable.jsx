import React, { useState, useMemo } from 'react';
import FraudStatusBadge from './FraudStatusBadges';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';

const FraudCaseTable = ({ fraudCases, updateCaseStatus, blockAccount }) => {
  const [sortConfig, setSortConfig] = useState({ key: 'reportedDate', direction: 'desc' });
  const [expandedRow, setExpandedRow] = useState(null);

  // Sorting logic
  const sortedCases = useMemo(() => {
    let sortableItems = [...fraudCases];
    if (sortConfig.key) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [fraudCases, sortConfig]);

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const formatCurrency = (amount, currency) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {/** Transaction ID Header */}
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => requestSort('transactionId')}
            >
              <div className="flex items-center">
                ID Transaksi
                {sortConfig.key === 'transactionId' && (
                  sortConfig.direction === 'asc' ? (
                    <ChevronUpIcon className="ml-1 h-4 w-4" />
                  ) : (
                    <ChevronDownIcon className="ml-1 h-4 w-4" />
                  )
                )}
              </div>
            </th>

            {/** Reporter Header */}
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Pelapor
            </th>

            {/** Amount Header */}
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => requestSort('amount')}
            >
              <div className="flex items-center">
                Jumlah
                {sortConfig.key === 'amount' && (
                  sortConfig.direction === 'asc' ? (
                    <ChevronUpIcon className="ml-1 h-4 w-4" />
                  ) : (
                    <ChevronDownIcon className="ml-1 h-4 w-4" />
                  )
                )}
              </div>
            </th>

            {/** Status Header */}
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Status
            </th>

            {/** Reported Date Header */}
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => requestSort('reportedDate')}
            >
              <div className="flex items-center">
                Dilaporkan
                {sortConfig.key === 'reportedDate' && (
                  sortConfig.direction === 'asc' ? (
                    <ChevronUpIcon className="ml-1 h-4 w-4" />
                  ) : (
                    <ChevronDownIcon className="ml-1 h-4 w-4" />
                  )
                )}
              </div>
            </th>

            <th scope="col" className="relative px-6 py-3">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>

        <tbody className="bg-white divide-y divide-gray-200">
          {sortedCases.length === 0 && (
            <tr>
              <td colSpan="6" className="text-center py-12 text-gray-500">
                Tidak ada kasus penipuan yang ditemukan.<br />
                <span className="text-sm text-gray-400">Coba ubah filter pencarian Anda.</span>
              </td>
            </tr>
          )}

          {sortedCases.map((fraudCase) => (
            <React.Fragment key={fraudCase.id}>
              <tr
                className="hover:bg-gray-50 cursor-pointer"
                onClick={() => setExpandedRow(expandedRow === fraudCase.id ? null : fraudCase.id)}
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {fraudCase.transactionId}
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {fraudCase.reporter}
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatCurrency(fraudCase.amount, fraudCase.currency)}
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                  <FraudStatusBadge status={fraudCase.status} />
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {fraudCase.reportedDate}
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <select
                    value={fraudCase.status}
                    onChange={(e) => updateCaseStatus(fraudCase.id, e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    className={`block w-full py-1 px-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-xs ${
                      fraudCase.status === 'open'
                        ? 'bg-red-50'
                        : fraudCase.status === 'investigating'
                        ? 'bg-yellow-50'
                        : fraudCase.status === 'resolved'
                        ? 'bg-green-50'
                        : 'bg-gray-50'
                    }`}
                  >
                    <option value="open">Open</option>
                    <option value="investigating">Investigating</option>
                    <option value="resolved">Resolved</option>
                    <option value="closed">Closed</option>
                  </select>
                </td>
              </tr>

              {/* Expanded Row */}
              {expandedRow === fraudCase.id && (
                <tr className="bg-blue-50">
                  <td colSpan="6" className="px-6 py-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">Deskripsi Kasus</h3>
                        <p className="mt-1 text-sm text-gray-700">{fraudCase.description}</p>

                        <h3 className="text-sm font-medium text-gray-900 mt-4">Catatan</h3>
                        <p className="mt-1 text-sm text-gray-700">{fraudCase.notes}</p>
                      </div>

                      <div>
                        <h3 className="text-sm font-medium text-gray-900">Bukti</h3>
                        <ul className="mt-1 text-sm text-gray-700">
                          {fraudCase.evidence.map((file, index) => (
                            <li key={index} className="flex items-center">
                              <span className="mr-2">📄</span>
                              <a
                                href="#"
                                className="text-blue-600 hover:text-blue-800"
                                onClick={(e) => e.preventDefault()}
                              >
                                {file}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h3 className="text-sm font-medium text-gray-900">Tindakan</h3>
                        <div className="mt-2 space-y-2">
                          <button
                            className="w-full inline-flex justify-center items-center px-3 py-2 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none"
                            onClick={() => blockAccount(fraudCase.id, 'pembeli', fraudCase.reporter)}
                          >
                            Blokir Akun Pembeli
                          </button>

                          <button
                            className="w-full inline-flex justify-center items-center px-3 py-2 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none"
                            onClick={() => blockAccount(fraudCase.id, 'penjual', 'seller_xxx')}
                          >
                            Blokir Akun Penjual
                          </button>

                          <button
                            className="w-full inline-flex justify-center items-center px-3 py-2 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                          >
                            Proses Refund
                          </button>

                          <button
                            className="w-full inline-flex justify-center items-center px-3 py-2 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                          >
                            Tambah Catatan
                          </button>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FraudCaseTable;
