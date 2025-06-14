import React from 'react';
import {
    XMarkIcon,
    PhotoIcon,
    VideoCameraIcon,
    DocumentTextIcon
  } from '@heroicons/react/24/outline';
  

const FraudEvidenceModal = ({ caseData, onClose }) => {
  if (!caseData) return null;

  // Render konten bukti berdasarkan tipe
  const renderEvidenceContent = (evidence) => {
    switch (evidence.type) {
      case 'image':
        return (
          <div className="bg-gray-100 rounded-lg p-4 flex items-center justify-center">
            <div className="text-center">
              <PhotographIcon className="h-16 w-16 text-gray-400 mx-auto" />
              <p className="mt-2 text-sm text-gray-500">Gambar: {evidence.content}</p>
            </div>
          </div>
        );
      case 'video':
        return (
          <div className="bg-gray-100 rounded-lg p-4 flex items-center justify-center">
            <div className="text-center">
              <VideoCameraIcon className="h-16 w-16 text-gray-400 mx-auto" />
              <p className="mt-2 text-sm text-gray-500">Video: {evidence.content}</p>
            </div>
          </div>
        );
      case 'chat':
        return (
          <div className="bg-gray-100 rounded-lg p-4">
            <div className="flex items-center">
              <DocumentTextIcon className="h-5 w-5 text-gray-500 mr-2" />
              <span className="font-medium">Percakapan</span>
            </div>
            <div className="mt-2 bg-white p-3 rounded-md">
              <p className="text-sm text-gray-700">{evidence.content}</p>
            </div>
          </div>
        );
      case 'system':
        return (
          <div className="bg-gray-100 rounded-lg p-4">
            <div className="flex items-center">
              <DocumentTextIcon className="h-5 w-5 text-gray-500 mr-2" />
              <span className="font-medium">Log Sistem</span>
            </div>
            <div className="mt-2 bg-white p-3 rounded-md font-mono text-xs overflow-x-auto">
              <pre>{evidence.content}</pre>
            </div>
          </div>
        );
      default:
        return (
          <div className="bg-gray-100 rounded-lg p-4">
            <p className="text-sm text-gray-700">{evidence.content}</p>
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-bold text-gray-800">{caseData.title}</h2>
              <p className="text-sm text-gray-500 mt-1">ID Kasus: #{caseData.id}</p>
            </div>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
          
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <h3 className="font-medium text-gray-900 mb-2">Detail Kasus</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-700">{caseData.description}</p>
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500">Pelapor</p>
                    <p className="font-medium">{caseData.reporter}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Dilaporkan</p>
                    <p className="font-medium">{caseData.reportedUser}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Kerugian</p>
                    <p className="font-medium">
                      {caseData.amount > 0 
                        ? `Rp${caseData.amount.toLocaleString()}` 
                        : 'Tidak ada kerugian finansial'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Tanggal</p>
                    <p className="font-medium">{caseData.createdAt}</p>
                  </div>
                </div>
              </div>
              
              <h3 className="font-medium text-gray-900 mt-6 mb-2">Bukti</h3>
              <div className="space-y-4">
                {caseData.evidence.map((evidence, idx) => (
                  <div key={idx} className="border border-gray-200 rounded-lg overflow-hidden">
                    {renderEvidenceContent(evidence)}
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Status Kasus</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <FraudStatusBadge status={caseData.status} />
                  <select
                    value={caseData.status}
                    onChange={(e) => {
                      // Ini akan mengupdate status di tabel utama juga
                      // Karena kita menggunakan state yang sama
                    }}
                    className={`block py-1 px-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-xs ${
                      caseData.status === 'open' ? 'bg-red-50' :
                      caseData.status === 'investigating' ? 'bg-yellow-50' :
                      caseData.status === 'resolved' ? 'bg-green-50' : 'bg-gray-50'
                    }`}
                  >
                    <option value="open">Open</option>
                    <option value="investigating">Investigating</option>
                    <option value="resolved">Resolved</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
                
                <div className="mt-6">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Tindakan</h4>
                  <div className="space-y-2">
                    <button className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none">
                      Blokir Akun
                    </button>
                    <button className="w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none">
                      Bekukan Saldo
                    </button>
                    <button className="w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none">
                      Hubungi Pengguna
                    </button>
                  </div>
                </div>
                
                <div className="mt-6">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Catatan Investigasi</h4>
                  <textarea 
                    className="w-full h-32 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Tambahkan catatan investigasi..."
                  ></textarea>
                  <button className="mt-2 w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none">
                    Simpan Catatan
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-6 flex justify-end space-x-3">
            <button 
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Tutup
            </button>
            <button className="px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700">
              Simpan Perubahan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FraudEvidenceModal;