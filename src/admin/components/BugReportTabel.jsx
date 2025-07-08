import React, { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";
import BugStatusBadge from "./BugStatusBadge";
import toast from "react-hot-toast";

const BugReportTable = ({ bugReports, updateBugStatus }) => {
  const [sortConfig, setSortConfig] = useState({ key: "createdAt", direction: "desc" });
  const [expandedRow, setExpandedRow] = useState(null);

  // Derive senderType and reporter from bug data
  const processedBugs = bugReports.map((bug) => ({
    ...bug,
    senderType: bug.user?.role || (bug.sellerId ? "SELLER" : "USER"), // Infer senderType from user.role or sellerId
    reporter: bug.user?.fullName || "Tidak diketahui", // Use user.fullName for reporter
  }));

  // Sorting logic
  const sortedBugs = React.useMemo(() => {
    let sortableItems = [...processedBugs];
    if (sortConfig.key) {
      sortableItems.sort((a, b) => {
        const aValue = a[sortConfig.key] || "";
        const bValue = b[sortConfig.key] || "";
        if (aValue < bValue) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [processedBugs, sortConfig]);

  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const handleStatusChange = async (id, e) => {
    const newStatus = e.target.value;
    try {
      await updateBugStatus(id, newStatus);
      toast.success(`Status laporan diperbarui ke ${newStatus}`);
    } catch (error) {
      toast.error("Gagal memperbarui status laporan");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="overflow-x-auto bg-white rounded-2xl shadow-lg"
    >
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => requestSort("title")}
            >
              <div className="flex items-center">
                Laporan
                {sortConfig.key === "title" &&
                  (sortConfig.direction === "asc" ? (
                    <ChevronUpIcon className="ml-1 h-4 w-4" />
                  ) : (
                    <ChevronDownIcon className="ml-1 h-4 w-4" />
                  ))}
              </div>
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => requestSort("reportType")}
            >
              <div className="flex items-center">
                Jenis Laporan
                {sortConfig.key === "reportType" &&
                  (sortConfig.direction === "asc" ? (
                    <ChevronUpIcon className="ml-1 h-4 w-4" />
                  ) : (
                    <ChevronDownIcon className="ml-1 h-4 w-4" />
                  ))}
              </div>
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => requestSort("subjectType")}
            >
              <div className="flex items-center">
                Subjek
                {sortConfig.key === "subjectType" &&
                  (sortConfig.direction === "asc" ? (
                    <ChevronUpIcon className="ml-1 h-4 w-4" />
                  ) : (
                    <ChevronDownIcon className="ml-1 h-4 w-4" />
                  ))}
              </div>
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Status
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => requestSort("createdAt")}
            >
              <div className="flex items-center">
                Dilaporkan
                {sortConfig.key === "createdAt" &&
                  (sortConfig.direction === "asc" ? (
                    <ChevronUpIcon className="ml-1 h-4 w-4" />
                  ) : (
                    <ChevronDownIcon className="ml-1 h-4 w-4" />
                  ))}
              </div>
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => requestSort("senderType")}
            >
              <div className="flex items-center">
                Pengirim
                {sortConfig.key === "senderType" &&
                  (sortConfig.direction === "asc" ? (
                    <ChevronUpIcon className="ml-1 h-4 w-4" />
                  ) : (
                    <ChevronDownIcon className="ml-1 h-4 w-4" />
                  ))}
              </div>
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Ditugaskan ke
            </th>
            <th scope="col" className="relative px-6 py-3">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {sortedBugs.map((bug) => (
            <React.Fragment key={bug.id}>
              <tr
                className="hover:bg-gray-50 cursor-pointer"
                onClick={() => setExpandedRow(expandedRow === bug.id ? null : bug.id)}
              >
                <td className="px-6 py-4">
                  <div className="font-medium text-gray-900">{bug.title}</div>
                  <div className="text-sm text-gray-500 truncate max-w-xs">{bug.description}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      bug.reportType === "BUG"
                        ? "bg-blue-100 text-blue-800"
                        : bug.reportType === "FRAUD"
                        ? "bg-red-100 text-red-800"
                        : bug.reportType === "ABUSE"
                        ? "bg-orange-100 text-orange-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {bug.reportType
                      ? bug.reportType.charAt(0).toUpperCase() + bug.reportType.slice(1).toLowerCase()
                      : "Unknown"}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      bug.subjectType === "PRODUCT"
                        ? "bg-green-100 text-green-800"
                        : bug.subjectType === "SELLER"
                        ? "bg-yellow-100 text-yellow-800"
                        : bug.subjectType === "ORDER"
                        ? "bg-purple-100 text-purple-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {bug.subjectType
                      ? bug.subjectType.charAt(0).toUpperCase() + bug.subjectType.slice(1).toLowerCase()
                      : "Unknown"}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <BugStatusBadge status={bug.status} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(bug.createdAt).toLocaleDateString("id-ID", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {bug.senderType
                    ? bug.senderType.charAt(0).toUpperCase() + bug.senderType.slice(1).toLowerCase()
                    : "Unknown"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {bug.assignedTo || "Belum ditugaskan"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <motion.select
                    whileFocus={{ scale: 1.02 }}
                    value={bug.status}
                    onChange={(e) => handleStatusChange(bug.id, e)}
                    onClick={(e) => e.stopPropagation()}
                    className={`block w-full py-1 px-2 border border-gray-300 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 text-xs ${
                      bug.status === "PENDING"
                        ? "bg-yellow-50"
                        : bug.status === "IN_PROGRESS"
                        ? "bg-blue-50"
                        : bug.status === "RESOLVED"
                        ? "bg-green-50"
                        : "bg-red-50"
                    }`}
                  >
                    <option value="PENDING">Pending</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="RESOLVED">Resolved</option>
                    <option value="REJECTED">Rejected</option>
                  </motion.select>
                </td>
              </tr>

              {/* Expanded Row */}
              {expandedRow === bug.id && (
                <tr className="bg-indigo-50">
                  <td colSpan="8" className="px-6 py-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">Detail Laporan</h3>
                        <p className="mt-1 text-sm text-gray-700">{bug.description}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">Pelapor</h3>
                        <p className="mt-1 text-sm text-gray-700">
                          {bug.senderType
                            ? bug.senderType.charAt(0).toUpperCase() +
                              bug.senderType.slice(1).toLowerCase()
                            : "Unknown"}{" "}
                          - {bug.reporter}
                        </p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">Aksi</h3>
                        <div className="mt-2 flex space-x-2">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
                          >
                            Tugaskan ke Saya
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="inline-flex items-center px-3 py-1 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                          >
                            Tambah Catatan
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>

      {sortedBugs.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500">Tidak ada laporan yang ditemukan</div>
          <div className="mt-2 text-sm text-gray-400">Coba ubah filter pencarian Anda</div>
        </div>
      )}
    </motion.div>
  );
};

export default BugReportTable;