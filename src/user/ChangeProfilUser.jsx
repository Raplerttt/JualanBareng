import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../utils/axios";
import { FiUser, FiMail, FiPhone, FiHome, FiEdit, FiSave, FiUpload } from "react-icons/fi";
import { motion } from "framer-motion";
import { FaSpinner } from "react-icons/fa";

const ChangeProfileUser = () => {
  const [user, setUser] = useState(null);
  const [editedUser, setEditedUser] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/user/login");
          return;
        }
        const response = await axios.get("/users", {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("API Response:", response.data);
        setUser(response.data.user);
        setEditedUser({
          fullName: response.data.user.fullName,
          email: response.data.user.email,
          phoneNumber: response.data.user.phoneNumber,
        });
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
        setError(error.response?.data?.message || "Failed to load profile");
        setLoading(false);
      }
    };

    fetchUser();
  }, [navigate]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedUser((prev) => ({ ...prev, [name]: value }));
  };

  // Handle image selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // Save profile changes
  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/user/login");
        return;
      }
  
      setLoading(true);
  
      // Gunakan FormData untuk semua data
      const formData = new FormData();
      formData.append("fullName", editedUser.fullName);
      formData.append("email", editedUser.email);
      formData.append("phoneNumber", editedUser.phoneNumber);
  
      if (imageFile) {
        formData.append("photo", imageFile); // ✅ field name harus "photo"
      }
  
      // Ganti :id dengan user.id
      await axios.put(`/users/${user.id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
  
      // Refresh user data
      const response = await axios.get("/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(response.data.user);
      setIsEditing(false);
      setImagePreview(null);
      setImageFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      setLoading(false);
    } catch (error) {
      console.error("Failed to save profile:", error);
      setError(error.response?.data?.message || "Failed to save profile");
      setLoading(false);
    }
  };
  

  // Toggle edit mode
  const toggleEdit = () => {
    setIsEditing(!isEditing);
    if (isEditing) {
      setEditedUser({
        fullName: user.fullName,
        email: user.email,
        phoneNumber: user.phoneNumber,
      });
      setImagePreview(null);
      setImageFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center bg-gray-50">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        >
          <FaSpinner className="text-blue-500 text-3xl" />
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col items-center justify-center bg-gray-50"
      >
        <div className="bg-white p-6 rounded-xl shadow-md text-center max-w-xs">
          <p className="text-red-500 text-base font-medium mb-3">{error}</p>
          <button
            onClick={() => navigate("/")}
            className="px-4 py-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center mx-auto text-sm"
          >
            <FiHome className="mr-1.5" />
            Back to Home
          </button>
        </div>
      </motion.div>
    );
  }

  if (!user) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col items-center justify-center bg-gray-50"
      >
        <div className="bg-white p-6 rounded-xl shadow-md text-center max-w-xs">
          <p className="text-gray-500 text-base font-medium mb-3">User not found</p>
          <button
            onClick={() => navigate("/")}
            className="px-4 py-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center mx-auto text-sm"
          >
            <FiHome className="mr-1.5" />
            Back to Home
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-gray-50 py-6 px-4 sm:px-6"
    >
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r bg-[#80CBC4] p-6 text-white">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold tracking-tight">User Profile</h1>
                <p className="mt-1 text-xs opacity-80">Manage your account details</p>
              </div>
              <button
                onClick={toggleEdit}
                className="px-4 py-1.5 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition-colors flex items-center text-sm"
              >
                {isEditing ? (
                  <>
                    <FiSave className="mr-1.5" />
                    Save
                  </>
                ) : (
                  <>
                    <FiEdit className="mr-1.5" />
                    Edit
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Profile Picture Section */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="md:col-span-1 flex flex-col items-center"
            >
              <div className="relative group">
                <div className="w-32 h-32 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 p-1">
                <img
                  src={
                    imagePreview ||
                    (user.photo
                      ? `http://localhost:3000/uploads/users/${user.photo}`
                      : `https://ui-avatars.com/api/?name=${encodeURIComponent(user.fullName || "User")}&background=3B82F6&color=FFFFFF`)
                  }
                  alt="Profile"
                  className="w-full h-full rounded-full object-cover"
                />
                </div>
                {isEditing && (
                  <button
                    onClick={() => fileInputRef.current.click()}
                    className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition-colors"
                  >
                    <FiUpload className="text-sm" />
                  </button>
                )}
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>
              <p className="mt-3 text-lg font-semibold text-gray-900">{user.fullName}</p>
              <p className="text-xs text-gray-500 capitalize">{user.role}</p>
            </motion.div>

            {/* Profile Information */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="md:col-span-2 space-y-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Full Name */}
                <div className="space-y-1">
                  <label className="flex items-center text-gray-700 font-medium text-xs">
                    <FiUser className="mr-1.5 text-blue-500" />
                    Full Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="fullName"
                      value={editedUser.fullName || ""}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                  ) : (
                    <div className="w-full px-3 py-2 bg-gray-50 rounded-lg border border-gray-200 shadow-sm text-sm">
                      <p className="text-gray-900">{user.fullName || "-"}</p>
                    </div>
                  )}
                </div>

                {/* Email */}
                <div className="space-y-1">
                  <label className="flex items-center text-gray-700 font-medium text-xs">
                    <FiMail className="mr-1.5 text-blue-500" />
                    Email
                  </label>
                  {isEditing ? (
                    <input
                      type="email"
                      name="email"
                      value={editedUser.email || ""}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                  ) : (
                    <div className="w-full px-3 py-2 bg-gray-50 rounded-lg border border-gray-200 shadow-sm text-sm">
                      <p className="text-gray-900">{user.email || "-"}</p>
                    </div>
                  )}
                </div>

                {/* Phone Number */}
                <div className="space-y-1">
                  <label className="flex items-center text-gray-700 font-medium text-xs">
                    <FiPhone className="mr-1.5 text-blue-500" />
                    Phone Number
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="phoneNumber"
                      value={editedUser.phoneNumber || ""}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                  ) : (
                    <div className="w-full px-3 py-2 bg-gray-50 rounded-lg border border-gray-200 shadow-sm text-sm">
                      <p className="text-gray-900">{user.phoneNumber || "-"}</p>
                    </div>
                  )}
                </div>
              </div>
              {isEditing && (
                <div className="flex justify-end">
                  <button
                    onClick={handleSave}
                    className="px-4 py-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center text-sm"
                  >
                    <FiSave className="mr-1.5" />
                    Save Changes
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ChangeProfileUser;