import React from 'react';
import MetricCard from './components/MetricCard';
import PerformanceChart from './components/PerformanceChart';
import TrafficSources from './components/TrafficSources';
import UserActivity from './components/UserActivity';

const SystemAnalytics = () => {
  // Data dummy untuk kartu metrik
  const metrics = [
    { title: 'Uptime Sistem', value: '99.8%', change: '+0.2%', icon: '🕒' },
    { title: 'Waktu Respons Rata-rata', value: '320ms', change: '-12ms', icon: '⚡' },
    { title: 'Error Rate', value: '0.4%', change: '-0.1%', icon: '⚠️' },
    { title: 'Permintaan Per Menit', value: '2.4k', change: '+320', icon: '📈' },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Analitik Sistem</h1>
      
      {/* Kartu Metrik Utama */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {metrics.map((metric, index) => (
          <MetricCard 
            key={index}
            title={metric.title}
            value={metric.value}
            change={metric.change}
            icon={metric.icon}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Grafik Kinerja */}
        <div className="bg-white rounded-xl shadow p-6 lg:col-span-2">
          <h2 className="text-xl font-semibold mb-4">Kinerja Sistem (7 Hari Terakhir)</h2>
          <PerformanceChart />
        </div>
        
        {/* Sumber Trafik */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Sumber Trafik</h2>
          <TrafficSources />
        </div>
      </div>

      {/* Aktivitas Pengguna */}
      <div className="bg-white rounded-xl shadow p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Aktivitas Pengguna</h2>
        <UserActivity />
      </div>

      {/* Log Audit */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Log Audit Terbaru</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Waktu
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pengguna
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aksi
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Detail
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {[...Array(5)].map((_, i) => (
                <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    2023-06-10 14:3{i}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    admin{i+1}@example.com
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {['Update produk', 'Hapus pengguna', 'Reset password', 'Ubah peran', 'Buat laporan'][i % 5]}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {['ID: PRD-00{i}', 'UserID: USR-00{i}', 'Email: user{i}@example.com', 'Role: seller', 'Laporan bug #00{i}'][i % 5]}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 text-center">
          <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
            Lihat Semua Log →
          </button>
        </div>
      </div>
    </div>
  );
};

export default SystemAnalytics;