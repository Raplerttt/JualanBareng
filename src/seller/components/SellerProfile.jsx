import React, { useState, useEffect, useContext } from 'react';
import { FaUser, FaCamera, FaTimes, FaEdit, FaCheckCircle, FaSpinner } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import ProfileConfirmModal from './ProfileConfirmModal';
import { AuthService } from '../../auth/authService';
import { AuthContext } from '../../auth/authContext';

const SellerProfile = ({ sellerData = {}, setSellerData }) => {
  const { user } = useContext(AuthContext);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    storeName: '',
    phoneNumber: '',
    address: '',
    city: '',
    photo: null,
  });
  const [errors, setErrors] = useState({});
  const [profilePicPreview, setProfilePicPreview] = useState('https://via.placeholder.com/150');
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);

  useEffect(() => {
    const fetchSeller = async () => {
      if (!user?.id) {
        toast.error('Silakan login untuk melihat profil Anda.', {
          style: { background: '#EF5350', color: '#fff' },
        });
        setLoading(false);
        return;
      }
      try {
        const data = await AuthService.getSellerMe();
        console.log('Fetched seller data:', data); // Debugging
        if (!data?.id) {
          throw new Error('Data seller tidak valid');
        }
        const updatedSellerData = {
          id: data.id || '',
          storeName: data.storeName || '',
          email: data.email || '',
          phoneNumber: data.phoneNumber || '',
          address: data.address || '',
          city: data.city || '',
          photo: data.photoBase64 || data.photo || '',
          isVerified: data.verificationStatus,
        };
        setSellerData(updatedSellerData);
        setFormData({
          storeName: updatedSellerData.storeName,
          phoneNumber: updatedSellerData.phoneNumber,
          address: updatedSellerData.address,
          city: updatedSellerData.city,
          photo: null,
        });
        setProfilePicPreview(
          updatedSellerData.photo
            ? updatedSellerData.photo.startsWith('data:image')
              ? updatedSellerData.photo // Base64
              : `http://localhost:3000/${updatedSellerData.photo}` // Path file
            : 'https://via.placeholder.com/150?text=No+Image'
        );
        setLoading(false);
      } catch (error) {
        console.error('Fetch error:', error); // Debugging
        toast.error(error.message || 'Gagal memuat profil seller.', {
          style: { background: '#EF5350', color: '#fff' },
        });
        setLoading(false);
      }
    };
    fetchSeller();
  }, [user, setSellerData]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.storeName.trim()) newErrors.storeName = 'Nama toko wajib diisi';
    if (!formData.phoneNumber.trim()) newErrors.phoneNumber = 'Nomor telepon wajib diisi';
    else if (!/^\d{10,13}$/.test(formData.phoneNumber.trim()))
      newErrors.phoneNumber = 'Nomor telepon harus 10-13 digit';
    if (!formData.address.trim()) newErrors.address = 'Alamat wajib diisi';
    if (!formData.city.trim()) newErrors.city = 'Kota wajib diisi';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const convertFileToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error('Periksa kembali isian form Anda.', {
        style: { background: '#EF5350', color: '#fff' },
      });
      return;
    }

    if (!user?.id) {
      toast.error('Silakan login untuk memperbarui profil.', {
        style: { background: '#EF5350', color: '#fff' },
      });
      return;
    }

    try {
      setSubmitLoading(true);
      let payload = {};
      let photoBase64 = null;

      // Validasi dan konversi foto ke base64
      if (formData.photo) {
        if (formData.photo.size > 2 * 1024 * 1024) {
          throw new Error('Ukuran file melebihi batas 2MB');
        }
        if (!['image/jpeg', 'image/png', 'image/jpg'].includes(formData.photo.type)) {
          throw new Error('File harus berupa JPEG atau PNG');
        }
        photoBase64 = await convertFileToBase64(formData.photo);
        if (!photoBase64.match(/^data:image\/(png|jpeg|jpg);base64,/)) {
          throw new Error('Format gambar tidak valid (harus PNG atau JPEG)');
        }
        payload.photoBase64 = photoBase64;
      }

      // Tambahkan field yang berubah ke payload
      if (formData.storeName !== sellerData.storeName) payload.storeName = formData.storeName.trim();
      if (formData.phoneNumber !== sellerData.phoneNumber) payload.phoneNumber = formData.phoneNumber.trim();
      if (formData.address !== sellerData.address) payload.address = formData.address.trim();
      if (formData.city !== sellerData.city) payload.city = formData.city.trim();

      // Jika tidak ada perubahan
      if (Object.keys(payload).length === 0) {
        toast.error('Tidak ada perubahan yang dilakukan.', {
          style: { background: '#EF5350', color: '#fff' },
        });
        setSubmitLoading(false);
        return;
      }

      const updated = await AuthService.updateSellerProfile(user.id, payload);
      console.log('Updated seller data:', updated); // Debugging
      const data = updated?.updatedSeller || updated;

      if (data?.id) {
        const updatedSellerData = {
          id: data.id || '',
          storeName: data.storeName || '',
          email: data.email || '',
          phoneNumber: data.phoneNumber || '',
          address: data.address || '',
          city: data.city || '',
          photo: data.photoBase64 || data.photo || '',
          isVerified: data.verificationStatus || false,
        };
        setSellerData(updatedSellerData);
        setFormData({
          storeName: updatedSellerData.storeName,
          phoneNumber: updatedSellerData.phoneNumber,
          address: updatedSellerData.address,
          city: updatedSellerData.city,
          photo: null,
        });
        setProfilePicPreview(
          updatedSellerData.photo
            ? updatedSellerData.photo.startsWith('data:image')
              ? updatedSellerData.photo
              : `http://localhost:3000/${updatedSellerData.photo}`
            : 'https://via.placeholder.com/150?text=No+Image'
        );
        setIsEditing(false);
        setErrors({});
        toast.success('Profil seller berhasil diperbarui', {
          style: { background: '#80CBC4', color: '#fff' },
        });
      } else {
        throw new Error('Gagal menerima data seller dari server');
      }
    } catch (error) {
      console.error('Submit error:', error); // Debugging
      toast.error(error.message || 'Gagal memperbarui profil seller.', {
        style: { background: '#EF5350', color: '#fff' },
      });
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error('Ukuran file melebihi batas 2MB.', {
          style: { background: '#EF5350', color: '#fff' },
        });
        return;
      }
      if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
        toast.error('File harus berupa JPEG atau PNG.', {
          style: { background: '#EF5350', color: '#fff' },
        });
        return;
      }
      setFormData({ ...formData, photo: file });
      setProfilePicPreview(URL.createObjectURL(file));
    }
  };

  const handleCancel = () => {
    setFormData({
      storeName: sellerData?.storeName || '',
      phoneNumber: sellerData?.phoneNumber || '',
      address: sellerData?.address || '',
      city: sellerData?.city || '',
      photo: null,
    });
    setProfilePicPreview(
      sellerData?.photo
        ? sellerData.photo.startsWith('data:image')
          ? sellerData.photo
          : `http://localhost:3000/${sellerData.photo}`
        : 'https://via.placeholder.com/150?text=No+Image'
    );
    setIsEditing(false);
    setErrors({});
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <FaSpinner className="animate-spin text-indigo-600 text-3xl mx-auto" />
        <p className="text-gray-500 mt-2">Memuat profil...</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="p-6 bg-white rounded-xl shadow-sm border border-gray-100 max-w-2xl mx-auto"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <FaUser className="text-indigo-600 mr-3 text-xl" />
          <h3 className="text-lg font-semibold text-gray-800">Profil Seller</h3>
        </div>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center"
            disabled={submitLoading}
          >
            <FaEdit className="mr-2" />
            Edit Profil
          </button>
        )}
      </div>

      {isEditing ? (
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700">Foto Profil</label>
            <div className="mt-2 flex items-center">
              <img
                src={profilePicPreview}
                alt="Foto Profil"
                className="w-24 h-24 rounded-full object-cover mr-4 border border-gray-200"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://via.placeholder.com/150?text=No+Image';
                }}
              />
              <div>
                <label className="cursor-pointer bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 flex items-center">
                  <FaCamera className="mr-2" />
                  Unggah Foto
                  <input
                    type="file"
                    accept="image/jpeg,image/png"
                    onChange={handleFileChange}
                    className="hidden"
                    disabled={submitLoading}
                  />
                </label>
                <p className="text-xs text-gray-500 mt-1">Ukuran maksimum: 2MB, format: JPG, PNG</p>
              </div>
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Nama Toko</label>
            <input
              type="text"
              value={formData.storeName}
              onChange={(e) => setFormData({ ...formData, storeName: e.target.value })}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-100"
              placeholder="Masukkan nama toko"
              disabled={submitLoading}
            />
            {errors.storeName && <p className="text-red-500 text-xs mt-1">{errors.storeName}</p>}
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Nomor Telepon</label>
            <input
              type="text"
              value={formData.phoneNumber}
              onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-100"
              placeholder="Masukkan nomor telepon"
              disabled={submitLoading}
            />
            {errors.phoneNumber && <p className="text-red-500 text-xs mt-1">{errors.phoneNumber}</p>}
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Alamat Toko</label>
            <textarea
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-100"
              placeholder="Masukkan alamat toko"
              rows="3"
              disabled={submitLoading}
            />
            {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Kota</label>
            <input
              type="text"
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-100"
              placeholder="Masukkan kota"
              disabled={submitLoading}
            />
            {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
          </div>
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:bg-gray-200 disabled:cursor-not-allowed"
              disabled={submitLoading}
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center disabled:bg-indigo-400 disabled:cursor-not-allowed"
              disabled={submitLoading}
            >
              {submitLoading ? <FaSpinner className="mr-2 animate-spin" /> : null}
              Simpan Perubahan
            </button>
          </div>
        </form>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center">
            <img
              src={profilePicPreview}
              alt="Foto Profil"
              className="w-32 h-32 rounded-full object-cover mr-6 border border-gray-200"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://via.placeholder.com/150?text=No+Image';
              }}
            />
            <div>
              <h4 className="text-lg font-semibold text-gray-800">{sellerData?.storeName || 'Nama Toko Tidak Tersedia'}</h4>
              <p className="text-sm text-gray-500">ID Seller: {sellerData?.id || 'Tidak tersedia'}</p>
              <p className="text-sm text-gray-500 flex items-center">
                Status Verifikasi:
                {sellerData?.isVerified ? (
                  <FaCheckCircle className="ml-2 text-green-600" />
                ) : (
                  <FaTimes className="ml-2 text-red-600" />
                )}
                {sellerData?.isVerified ? ' Terverifikasi' : ' Belum Terverifikasi'}
              </p>
            </div>
          </div>
          <div>
            <h5 className="text-sm font-medium text-gray-700">Email</h5>
            <p className="mt-1 text-gray-600">{sellerData?.email || 'Tidak ada email'}</p>
          </div>
          <div>
            <h5 className="text-sm font-medium text-gray-700">Nomor Telepon</h5>
            <p className="mt-1 text-gray-600">{sellerData?.phoneNumber || 'Tidak ada nomor telepon'}</p>
          </div>
          <div>
            <h5 className="text-sm font-medium text-gray-700">Alamat Toko</h5>
            <p className="mt-1 text-gray-600">{sellerData?.address || 'Tidak ada alamat'}</p>
          </div>
          <div>
            <h5 className="text-sm font-medium text-gray-700">Kota</h5>
            <p className="mt-1 text-gray-600">{sellerData?.city || 'Tidak ada kota'}</p>
          </div>
        </div>
      )}
      <ProfileConfirmModal
        isOpen={isConfirmModalOpen}
        setIsOpen={setIsConfirmModalOpen}
        formData={formData}
        setSellerData={setSellerData}
      />
    </motion.div>
  );
};

export default React.memo(SellerProfile);