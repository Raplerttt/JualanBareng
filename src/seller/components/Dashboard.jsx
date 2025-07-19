import React, { useState, useEffect, useMemo, useContext } from 'react';
import { FaChartLine } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import {
  Chart as ChartJS,
  LinearScale,
  CategoryScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Chart } from 'react-chartjs-2';
import { AuthContext } from '../../auth/authContext';
import { AuthService } from '../../auth/authService';

ChartJS.register(LinearScale, CategoryScale, PointElement, LineElement, Tooltip, Legend, Filler);

const Dashboard = () => {
  const { user, isAuthenticated, logout } = useContext(AuthContext);
  const [timeRange, setTimeRange] = useState(7);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Validate seller authentication
  useEffect(() => {
    if (!isAuthenticated || !user || user.role !== 'SELLER') {
      toast.error('Silakan login sebagai penjual');
      window.location.href = '/seller/login';
    }
  }, [isAuthenticated, user]);

  // Fetch data from backend
  useEffect(() => {
    if (!isAuthenticated || !user || user.role !== 'SELLER') return;

    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [productsRes, ordersRes] = await Promise.all([
          AuthService.getProducts(),
          AuthService.getOrders(),
        ]);

        setProducts(productsRes.data || []);
        setOrders(ordersRes.data || []);
      } catch (err) {
        const errorMessage = err.message || 'Gagal memuat data dari server';
        setError(errorMessage);
        toast.error(errorMessage);
        if (err.message === 'Token expired') {
          logout();
          window.location.href = '/seller/login';
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [isAuthenticated, user, logout]);

  const calculateAverageRating = (products) => {
    if (!products.length) return 0;
    const total = products.reduce((sum, p) => sum + (p.rating || 0), 0);
    return (total / products.length).toFixed(1);
  };

  // Hitung data pendapatan berdasarkan timeRange
  const { labels, dataPoints } = useMemo(() => {
    const labels = [];
    const dataPoints = [];

    for (let i = timeRange - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const iso = date.toISOString().split('T')[0];
      const label = date.toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric' });

      labels.push(label);

      const dailyRevenue = orders
        .filter((order) => order.createdAt?.startsWith(iso))
        .reduce((sum, order) => sum + (order.totalAmount || 0), 0);

      dataPoints.push(dailyRevenue);
    }

    return { labels, dataPoints };
  }, [orders, timeRange]);

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Pendapatan (Rp)',
        data: dataPoints,
        borderColor: '#80CBC4',
        backgroundColor: 'rgba(128, 203, 196, 0.1)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: { beginAtZero: true, title: { display: true, text: 'Pendapatan (Rp)' } },
      x: { title: { display: true, text: 'Tanggal' } },
    },
    plugins: {
      legend: { display: true, position: 'top' },
      tooltip: {
        callbacks: {
          label: (context) => `Rp ${context.parsed.y.toLocaleString('id-ID')}`,
        },
      },
    },
  };

  const productSales = useMemo(() => {
    return products
      .map((product) => ({
        ...product,
        totalSold: orders.reduce((sum, order) => {
          const od = order.orderDetails?.find((o) => o.productId === product.id);
          return sum + (od?.quantity || 0);
        }, 0),
      }))
      .sort((a, b) => b.totalSold - a.totalSold)
      .slice(0, 3);
  }, [products, orders]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Memuat...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="bg-white p-5 rounded-xl shadow-sm border border-gray-100"
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-xl font-semibold text-gray-800 flex items-center">
          <FaChartLine className="mr-2 text-[#80CBC4]" /> Dashboard
        </h2>
        <div className="text-sm text-gray-500">
          Terakhir diperbarui: {new Date().toLocaleDateString('id-ID', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
          })}
        </div>
      </div>

      {/* Statistik Ringkasan */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
        <div className="bg-[#80CBC4]/10 p-4 rounded-lg border border-[#80CBC4]/20">
          <h3 className="text-lg font-semibold text-[#80CBC4] mb-2">Ringkasan Produk</h3>
          <p className="text-gray-600">Total Produk: {products.length}</p>
          <p className="text-gray-600">Stok: {products.reduce((sum, p) => sum + (p.stock || 0), 0)}</p>
          <p className="text-gray-600">Rata-rata Rating: {calculateAverageRating(products)}</p>
        </div>
        <div className="bg-[#80CBC4]/10 p-4 rounded-lg border border-[#80CBC4]/20">
          <h3 className="text-lg font-semibold text-[#80CBC4] mb-2">Ringkasan Order</h3>
          <p className="text-gray-600">Total Order: {orders.length}</p>
          <p className="text-gray-600">Pending: {orders.filter((o) => o.status === 'PENDING').length}</p>
          <p className="text-gray-600">
            Total Pendapatan: Rp {orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0).toLocaleString('id-ID')}
          </p>
        </div>
        <div className="bg-[#80CBC4]/10 p-4 rounded-lg border border-[#80CBC4]/20">
          <h3 className="text-lg font-semibold text-[#80CBC4] mb-2">Produk Teratas</h3>
          {productSales.length > 0 ? (
            <ul className="text-gray-600 text-sm space-y-1">
              {productSales.map((product) => (
                <li key={product.id}>
                  {product.productName}: {product.totalSold} terjual
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600 text-sm">Tidak ada data penjualan</p>
          )}
        </div>
      </div>

      {/* Grafik Pendapatan */}
      <div className="bg-white p-4 rounded-lg border border-gray-100">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Pendapatan ({timeRange} Hari Terakhir)</h3>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(Number(e.target.value))}
            className="border border-gray-300 rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-[#80CBC4]"
          >
            <option value={7}>7 Hari</option>
            <option value={30}>30 Hari</option>
            <option value={90}>90 Hari</option>
          </select>
        </div>
        <div className="h-80">
          <Chart type="line" data={chartData} options={chartOptions} />
        </div>
      </div>
    </motion.div>
  );
};

export default Dashboard;