import React, { useState } from 'react';
import FraudStatusBadge from './FraudStatusBadges';
import { ChevronDownIcon, ChevronUpIcon, DocumentTextIcon, PhotoIcon, VideoCameraIcon } from '@heroicons/react/24/outline';

const FraudCaseTable = ({ fraudCases, updateCaseStatus, openEvidenceModal }) => {
  const [sortConfig, setSortConfig] = useState({ key: 'createdAt', direction: 'desc' });
  const [expandedRow, setExpandedRow] = useState(null);

  // Fungsi untuk sorting
  const sortedCases = React.useMemo(() => {
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

  // Fungsi untuk mengubah sorting
  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Fungsi untuk mengubah status
  const handleStatusChange = (id, e) => {
    updateCaseStatus(id, e.target.value);
  };

  // Fungsi untuk membuka modal bukti
  const handleOpenEvidence = (e, caseItem) => {
    e.stopPropagation();
    openEvidenceModal(caseItem);
  };

  // Render icon berdasarkan tipe bukti
  const renderEvidenceIcon = (type) => {
    switch (type) {
      case 'image':
        return <PhotoIcon className="h-4 w-4 text-blue-500" />;
      case 'video':
        return <VideoCameraIcon className="h-4 w-4 text-purple-500" />;
      case 'chat':
        return <DocumentTextIcon className="h-4 w-4 text-green-500" />;
      default:
        return <DocumentTextIcon className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th 
              scope="col" 
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => requestSort('title')}
            >
              <div className="flex items-center">
                Kasus Penipuan
                {sortConfig.key === 'title' && (
                  sortConfig.direction === 'asc' ? 
                  <ChevronUpIcon className="ml-1 h-4 w-4" /> : 
                  <ChevronDownIcon className="ml-1 h-4 w-4" />
                )}
              </div>
            </th>
            <th 
              scope="col" 
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => requestSort('severity')}
            >
              <div className="flex items-center">
                Keparahan
                {sortConfig.key === 'severity' && (
                  sortConfig.direction === 'asc' ? 
                  <ChevronUpIcon className="ml-1 h-4 w-4" /> : 
                  <ChevronDownIcon className="ml-1 h-4 w-4" />
                )}
              </div>
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th 
              scope="col" 
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => requestSort('createdAt')}
            >
              <div className="flex items-center">
                Dilaporkan
                {sortConfig.key === 'createdAt' && (
                  sortConfig.direction === 'asc' ? 
                  <ChevronUpIcon className="ml-1 h-4 w-4" /> : 
                  <ChevronDownIcon className="ml-1 h-4 w-4" />
                )}
              </div>
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Bukti
            </th>
            <th scope="col" className="relative px-6 py-3">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {sortedCases.map((caseItem) => (
            <React.Fragment key={caseItem.id}>
              <tr 
                className="hover:bg-gray-50 cursor-pointer"
                onClick={() => setExpandedRow(expandedRow === caseItem.id ? null : caseItem.id)}
              >
                <td className="px-6 py-4">
                  <div className="font-medium text-gray-900">{caseItem.title}</div>
                  <div className="text-sm text-gray-500 truncate max-w-xs">{caseItem.description}</div>
                  <div className="mt-1 text-xs">
                    <span className="font-medium">Pelapor:</span> {caseItem.reporter}
                    <span className="mx-2">•</span>
                    <span className="font-medium">Dilaporkan:</span> {caseItem.reportedUser}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    caseItem.severity === 'critical' ? 'bg-purple-100 text-purple-800' :
                    caseItem.severity === 'high' ? 'bg-red-100 text-red-800' :
                    caseItem.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {caseItem.severity.charAt(0).toUpperCase() + caseItem.severity.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <FraudStatusBadge status={caseItem.status} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {caseItem.createdAt}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {caseItem.evidence.slice(0, 3).map((evidence, idx) => (
                      <div key={idx} className="mr-1">
                        {renderEvidenceIcon(evidence.type)}
                      </div>
                    ))}
                    {caseItem.evidence.length > 3 && (
                      <span className="text-xs text-gray-500 ml-1">
                        +{caseItem.evidence.length - 3}
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex space-x-2 justify-end">
                    <button 
                      onClick={(e) => handleOpenEvidence(e, caseItem)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Lihat Bukti
                    </button>
                    <select
                      value={caseItem.status}
                      onChange={(e) => handleStatusChange(caseItem.id, e)}
                      onClick={(e) => e.stopPropagation()}
                      className={`block py-1 px-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-xs ${
                        caseItem.status === 'open' ? 'bg-red-50' :
                        caseItem.status === 'investigating' ? 'bg-yellow-50' :
                        caseItem.status === 'resolved' ? 'bg-green-50' : 'bg-gray-50'
                      }`}
                    >
                      <option value="open">Open</option>
                      <option value="investigating">Investigating</option>
                      <option value="resolved">Resolved</option>
                      <option value="closed">Closed</option>
                    </select>
                  </div>
                </td>
              </tr>
              
              {/* Expanded Row */}
              {expandedRow === caseItem.id && (
                <tr className="bg-blue-50">
                  <td colSpan="6" className="px-6 py-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">Detail Kasus</h3>
                        <p className="mt-1 text-sm text-gray-700">{caseItem.description}</p>
                        <div className="mt-2 grid grid-cols-2 gap-2">
                          <div>
                            <span className="text-xs font-medium text-gray-500">Pelapor</span>
                            <p className="text-sm">{caseItem.reporter}</p>
                          </div>
                          <div>
                            <span className="text-xs font-medium text-gray-500">Dilaporkan</span>
                            <p className="text-sm">{caseItem.reportedUser}</p>
                          </div>
                          <div>
                            <span className="text-xs font-medium text-gray-500">Kerugian</span>
                            <p className="text-sm">
                              {caseItem.amount > 0 
                                ? `Rp${caseItem.amount.toLocaleString()}` 
                                : 'Tidak ada kerugian finansial'}
                            </p>
                          </div>
                          <div>
                            <span className="text-xs font-medium text-gray-500">Tanggal</span>
                            <p className="text-sm">{caseItem.createdAt}</p>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">Bukti</h3>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {caseItem.evidence.map((evidence, idx) => (
                            <div key={idx} className="flex items-center text-sm">
                              {renderEvidenceIcon(evidence.type)}
                              <span className="ml-1 text-gray-700 capitalize">{evidence.type}</span>
                            </div>
                          ))}
                        </div>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            openEvidenceModal(caseItem);
                          }}
                          className="mt-3 text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          Lihat Detail Bukti
                        </button>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">Actions</h3>
                        <div className="mt-2 flex flex-col space-y-2">
                          <button className="inline-flex items-center justify-center px-3 py-1 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none">
                            Blokir Akun
                          </button>
                          <button className="inline-flex items-center justify-center px-3 py-1 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none">
                            Hubungi Pengguna
                          </button>
                          <button className="inline-flex items-center justify-center px-3 py-1 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none">
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
      
      {sortedCases.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500">Tidak ada kasus penipuan yang ditemukan</div>
          <div className="mt-2 text-sm text-gray-400">Coba ubah filter pencarian Anda</div>
        </div>
      )}
    </div>
  );
};

export default FraudCaseTable;