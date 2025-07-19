import React, { useState, useEffect, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../utils/axios";
import { FiUser, FiMail, FiPhone, FiHome, FiEdit, FiSave, FiUpload } from "react-icons/fi";
import { motion } from "framer-motion";
import { FaSpinner } from "react-icons/fa";
import { AuthContext } from "../auth/authContext";
import toast from "react-hot-toast";

const ChangeProfileUser = () => {
  const { user, isAuthenticated } = useContext(AuthContext);
  const [editedUser, setEditedUser] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageBase64, setImageBase64] = useState(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (!isAuthenticated || !user?.id) {
          setError("Silakan login untuk mengakses profil");
          navigate("/user/login");
          return;
        }

        const token = localStorage.getItem("Admintoken");
        if (!token) {
          setError("Token tidak ditemukan");
          navigate("/user/login");
          return;
        }

        const response = await axios.get("/users", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const userData = response.data.user || response.data.data?.user || response.data;
        console.log("Fetched user data:", userData); // Debugging
        if (!userData?.id) {
          throw new Error("Data pengguna tidak valid");
        }

        setEditedUser({
          fullName: userData.fullName || "",
          email: userData.email || "",
          phoneNumber: userData.phoneNumber || "",
          photoBase64: userData.photoBase64 || userData.photo || "",
        });
        setLoading(false);
      } catch (error) {
        console.error("Fetch error:", error.response?.data); // Debugging
        setError(error.response?.data?.message || "Gagal memuat profil");
        setLoading(false);
      }
    };

    fetchUser();
  }, [isAuthenticated, user, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validasi ukuran dan tipe file
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Ukuran file tidak boleh lebih dari 5MB");
        return;
      }
      if (!["image/jpeg", "image/png"].includes(file.type)) {
        toast.error("File harus berupa JPEG atau PNG");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        if (!base64String.match(/^data:image\/(png|jpeg|jpg);base64,/)) {
          toast.error("Format gambar tidak valid (harus PNG atau JPEG)");
          return;
        }
        setImageBase64(base64String);
        setImagePreview(URL.createObjectURL(file));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    try {
      if (!isAuthenticated || !user?.id) {
        toast.error("Silakan login untuk memperbarui profil");
        navigate("/user/login");
        return;
      }

      const token = localStorage.getItem("Admintoken");
      if (!token) {
        toast.error("Token tidak ditemukan");
        navigate("/user/login");
        return;
      }

      setLoading(true);
      const userDataToSend = {
        fullName: editedUser.fullName?.trim() || "",
        email: editedUser.email?.trim() || "",
        phoneNumber: editedUser.phoneNumber?.trim() || "",
        ...(imageBase64 && { photoBase64: imageBase64 }),
      };

      // Validasi frontend sesuai dengan validateUser.js
      if (!userDataToSend.fullName) {
        throw new Error("Nama lengkap wajib diisi");
      }
      if (!userDataToSend.email || !/\S+@\S+\.\S+/.test(userDataToSend.email)) {
        throw new Error("Format email tidak valid");
      }
      if (!userDataToSend.phoneNumber) {
        throw new Error("Nomor telepon wajib diisi");
      }
      if (imageBase64 && !imageBase64.match(/^data:image\/(png|jpeg|jpg);base64,/)) {
        throw new Error("Format photoBase64 tidak valid");
      }

      const response = await axios.put(`/users/${user.id}`, userDataToSend, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const userData = response.data.user || response.data.data?.user || response.data;
      console.log("Updated user data:", userData); // Debugging
      if (!userData?.id) {
        throw new Error("Data pengguna tidak valid setelah pembaruan");
      }

      localStorage.setItem("AdminUser", JSON.stringify(userData));
      setEditedUser({
        fullName: userData.fullName || "",
        email: userData.email || "",
        phoneNumber: userData.phoneNumber || "",
        photoBase64: userData.photoBase64 || userData.photo || "",
      });
      setIsEditing(false);
      setImagePreview(null);
      setImageBase64(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      toast.success("Profil berhasil diperbarui");
      setLoading(false);
    } catch (error) {
      console.error("Save error:", error.response?.data); // Debugging
      const errorMessage = error.response?.data?.message || error.message || "Gagal menyimpan profil";
      setError(errorMessage);
      toast.error(errorMessage);
      setLoading(false);
    }
  };

  const toggleEdit = () => {
    setIsEditing(!isEditing);
    if (isEditing) {
      setEditedUser({
        fullName: user.fullName || "",
        email: user.email || "",
        phoneNumber: user.phoneNumber || "",
        photoBase64: user.photoBase64 || user.photo || "",
      });
      setImagePreview(null);
      setImageBase64(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        >
          <FaSpinner className="text-[#80CBC4] text-5xl" />
        </motion.div>
      </div>
    );
  }

  if (error || !isAuthenticated || !user) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col items-center justify-center min-h-screen bg-gray-100"
      >
        <div className="bg-white p-10 rounded-3xl shadow-xl text-center max-w-md">
          <p className="text-red-600 text-lg font-semibold mb-6">{error || "Pengguna tidak ditemukan atau belum login"}</p>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-3 bg-[#80CBC4] text-white rounded-full hover:bg-[#4BA8A0] transition-all flex items-center mx-auto text-base font-medium shadow-md"
          >
            <FiHome className="mr-2" />
            Kembali ke Beranda
          </button>
        </div>
      </motion.div>
    );
  }

  // Tentukan URL gambar profil
  const photoUrl = imagePreview
    ? imagePreview
    : user.photoBase64 || user.photo
    ? user.photoBase64?.startsWith("data:image") || user.photo?.startsWith("data:image")
      ? user.photoBase64 || user.photo // Base64
      : `http://localhost:3000/${user.photoBase64 || user.photo}` // Path file
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(user.fullName || "Pengguna")}&background=80CBC4&color=FFFFFF`;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.7 }}
      className="bg-gray-100 py-12 px-6 flex items-center justify-center"
    >
      <div className="max-w-5xl w-full mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-[#80CBC4] p-10 text-white relative">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-extrabold tracking-tight">Profil Anda</h1>
              <p className="mt-2 text-base opacity-90">Sesuaikan informasi pribadi Anda</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={isEditing ? handleSave : toggleEdit}
              className="px-6 py-3 bg-white text-[#80CBC4] rounded-full font-medium text-base hover:bg-gray-100 transition-all shadow-md flex items-center"
            >
              {isEditing ? (
                <>
                  <FiSave className="mr-2" />
                  Simpan
                </>
              ) : (
                <>
                  <FiEdit className="mr-2" />
                  Edit Profil
                </>
              )}
            </motion.button>
          </div>
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-[#4BA8A0] to-transparent" />
        </div>

        {/* Main Content */}
        <div className="p-10 grid grid-cols-1 lg:grid-cols-5 gap-10">
          {/* Profile Picture Section */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-2 flex flex-col items-center"
          >
            <div className="relative group">
              <div className="w-40 h-40 rounded-full bg-gradient-to-br from-[#80CBC4] to-[#4BA8A0] p-1.5 shadow-lg">
                <img
                  src={photoUrl}
                  alt="Profil"
                  className="w-full h-full rounded-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.fullName || "Pengguna")}&background=80CBC4&color=FFFFFF`;
                  }}
                />
              </div>
              {isEditing && (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => fileInputRef.current.click()}
                  className="absolute bottom-3 right-3 bg-[#80CBC4] text-white p-3 rounded-full hover:bg-[#4BA8A0] transition-all shadow-md"
                >
                  <FiUpload className="text-lg" />
                </motion.button>
              )}
              <input
                type="file"
                accept="image/jpeg,image/png"
                ref={fileInputRef}
                onChange={handleImageChange}
                className="hidden"
              />
            </div>
            <p className="mt-6 text-2xl font-bold text-gray-800">{user.fullName}</p>
            <p className="text-sm text-gray-500 capitalize font-medium">{user.role}</p>
          </motion.div>

          {/* Profile Information */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="lg:col-span-3 space-y-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Full Name */}
              <div className="space-y-3">
                <label className="flex items-center text-gray-700 font-semibold text-sm">
                  <FiUser className="mr-2 text-[#80CBC4] text-lg" />
                  Nama Lengkap
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="fullName"
                    value={editedUser.fullName || ""}
                    onChange={handleInputChange}
                    className="w-full px-5 py-3 bg-white rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#80CBC4] text-base shadow-sm transition-all"
                    placeholder="Masukkan nama lengkap"
                  />
                ) : (
                  <div className="w-full px-5 py-3 bg-gray-50 rounded-2xl border border-gray-200 shadow-sm text-base text-gray-800">
                    {editedUser.fullName || "-"}
                  </div>
                )}
              </div>

              {/* Email */}
              <div className="space-y-3">
                <label className="flex items-center text-gray-700 font-semibold text-sm">
                  <FiMail className="mr-2 text-[#80CBC4] text-lg" />
                  Email
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    name="email"
                    value={editedUser.email || ""}
                    onChange={handleInputChange}
                    className="w-full px-5 py-3 bg-white rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#80CBC4] text-base shadow-sm transition-all"
                    placeholder="Masukkan email"
                  />
                ) : (
                  <div className="w-full px-5 py-3 bg-gray-50 rounded-2xl border border-gray-200 shadow-sm text-base text-gray-800">
                    {editedUser.email || "-"}
                  </div>
                )}
              </div>

              {/* Phone Number */}
              <div className="space-y-3">
                <label className="flex items-center text-gray-700 font-semibold text-sm">
                  <FiPhone className="mr-2 text-[#80CBC4] text-lg" />
                  Nomor Telepon
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="phoneNumber"
                    value={editedUser.phoneNumber || ""}
                    onChange={handleInputChange}
                    className="w-full px-5 py-3 bg-white rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#80CBC4] text-base shadow-sm transition-all"
                    placeholder="Masukkan nomor telepon"
                  />
                ) : (
                  <div className="w-full px-5 py-3 bg-gray-50 rounded-2xl border border-gray-200 shadow-sm text-base text-gray-800">
                    {editedUser.phoneNumber || "-"}
                  </div>
                )}
              </div>
            </div>
            {isEditing && (
              <div className="flex justify-end space-x-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={toggleEdit}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 transition-all text-base font-medium shadow-md"
                >
                  Batal
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSave}
                  disabled={loading}
                  className={`px-6 py-3 bg-[#80CBC4] text-white rounded-full hover:bg-[#4BA8A0] transition-all flex items-center text-base font-medium shadow-md ${
                    loading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {loading ? (
                    <FaSpinner className="mr-2 animate-spin" />
                  ) : (
                    <FiSave className="mr-2" />
                  )}
                  Simpan Perubahan
                </motion.button>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default ChangeProfileUser;