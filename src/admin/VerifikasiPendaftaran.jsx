import React, { useState, useEffect } from 'react';
import axios from 'axios';
import RegistrationTable from './components/RegistrasiTabel';
import RegistrationFilterPanel from './components/RegistrasiFilterPanel';

const VerifikasiPendaftaran = () => {
  const [filters, setFilters] = useState({
    status: 'all',
    search: '',
  });
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // 'all' | 'pending'

  const API_URL = 'http://localhost:3000/api';

  const fetchSellers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('Admintoken');
      const headers = { Authorization: ` Bearer ${token}` };

      const url = filter === 'pending' ? `${API_URL}/seller/pending` : `${API_URL}/seller`;

      const response = await axios.get(url, { headers });
      setRegistrations(response.data.data || []);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal memuat data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSellers();
  }, [filter]);

  const updateRegistrationStatus = async (id, isVerified) => {
    try {
      const token = localStorage.getItem('Admintoken');
      const headers = { Authorization: `Bearer ${token}` };

      await axios.put(`${API_URL}/seller/verify/${id}`, { isVerified }, { headers });

      // Optimistic update
      setRegistrations((prev) =>
        prev.map((reg) =>
          reg.id === id ? { ...reg, isVerified } : reg
        )
      );

      // Optional: Re-fetch to ensure sync with backend
      await fetchSellers();
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal mengupdate status pendaftaran');
      console.error('Gagal mengupdate status:', err);
    }
  };

  const filteredRegistrations = registrations.filter((reg) => {
    const matchesStatus =
      filters.status === 'all' ||
      (filters.status === 'Verified' && reg.isVerified) ||
      (filters.status === 'Pending' && !reg.isVerified);
    const matchesSearch =
      (reg.storeName?.toLowerCase() || '').includes(filters.search.toLowerCase()) ||
      (reg.email?.toLowerCase() || '').includes(filters.search.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  if (loading) return <div className="p-6">Memuat data pendaftaran...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Verifikasi Pendaftaran</h1>

      <RegistrationFilterPanel
        filters={filters}
        setFilters={setFilters}
        filter={filter}
        setFilter={setFilter}
      />

      <RegistrationTable
        registrations={filteredRegistrations}
        updateRegistrationStatus={updateRegistrationStatus}
      />
    </div>
  );
};

export default VerifikasiPendaftaran;