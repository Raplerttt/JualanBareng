import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSpinner, FaRedo } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import RegistrationTable from './components/RegistrasiTabel';
import RegistrationFilterPanel from './components/RegistrasiFilterPanel';

const VerifikasiPendaftaran = () => {
  const [filters, setFilters] = useState({
    status: 'ALL',
    search: '',
  });
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({ totalPages: 1, totalSellers: 0 });

  const API_URL = 'http://localhost:3000/api';

  const fetchSellers = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('Admintoken');
      if (!token) throw new Error('Token autentikasi tidak ditemukan');
      const headers = { Authorization: `Bearer ${token}` };

      console.log('Fetching with filters:', { page, status: filters.status, search: filters.search });

      const response = await axios.get(`${API_URL}/seller`, {
        headers,
        params: {
          page,
          limit: 10,
          status: filters.status,
          search: filters.search,
        },
      });

      console.log('API Response:', response.data);

      setRegistrations(response.data.data || []);
      setMeta(response.data.meta || { totalPages: 1, totalSellers: 0 });
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Gagal memuat data pendaftaran';
      setError(errorMessage);
      toast.error(errorMessage);
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSellers();
  }, [page, filters.status, filters.search]);

  const handleSetFilters = (newFilters) => {
    console.log('Parent received filters:', newFilters);
    setFilters(newFilters);
    setPage(1); // Reset to page 1 when filters change
  };

  const updateRegistrationStatus = async (id, verificationStatus) => {
    const previousRegistrations = [...registrations]; // ✅ Move here
  
    try {
      const token = localStorage.getItem('Admintoken');
      const headers = { Authorization: `Bearer ${token}` };
  
      setRegistrations((prev) =>
        prev.map((reg) =>
          reg.id === id ? { ...reg, verificationStatus } : reg
        )
      );
  
      await axios.put(`${API_URL}/seller/verify/${id}`, { verificationStatus }, { headers });
  
      toast.success(`Status pendaftaran #${id} diperbarui`);
    } catch (err) {
      // ❗️Sekarang aman, karena previousRegistrations sudah pasti terdefinisi
      setRegistrations(previousRegistrations);
  
      const errorMessage = err.response?.data?.message || 'Gagal mengupdate status pendaftaran';
      toast.error(errorMessage);
      console.error('Gagal mengupdate status:', err);
      throw err;
    }
  };
  

  return (
    <div className="p-6 sm:p-8 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-6 bg-gradient-to-r from-[#80CBC4]/20 to-[#4DB6AC]/20 p-3 rounded-lg">
          Verifikasi Pendaftaran
        </h1>
      </motion.div>

      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center justify-center py-12 bg-white rounded-xl shadow-sm"
            role="alert"
            aria-live="polite"
          >
            <FaSpinner className="animate-spin h-6 w-6 text-blue-600 mr-2" aria-hidden="true" />
            <span className="text-gray-600 text-lg">Memuat data pendaftaran...</span>
          </motion.div>
        )}
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center justify-between py-4 px-6 bg-red-50 text-red-700 rounded-xl shadow-sm"
            role="alert"
            aria-live="assertive"
          >
            <span>{error}</span>
            <button
              onClick={fetchSellers}
              className="flex items-center px-3 py-1 bg-red-100 text-red-800 rounded-md hover:bg-red-200 transition-colors"
              aria-label="Coba lagi memuat data"
            >
              <FaRedo className="h-4 w-4 mr-2" aria-hidden="true" />
              Coba Lagi
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {!loading && !error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <RegistrationFilterPanel
            totalSellers={meta.totalSellers}
            filters={filters}
            setFilters={handleSetFilters}
            isFiltering={loading}
          />
          <RegistrationTable
            registrations={registrations}
            updateRegistrationStatus={updateRegistrationStatus}
          />
          {meta.totalPages > 1 && (
            <div className="flex justify-between items-center mt-4">
              <button
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                disabled={page === 1}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Halaman sebelumnya"
              >
                Sebelumnya
              </button>
              <span className="text-sm text-gray-600">
                Halaman {meta.currentPage} dari {meta.totalPages} ({meta.totalSellers} pendaftaran)
              </span>
              <button
                onClick={() => setPage((prev) => Math.min(prev + 1, meta.totalPages))}
                disabled={page === meta.totalPages}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Halaman berikutnya"
              >
                Berikutnya
              </button>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default VerifikasiPendaftaran;