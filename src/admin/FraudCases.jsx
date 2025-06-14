import React, { useState } from 'react';
import FraudCaseTable from './components/FraudCaseTable';
import FraudFilterPanel from './components/FraudFilterPanel';
import FraudEvidenceModal from './components/FraudEvidenceModal';

const FraudCases = () => {
  const [filters, setFilters] = useState({
    status: 'all',
    severity: 'all',
    search: '',
    reporterType: 'all'
  });
  
  const [selectedCase, setSelectedCase] = useState(null);
  const [showEvidenceModal, setShowEvidenceModal] = useState(false);

  // Data dummy kasus penipuan
  const [fraudCases, setFraudCases] = useState([
    {
      id: 1,
      title: "Penipuan pembayaran COD",
      description: "Pembeli tidak membayar saat barang diterima",
      reporter: "seller_123",
      reporterType: "seller",
      reportedUser: "buyer_456",
      severity: "high",
      status: "open",
      amount: 750000,
      createdAt: "2023-06-05",
      evidence: [
        { type: "chat", content: "Percakapan WhatsApp pembeli janji bayar" },
        { type: "image", content: "Bukti pengiriman barang" }
      ]
    },
    {
      id: 2,
      title: "Akun palsu penjual",
      description: "Akun menggunakan identitas dan foto KTP orang lain",
      reporter: "buyer_789",
      reporterType: "buyer",
      reportedUser: "seller_scam",
      severity: "critical",
      status: "investigating",
      amount: 0,
      createdAt: "2023-06-03",
      evidence: [
        { type: "image", content: "Perbandingan foto KTP asli dan palsu" }
      ]
    },
    {
      id: 3,
      title: "Pembatalan transaksi setelah barang dikirim",
      description: "Pembeli membatalkan transaksi setelah barang dikirim",
      reporter: "seller_101",
      reporterType: "seller",
      reportedUser: "buyer_202",
      severity: "medium",
      status: "resolved",
      amount: 350000,
      createdAt: "2023-05-28",
      evidence: [
        { type: "system", content: "Log transaksi sistem" }
      ]
    },
    {
      id: 4,
      title: "Pengiriman barang palsu",
      description: "Penjual mengirimkan barang tiruan bukan asli",
      reporter: "buyer_303",
      reporterType: "buyer",
      reportedUser: "seller_fake",
      severity: "high",
      status: "closed",
      amount: 1200000,
      createdAt: "2023-05-25",
      evidence: [
        { type: "image", content: "Foto produk asli vs yang dikirim" },
        { type: "video", content: "Unboxing produk palsu" }
      ]
    }
  ]);

  // Fungsi untuk mengubah status kasus
  const updateCaseStatus = (id, newStatus) => {
    setFraudCases(prev => prev.map(caseItem => 
      caseItem.id === id ? {...caseItem, status: newStatus} : caseItem
    ));
  };

  // Filter data berdasarkan kriteria
  const filteredCases = fraudCases.filter(caseItem => {
    const matchesStatus = filters.status === 'all' || caseItem.status === filters.status;
    const matchesSeverity = filters.severity === 'all' || caseItem.severity === filters.severity;
    const matchesSearch = caseItem.title.toLowerCase().includes(filters.search.toLowerCase()) || 
                         caseItem.description.toLowerCase().includes(filters.search.toLowerCase());
    const matchesReporter = filters.reporterType === 'all' || caseItem.reporterType === filters.reporterType;
    
    return matchesStatus && matchesSeverity && matchesSearch && matchesReporter;
  });

  // Fungsi untuk membuka modal bukti
  const openEvidenceModal = (caseItem) => {
    setSelectedCase(caseItem);
    setShowEvidenceModal(true);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Kasus Penipuan</h1>
        <div className="text-sm text-gray-500">
          Total: {filteredCases.length} kasus
        </div>
      </div>

      <FraudFilterPanel filters={filters} setFilters={setFilters} />
      
      <div className="mt-6 bg-white rounded-xl shadow overflow-hidden">
        <FraudCaseTable 
          fraudCases={filteredCases} 
          updateCaseStatus={updateCaseStatus}
          openEvidenceModal={openEvidenceModal}
        />
      </div>
      
      {showEvidenceModal && selectedCase && (
        <FraudEvidenceModal 
          caseData={selectedCase} 
          onClose={() => setShowEvidenceModal(false)} 
        />
      )}
    </div>
  );
};

export default FraudCases;