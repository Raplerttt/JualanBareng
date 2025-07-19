import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const SalesChart = ({ reports, activeTab }) => {
  const data = reports.map((report) => ({
    name: activeTab === 'daily' ? report.date : report.month,
    revenue: report.totalRevenue,
    orders: report.totalOrders,
  }));

  return (
    <div className="p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Grafik Penjualan</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip formatter={(value, name) => name === 'revenue' ? `Rp ${value.toLocaleString('id-ID')}` : value} />
          <Bar dataKey="revenue" fill="#80CBC4" name="Pendapatan" />
          <Bar dataKey="orders" fill="#4B5EAA" name="Pesanan" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default React.memo(SalesChart);