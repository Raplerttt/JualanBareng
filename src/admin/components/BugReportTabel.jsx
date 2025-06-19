import React, { useState } from 'react';
import BugStatusBadge from './BugStatusBadge';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';

const BugReportTable = ({ bugReports, updateBugStatus }) => {
  const [sortConfig, setSortConfig] = useState({ key: 'createdAt', direction: 'desc' });
  const [expandedRow, setExpandedRow] = useState(null);

  // Fungsi untuk sorting
  const sortedBugs = React.useMemo(() => {
    let sortableItems = [...bugReports];
    if (sortConfig.key) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [bugReports, sortConfig]);

  // Fungsi untuk mengubah sorting
  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Fungsi untuk mengubah status
  const handleStatusChange = (id, e) => {
    updateBugStatus(id, e.target.value);
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th 
              scope="col" 
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => requestSort('title')}
            >
              <div className="flex items-center">
                Bug Report
                {sortConfig.key === 'title' && (
                  sortConfig.direction === 'asc' ? 
                  <ChevronUpIcon className="ml-1 h-4 w-4" /> : 
                  <ChevronDownIcon className="ml-1 h-4 w-4" />
                )}
              </div>
            </th>
            <th 
              scope="col" 
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => requestSort('priority')}
            >
              <div className="flex items-center">
                Prioritas
                {sortConfig.key === 'priority' && (
                  sortConfig.direction === 'asc' ? 
                  <ChevronUpIcon className="ml-1 h-4 w-4" /> : 
                  <ChevronDownIcon className="ml-1 h-4 w-4" />
                )}
              </div>
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th 
              scope="col" 
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => requestSort('createdAt')}
            >
              <div className="flex items-center">
                Dilaporkan
                {sortConfig.key === 'createdAt' && (
                  sortConfig.direction === 'asc' ? 
                  <ChevronUpIcon className="ml-1 h-4 w-4" /> : 
                  <ChevronDownIcon className="ml-1 h-4 w-4" />
                )}
              </div>
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
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
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  bug.priority === 'critical' ? 'bg-purple-100 text-purple-800' :
                  bug.priority === 'high' ? 'bg-red-100 text-red-800' :
                  bug.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {bug.priority
                    ? bug.priority.charAt(0).toUpperCase() + bug.priority.slice(1)
                    : 'Unknown'}
                </span>

                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <BugStatusBadge status={bug.status} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {bug.createdAt}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {bug.assignedTo}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <select
                    value={bug.status}
                    onChange={(e) => handleStatusChange(bug.id, e)}
                    onClick={(e) => e.stopPropagation()}
                    className={`block w-full py-1 px-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-xs ${
                      bug.status === 'open' ? 'bg-red-50' :
                      bug.status === 'in_progress' ? 'bg-yellow-50' :
                      bug.status === 'resolved' ? 'bg-green-50' : 'bg-gray-50'
                    }`}
                  >
                    <option value="open">Open</option>
                    <option value="in_progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                    <option value="closed">Closed</option>
                  </select>
                </td>
              </tr>
              
              {/* Expanded Row */}
              {expandedRow === bug.id && (
                <tr className="bg-blue-50">
                  <td colSpan="6" className="px-6 py-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">Detail Laporan</h3>
                        <p className="mt-1 text-sm text-gray-700">{bug.description}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">Reporter</h3>
                        <p className="mt-1 text-sm text-gray-700">{bug.reporter}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">Actions</h3>
                        <div className="mt-2 flex space-x-2">
                          <button className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none">
                            Assign to Me
                          </button>
                          <button className="inline-flex items-center px-3 py-1 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none">
                            Add Note
                          </button>
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
          <div className="text-gray-500">Tidak ada laporan bug yang ditemukan</div>
          <div className="mt-2 text-sm text-gray-400">Coba ubah filter pencarian Anda</div>
        </div>
      )}
    </div>
  );
};

export default BugReportTable;