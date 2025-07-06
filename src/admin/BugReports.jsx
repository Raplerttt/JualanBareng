import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BugReportTable from './components/BugReportTabel';
import BugFilterPanel from './components/BugFilterPanel';

const BugReports = () => {
  const [filters, setFilters] = useState({
    status: 'all',
    priority: 'all',
    search: ''
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

        const response = await axios.get(`${API_URL}/reports?reportType=BUG`, { headers });

        setBugReports(response.data.data);
        setLoading(false);
      } catch (err) {
        setError('Gagal memuat data bug');
        setLoading(false);
      }
    };

    fetchBugReports();
  }, []);

  const updateBugStatus = async (id, newStatus) => {
    try {
      const token = localStorage.getItem('Admintoken');
      const headers = { Authorization: `Bearer ${token}` };

      await axios.put(`${API_URL}/reports/${id}`, { status: newStatus }, { headers });

      setBugReports(prev =>
        prev.map(bug =>
          bug.id === id ? { ...bug, status: newStatus } : bug
        )
      );
    } catch (err) {
      console.error('Gagal mengupdate status bug:', err);
    }
  };

  const search = (filters.search || '').toLowerCase();

  const filteredBugs = bugReports.filter(bug => {
    const matchesStatus = filters.status === 'all' || bug.status === filters.status;
    const matchesPriority = filters.priority === 'all' || bug.priority === filters.priority;
    const matchesSearch =
      (bug.title?.toLowerCase() || '').includes(search) ||
      (bug.description?.toLowerCase() || '').includes(search);

    return matchesStatus && matchesPriority && matchesSearch;
  });

  if (loading) return <div className="p-6">Memuat laporan bug...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Laporan</h1>

      <BugFilterPanel filters={filters} setFilters={setFilters} />

      <BugReportTable bugReports={filteredBugs} updateBugStatus={updateBugStatus} />
    </div>
  );
};

export default BugReports;
