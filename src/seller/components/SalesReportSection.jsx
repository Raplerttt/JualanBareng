import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaChartBar, FaFileExcel, FaFilePdf } from 'react-icons/fa';
import ReportList from './ReportList';
import SalesChart from './SalesChart';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable'; // Impor benar untuk autoTable

const SalesReportSection = ({ orders, sellerData, searchQuery }) => {
  const [activeTab, setActiveTab] = useState('daily');
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: '',
  });

  // Filter orders
  const filteredOrders = React.useMemo(() => {
    return orders.filter((order) => {
      const searchTerm = searchQuery.toLowerCase();
      const orderDate = new Date(order.createdAt);
      const start = dateRange.startDate ? new Date(dateRange.startDate) : null;
      const end = dateRange.endDate ? new Date(dateRange.endDate) : null;
      return (
        (order.id.toString().includes(searchTerm) ||
          order.user?.fullName?.toLowerCase().includes(searchTerm)) &&
        (!start || orderDate >= start) &&
        (!end || orderDate <= end)
      );
    });
  }, [orders, searchQuery, dateRange]);

  // Aggregate daily and monthly reports
  const dailyReports = React.useMemo(() => {
    const reports = {};
    filteredOrders.forEach((order) => {
      const date = new Date(order.createdAt).toLocaleDateString('id-ID');
      if (!reports[date]) {
        reports[date] = {
          date,
          totalOrders: 0,
          totalRevenue: 0,
          completedOrders: 0,
          cancelledOrders: 0,
          products: {},
        };
      }
      reports[date].totalOrders += 1;
      reports[date].totalRevenue += order.totalAmount || 0;
  
      if (order.status === 'SELESAI') reports[date].completedOrders += 1;
      if (order.status === 'DIBATALKAN') reports[date].cancelledOrders += 1;
  
      order.orderDetails.forEach((detail) => {
        const productName = detail.product?.productName || 'Tanpa Nama';
        reports[date].products[productName] = (reports[date].products[productName] || 0) + detail.quantity;
      });
    });
  
    return Object.values(reports).map((report) => ({
      ...report,
      topProduct: Object.entries(report.products).reduce((a, b) => (a[1] > b[1] ? a : b), ['', 0])[0] || 'N/A',
    }));
  }, [filteredOrders]);
  

  const monthlyReports = React.useMemo(() => {
    const reports = {};
    filteredOrders.forEach((order) => {
      const date = new Date(order.createdAt);
      const month = date.toLocaleString('id-ID', { month: 'long', year: 'numeric' });
      if (!reports[month]) {
        reports[month] = { month, totalOrders: 0, totalRevenue: 0, days: new Set() };
      }
      reports[month].totalOrders += 1;
      reports[month].totalRevenue += order.totalAmount || 0;
      reports[month].days.add(date.toLocaleDateString('id-ID'));
    });
    return Object.values(reports).map((report) => ({
      ...report,
      avgDailyRevenue: report.totalRevenue / report.days.size,
    }));
  }, [filteredOrders]);

  const loadImageFromUrl = (url) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'Anonymous'; // penting jika ambil dari server
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        const dataUrl = canvas.toDataURL('image/jpeg'); // bisa ganti png jika perlu
        resolve(dataUrl);
      };
      img.onerror = reject;
      img.src = url;
    });
  };

  // Export to Excel
  const exportToExcel = () => {
    const data = activeTab === 'daily' ? dailyReports.map((report) => ({
      Tanggal: report.date,
      'Jumlah Pesanan': report.totalOrders,
      'Total Pendapatan': `Rp ${report.totalRevenue.toLocaleString('id-ID')}`,
      'Pesanan Selesai': report.completedOrders,
      'Pesanan Dibatalkan': report.cancelledOrders,
      'Produk Terlaris': report.topProduct,
    })) : monthlyReports.map((report) => ({
      Bulan: report.month,
      'Jumlah Pesanan': report.totalOrders,
      'Total Pendapatan': `Rp ${report.totalRevenue.toLocaleString('id-ID')}`,
      'Rata-rata Pendapatan Harian': `Rp ${Math.round(report.avgDailyRevenue).toLocaleString('id-ID')}`,
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, activeTab === 'daily' ? 'Laporan Harian' : 'Laporan Bulanan');
    worksheet['!cols'] = activeTab === 'daily' ? [
      { wch: 15 }, // Tanggal
      { wch: 15 }, // Jumlah Pesanan
      { wch: 20 }, // Total Pendapatan
      { wch: 15 }, // Pesanan Selesai
      { wch: 15 }, // Pesanan Dibatalkan
      { wch: 20 }, // Produk Terlaris
    ] : [
      { wch: 20 }, // Bulan
      { wch: 15 }, // Jumlah Pesanan
      { wch: 20 }, // Total Pendapatan
      { wch: 25 }, // Rata-rata Pendapatan Harian
    ];
    XLSX.writeFile(workbook, `Laporan_Penjualan_${activeTab === 'daily' ? 'Harian' : 'Bulanan'}_${new Date().toLocaleDateString('id-ID')}.xlsx`);
  };

  // Export to PDF using jsPDF
  const exportToPDF = async () => {
    const doc = new jsPDF();
    const data = activeTab === 'daily' ? dailyReports : monthlyReports;

    const storeName = sellerData?.storeName || 'Toko';
    const storeAddress = sellerData?.address || 'Alamat belum tersedia';
    const contact = sellerData?.phoneNumber || '-';
    const email = sellerData?.email || '-';
    
    const logo = sellerData?.photo; // path relative seperti "uploads/xxx.jpeg"
    const isBase64Image = /^data:image\/(png|jpe?g);base64,/.test(logo || '');
    
    try {
      if (logo) {
        if (isBase64Image) {
          // Jika logo dalam format base64
          doc.addImage(logo, 'JPEG', 14, 10, 30, 30);
        } else {
          // Jika logo adalah path ke file yang dihosting
          const imageUrl = `http://localhost:3000/${logo}`;
          const img = await loadImageFromUrl(imageUrl);
          doc.addImage(img, 'JPEG', 14, 10, 30, 30);
        }
      }
    } catch (error) {
      console.warn('Logo tidak bisa dimuat:', error.message);
    }

    // Kop Surat
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(storeName, 50, 15);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text(storeAddress, 50, 22);
    doc.text(`Kontak: ${contact}`, 50, 28);
    doc.text(`Email: ${email}`, 50, 34);

    // Garis pemisah
    doc.setLineWidth(0.5);
    doc.line(14, 40, 195, 40);

    // Judul Laporan
    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.text(`Laporan Penjualan ${activeTab === 'daily' ? 'Harian' : 'Bulanan'}`, 14, 50);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Tanggal Cetak: ${new Date().toLocaleDateString('id-ID')}`, 14, 56);

    // Tabel menggunakan autoTable
    autoTable(doc, {
      startY: 65,
      head: activeTab === 'daily'
        ? [['Tanggal', 'Jumlah Pesanan', 'Total Pendapatan', 'Pesanan Selesai', 'Dibatalkan', 'Produk Terlaris']]
        : [['Bulan', 'Jumlah Pesanan', 'Total Pendapatan', 'Rata-rata Harian']],
      body: data.map((report) => activeTab === 'daily' ? [
        report.date || '-',
        report.totalOrders || 0,
        `Rp ${(report.totalRevenue || 0).toLocaleString('id-ID')}`,
        report.completedOrders || 0,
        report.cancelledOrders || 0,
        report.topProduct || 'N/A'
      ] : [
        report.month || '-',
        report.totalOrders || 0,
        `Rp ${(report.totalRevenue || 0).toLocaleString('id-ID')}`,
        `Rp ${Math.round(report.avgDailyRevenue || 0).toLocaleString('id-ID')}`
      ]),
      theme: 'grid',
      headStyles: { fillColor: '#80CBC4', textColor: '#000000' },
      styles: { fontSize: 10 },
      margin: { top: 65 },
    });

    // Simpan file
    doc.save(`Laporan_Penjualan_${activeTab === 'daily' ? 'Harian' : 'Bulanan'}_${new Date().toLocaleDateString('id-ID')}.pdf`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
    >
      <div className="p-5 border-b border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="flex items-center mb-4 md:mb-0">
            <FaChartBar className="text-indigo-600 mr-3 text-xl" />
            <h2 className="text-xl font-semibold text-gray-800">
              Laporan Penjualan
              <span className="ml-2 text-sm bg-indigo-100 text-indigo-800 px-2.5 py-0.5 rounded-full">
                {filteredOrders.length} pesanan
              </span>
            </h2>
          </div>
          <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
            <div className="flex space-x-4">
              <button
                onClick={() => setActiveTab('daily')}
                className={`px-4 py-2 rounded-md font-medium ${
                  activeTab === 'daily'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                } transition-colors`}
              >
                Harian
              </button>
              <button
                onClick={() => setActiveTab('monthly')}
                className={`px-4 py-2 rounded-md font-medium ${
                  activeTab === 'monthly'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                } transition-colors`}
              >
                Bulanan
              </button>
            </div>
            <div className="flex space-x-4">
              <div className="flex space-x-2">
                <input
                  type="date"
                  value={dateRange.startDate}
                  onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
                <input
                  type="date"
                  value={dateRange.endDate}
                  onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={exportToExcel}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center"
              >
                <FaFileExcel className="mr-2" />
                Ekspor Excel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={exportToPDF}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center"
              >
                <FaFilePdf className="mr-2" />
                Ekspor PDF
              </motion.button>
            </div>
          </div>
        </div>
      </div>
      <SalesChart reports={activeTab === 'daily' ? dailyReports : monthlyReports} activeTab={activeTab} />
      <ReportList reports={activeTab === 'daily' ? dailyReports : monthlyReports} activeTab={activeTab} searchQuery={searchQuery} />
    </motion.div>
  );
};

export default SalesReportSection;