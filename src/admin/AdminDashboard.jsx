import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { jsPDF } from 'jspdf';
import StatCard from './components/StatCard';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const [stats, setStats] = useState([]);
  const [trafficData, setTrafficData] = useState([]);
  const [incidents, setIncidents] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = 'http://localhost:3000/api';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('Admintoken');
        if (!token) throw new Error('No token found. Please log in.');

        const headers = { Authorization: `Bearer ${token}` };

        const [statsRes, trafficRes, incidentsRes, reportsRes] = await Promise.all([
          axios.get(`${API_URL}/dashboard/stats`, { headers }),
          axios.get(`${API_URL}/dashboard/traffic`, { headers }),
          axios.get(`${API_URL}/dashboard/incidents`, { headers }),
          axios.get(`${API_URL}/reports?status=PENDING`, { headers }),
        ]);

        setStats(statsRes.data);
        setTrafficData(trafficRes.data);
        setIncidents(incidentsRes.data);
        setReports(reportsRes.data.data);
        setLoading(false);
      } catch (err) {
        if (err.response?.status === 401 || err.response?.status === 403) {
          setError('Session expired or unauthorized. Please log in again.');
          localStorage.removeItem('Admintoken');
          localStorage.removeItem('user');
          localStorage.removeItem('role');
        } else {
          setError(err.message || 'Failed to fetch data');
        }
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleExportPDF = () => {
    const doc = new jsPDF();
    const revenueStat = stats.find(
      (stat) => stat.title.toLowerCase().includes('revenue') || stat.title.toLowerCase().includes('pendapatan')
    ) || {};

    // Header
    doc.setFontSize(16);
    doc.text('Revenue Statistics Report', 20, 20);
    doc.setFontSize(12);
    doc.text(`Date: ${new Date().toLocaleDateString('en-GB')}`, 20, 30);

    // Revenue Statistics
    doc.text('Revenue Statistics', 20, 50);
    doc.text(`Metric: ${revenueStat.title || 'Revenue'}`, 20, 60);
    doc.text(`Value: ${revenueStat.value || 'N/A'}`, 20, 70);
    doc.text(`Change: ${revenueStat.change || 'N/A'}`, 20, 80);

    // Traffic Data
    doc.text('Traffic Data (Last 30 Days)', 20, 100);
    let y = 110;
    trafficData.forEach((d) => {
      doc.text(`${d.date}: ${d.orders} orders`, 20, y);
      y += 10;
    });

    doc.save('revenue_report.pdf');
  };

  const chartData = {
    labels: trafficData.map((d) => d.date),
    datasets: [
      {
        label: 'Orders',
        data: trafficData.map((d) => d.orders),
        fill: false,
        borderColor: '#3b82f6',
        tension: 0.1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Traffic 30 Hari Terakhir' },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: { display: true, text: 'Number of Orders' },
      },
      x: {
        title: { display: true, text: 'Date' },
      },
    },
  };

  const criticalIncidents = [
    ...incidents,
    ...reports
      .filter((r) => r.reportType === 'BUG')
      .map((bug) => ({
        title: `BUG Report: ${bug.subjectType}`,
        time: bug.createdAt,
        priority: 'High',
      })),
  ];

  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <button
          onClick={handleExportPDF}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Export Revenue Report (PDF)
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, i) => (
          <StatCard key={i} title={stat.title} value={stat.value} change={stat.change} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow p-6 lg:col-span-2">
          <h2 className="text-xl font-semibold mb-4">Traffic 30 Hari Terakhir</h2>
          <div className="h-72">
            <Line data={chartData} options={chartOptions} />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Insiden Kritis</h2>
          <ul className="space-y-3">
            {criticalIncidents.map((incident, i) => (
              <li key={i} className="border-b pb-3 last:border-0">
                <div className="font-medium">{incident.title}</div>
                <div className="text-sm text-gray-500 flex justify-between mt-1">
                  <span>
                    {new Date(incident.time).toLocaleString('id-ID', {
                      hour: '2-digit',
                      minute: '2-digit',
                      day: 'numeric',
                      month: 'short',
                    })}
                  </span>
                  <span className="text-red-600 font-medium">{incident.priority}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;