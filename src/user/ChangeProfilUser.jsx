import React, { useState, useEffect } from "react";
import axios from "../../utils/axios";
import { useNavigate } from "react-router-dom";
import { FiEdit, FiSave, FiUpload, FiUser, FiMail, FiPhone, FiLock } from "react-icons/fi";

const ChangeProfileUser = () => {
  const [profileImage, setProfileImage] = useState(null);
  const [newPassword, setNewPassword] = useState("");
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({});
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get("/users/profile", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setUser(response.data.user);
        setEditedUser(response.data.user);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };

    fetchUser();
  }, []);

  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      if (!file.type.startsWith("image/")) {
        alert("Please select an image file!");
        return;
      }
      setProfileImage(file);
    }
  };

  const handleUploadProfileImage = async () => {
    if (!profileImage) {
      alert("Please select an image first!");
      return;
    }

    const formData = new FormData();
    formData.append("profileImage", profileImage);

    try {
      await axios.post("/users/upload-profile", formData, {
        headers: { 
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data"
        },
      });
      alert("Profile image updated successfully!");
      // Refresh user data
      const response = await axios.get("/users/profile", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setUser(response.data.user);
      setProfileImage(null);
    } catch (error) {
      console.error("Failed to update profile image:", error);
      alert("Failed to update profile image. Please try again.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedUser({ ...editedUser, [name]: value });
  };

  const handleSaveChanges = async () => {
    try {
      await axios.put("/users", editedUser, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      alert("Changes saved successfully!");
      setUser(editedUser);
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to save changes:", error);
      alert("Failed to save changes. Please try again.");
    }
  };

  const handlePasswordChange = async () => {
    if (!newPassword.trim()) {
      alert("Please enter a valid new password!");
      return;
    }

    try {
      await axios.post(
        "/users/change-password",
        { newPassword },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      alert("Password changed successfully!");
      setNewPassword("");
      setShowPasswordModal(false);
    } catch (error) {
      console.error("Failed to change password:", error);
      alert("Failed to change password. Please try again.");
    }
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6">
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 text-white">
          <h1 className="text-2xl font-bold">User Profile</h1>
          <p className="opacity-90">Manage your account information</p>
        </div>

        {/* Main Content */}
        <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Profile Picture Section */}
          <div className="md:col-span-1 flex flex-col items-center">
            <div className="relative group">
              <img
                src={
                  profileImage 
                    ? URL.createObjectURL(profileImage) 
                    : user.profilePicture || "https://ui-avatars.com/api/?name=" + encodeURIComponent(user.fullName || "User") + "&background=random"
                }
                alt="Profile"
                className="w-40 h-40 rounded-full object-cover border-4 border-white shadow-lg"
              />
              <label className="absolute inset-0 bg-black bg-opacity-30 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                <FiUpload className="text-white text-2xl" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleProfileImageChange}
                  className="hidden"
                />
              </label>
            </div>

            <button
              onClick={handleUploadProfileImage}
              disabled={!profileImage}
              className={`mt-4 px-4 py-2 rounded-lg flex items-center transition-all ${
                profileImage
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "bg-gray-200 text-gray-500 cursor-not-allowed"
              }`}
            >
              <FiSave className="mr-2" />
              Save Picture
            </button>

            <button
              onClick={() => setShowPasswordModal(true)}
              className="mt-4 px-4 py-2 text-blue-600 hover:text-blue-800 flex items-center"
            >
              <FiLock className="mr-2" />
              Change Password
            </button>
          </div>

          {/* Profile Information */}
          <div className="md:col-span-2 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Full Name */}
              <div className="space-y-1">
                <label className="flex items-center text-gray-700 font-medium">
                  <FiUser className="mr-2" />
                  Full Name
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={editedUser.fullName || ""}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                    isEditing
                      ? "border-blue-300 focus:ring-blue-200 bg-white"
                      : "border-gray-200 bg-gray-50"
                  }`}
                  disabled={!isEditing}
                />
              </div>

              {/* Email */}
              <div className="space-y-1">
                <label className="flex items-center text-gray-700 font-medium">
                  <FiMail className="mr-2" />
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={editedUser.email || ""}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                    isEditing
                      ? "border-blue-300 focus:ring-blue-200 bg-white"
                      : "border-gray-200 bg-gray-50"
                  }`}
                  disabled={!isEditing}
                />
              </div>

              {/* Phone Number */}
              <div className="space-y-1">
                <label className="flex items-center text-gray-700 font-medium">
                  <FiPhone className="mr-2" />
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={editedUser.phoneNumber || ""}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                    isEditing
                      ? "border-blue-300 focus:ring-blue-200 bg-white"
                      : "border-gray-200 bg-gray-50"
                  }`}
                  disabled={!isEditing}
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4 pt-4">
              {isEditing && (
                <button
                  onClick={() => {
                    setEditedUser(user);
                    setIsEditing(false);
                  }}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              )}
              <button
                onClick={() => {
                  if (isEditing) {
                    handleSaveChanges();
                  } else {
                    setIsEditing(true);
                  }
                }}
                className={`px-4 py-2 rounded-lg flex items-center transition-colors ${
                  isEditing
                    ? "bg-green-600 text-white hover:bg-green-700"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
              >
                {isEditing ? (
                  <>
                    <FiSave className="mr-2" />
                    Save Changes
                  </>
                ) : (
                  <>
                    <FiEdit className="mr-2" />
                    Edit Profile
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-xl font-semibold mb-4">Change Password</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-1">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
                  placeholder="Enter new password"
                />
              </div>
              <div className="flex justify-end space-x-3 pt-2">
                <button
                  onClick={() => setShowPasswordModal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePasswordChange}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Change Password
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChangeProfileUser;