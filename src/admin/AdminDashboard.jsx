import React from 'react';
import StatCard from './components/StatCard';

const Dashboard = () => {
  // Data dummy (nanti diganti API)
  const stats = [
    { title: 'Transaksi Hari Ini', value: '1.240', change: '+12%' },
    { title: 'Pengguna Aktif', value: '5.812', change: '+3.2%' },
    { title: 'Laporan Baru', value: '24', change: '-2%' },
    { title: 'Uptime Sistem', value: '99.8%', change: '0%' },
  ];

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      
      {/* Statistik Utama */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <StatCard 
            key={index}
            title={stat.title}
            value={stat.value}
            change={stat.change}
          />
        ))}
      </div>

      {/* Grafik & Notifikasi */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow p-6 lg:col-span-2">
          <h2 className="text-xl font-semibold mb-4">Traffic 30 Hari Terakhir</h2>
          <div className="h-72 bg-gray-100 rounded flex items-center justify-center">
            <p className="text-gray-500">[Visualisasi Grafik]</p>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Insiden Kritis</h2>
          <ul className="space-y-3">
            {[1, 2, 3].map((item) => (
              <li key={item} className="border-b pb-3 last:border-0">
                <div className="font-medium">Server Down - Payment Gateway</div>
                <div className="text-sm text-gray-500 flex justify-between mt-1">
                  <span>2 jam lalu</span>
                  <span className="text-danger font-medium">PRIORITAS TINGGI</span>
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