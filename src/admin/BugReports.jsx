import React, { useState } from 'react';
import BugReportTable from './components/BugReportTabel';
import BugFilterPanel from './components/BugFilterPanel';

const BugReports = () => {
  const [filters, setFilters] = useState({
    status: 'all',
    priority: 'all',
    search: ''
  });

  // Data dummy (nantinya akan diganti dengan data dari API)
  const [bugReports, setBugReports] = useState([
    {
      id: 1,
      title: "Pembayaran gagal setelah OTP",
      description: "User mengalami gagal bayar setelah memasukkan OTP yang benar",
      reporter: "seller_123",
      priority: "high",
      status: "open",
      createdAt: "2023-06-01",
      assignedTo: "Dev Team A"
    },
    {
      id: 2,
      title: "Gambar produk tidak muncul",
      description: "Gambar produk hilang setelah refresh halaman",
      reporter: "buyer_456",
      priority: "medium",
      status: "in_progress",
      createdAt: "2023-06-03",
      assignedTo: "Dev Team B"
    },
    {
      id: 3,
      title: "Notifikasi tidak terkirim",
      description: "User tidak menerima notifikasi order baru",
      reporter: "seller_789",
      priority: "high",
      status: "resolved",
      createdAt: "2023-05-28",
      assignedTo: "Dev Team C"
    },
    {
      id: 4,
      title: "Error checkout",
      description: "Tombol checkout tidak responsif di browser Safari",
      reporter: "buyer_101",
      priority: "critical",
      status: "open",
      createdAt: "2023-06-05",
      assignedTo: "Dev Team A"
    }
  ]);

  // Fungsi untuk mengubah status bug
  const updateBugStatus = (id, newStatus) => {
    setBugReports(prev => prev.map(bug => 
      bug.id === id ? {...bug, status: newStatus} : bug
    ));
  };

  // Filter data berdasarkan kriteria
  const filteredBugs = bugReports.filter(bug => {
    const matchesStatus = filters.status === 'all' || bug.status === filters.status;
    const matchesPriority = filters.priority === 'all' || bug.priority === filters.priority;
    const matchesSearch = bug.title.toLowerCase().includes(filters.search.toLowerCase()) || 
                         bug.description.toLowerCase().includes(filters.search.toLowerCase());
    
    return matchesStatus && matchesPriority && matchesSearch;
  });

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Laporan Bug</h1>
        <div className="text-sm text-gray-500">
          Total: {filteredBugs.length} laporan
        </div>
      </div>

      <BugFilterPanel filters={filters} setFilters={setFilters} />
      
      <div className="mt-6 bg-white rounded-xl shadow overflow-hidden">
        <BugReportTable 
          bugReports={filteredBugs} 
          updateBugStatus={updateBugStatus} 
        />
      </div>
    </div>
  );
};

export default BugReports;