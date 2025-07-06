import React from 'react';

const RegistrationTable = ({ registrations, updateRegistrationStatus }) => {
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) throw new Error('Invalid date');
      return date.toLocaleString('id-ID', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      }).replace(',', '');
    } catch {
      return 'Tanggal tidak valid';
    }
  };

  const handleStatusChange = (id, e) => {
    const value = e.target.value === 'true';
    updateRegistrationStatus(id, value);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      {registrations.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-500">Tidak ada pendaftaran ditemukan</div>
          <div className="mt-2 text-sm text-gray-400">Coba ubah filter pencarian Anda</div>
        </div>
      ) : (
        <div className="space-y-4">
          {registrations.map((reg) => (
            <div
              key={reg.id}
              className="border border-gray-200 rounded-md p-4 hover:bg-gray-50 transition"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Nama Toko</h3>
                  <p className="text-sm text-gray-700">{reg.storeName || '-'}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Email</h3>
                  <p className="text-sm text-gray-700">{reg.email || '-'}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Nomor Telepon</h3>
                  <p className="text-sm text-gray-700">{reg.phoneNumber || '-'}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Alamat</h3>
                  <p className="text-sm text-gray-700">{reg.address || '-'}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Kota</h3>
                  <p className="text-sm text-gray-700">{reg.city || '-'}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Tanggal Pendaftaran</h3>
                  <p className="text-sm text-gray-700">{formatDate(reg.createdAt)}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Status</h3>
                  <span
                    className={`px-2 py-1 rounded-full text-sm ${
                      reg.isVerified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {reg.isVerified ? 'Terverifikasi' : 'Menunggu Verifikasi'}
                  </span>
                </div>
                <div className="flex items-end space-x-2">
                  {!reg.isVerified && (
                    <button
                      onClick={() => updateRegistrationStatus(reg.id, true)}
                      className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition text-sm"
                    >
                      Verifikasi
                    </button>
                  )}
                  <select
                    value={reg.isVerified ? 'true' : 'false'}
                    onChange={(e) => handleStatusChange(reg.id, e)}
                    className={`py-1 px-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 text-sm ${
                      reg.isVerified ? 'bg-green-50' : 'bg-yellow-50'
                    }`}
                  >
                    <option value="false">Menunggu Verifikasi</option>
                    <option value="true">Terverifikasi</option>
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RegistrationTable;