import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BugReportTable from './components/BugReportTabel';
import BugFilterPanel from './components/BugFilterPanel';

const BugReports = () => {
  const [filters, setFilters] = useState({
    search: '',
    category: 'all'
  });

  const [bugReports, setBugReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = 'http://localhost:3000/api';

  useEffect(() => {
    const fetchBugReports = async () => {
      try {
        const token = localStorage.getItem('Admintoken');
        const headers = { Authorization: `Bearer ${token}` };

        // Build query parameters based on filters
        const queryParams = new URLSearchParams();
        if (filters.search) queryParams.append('search', filters.search);
        if (filters.category !== 'all') queryParams.append('category', filters.category);

        const response = await axios.get(`${API_URL}/reports?${queryParams.toString()}`, { headers });

        setBugReports(response.data.data);
        setLoading(false);
      } catch (err) {
        setError('Gagal memuat data laporan');
        setLoading(false);
      }
    };

    fetchBugReports();
  }, [filters]); // Re-fetch when filters change

  const updateBugStatus = async (id, newStatus) => {
    try {
      const token = localStorage.getItem('Admintoken');
      const headers = { Authorization: `Bearer ${token}` };

      await axios.put(`${API_URL}/reports/${id}`, { status: newStatus }, { headers });

      setBugReports((prev) =>
        prev.map((bug) =>
          bug.id === id ? { ...bug, status: newStatus } : bug
        )
      );
    } catch (err) {
      console.error('Gagal mengupdate status laporan:', err);
    }
  };

  if (loading) return <div className="p-6 text-gray-500">Memuat laporan...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Pengaduan</h1>

      <BugFilterPanel filters={filters} setFilters={setFilters} />

      <div className="mt-6">
        <BugReportTable bugReports={bugReports} updateBugStatus={updateBugStatus} />
      </div>
    </div>
  );
};

export default BugReports;