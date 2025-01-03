import React, { useState } from 'react';

const ChangeProfilUser = () => {
  const [profileImage, setProfileImage] = useState(null); // Untuk menyimpan gambar profil
  const [newPassword, setNewPassword] = useState(""); // Untuk menyimpan password baru

  // Fungsi untuk menangani perubahan gambar profil
  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(URL.createObjectURL(file)); // Menyimpan gambar yang dipilih
    }
  };

  // Fungsi untuk menangani perubahan password
  const handlePasswordChange = () => {
    if (newPassword.trim()) {
      // Logic untuk mengganti password (bisa diproses lebih lanjut, seperti mengirim ke API)
      alert('Password telah diganti!');
      setNewPassword(""); // Reset password setelah submit
    } else {
      alert('Password baru tidak valid');
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 rounded-lg overflow-hidden">
        {/* Bagian Kiri - Gambar Profil dan Button Pilih Foto */}
        <div className="col-span-1 flex flex-col items-center justify-center p-4">
          <div className="mb-4">
            <img
              src={profileImage || 'https://via.placeholder.com/150'}
              alt="Profile"
              className="w-72 h-72 object-cover"
            />
          </div>
          {/* Button Pilih Foto */}
          <label className="cursor-pointer text-blue-500 hover:text-blue-700 mb-4">
            <input
              type="file"
              accept="image/*"
              onChange={handleProfileImageChange}
              className="hidden"
            />
            Pilih Foto
          </label>
          {/* Button Ganti Password */}
          <button
            onClick={() => alert("Navigating to password change form")}
            className="p-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 w-full"
          >
            Ganti Password
          </button>
        </div>

        {/* Bagian Kanan - Identitas User */}
        <div className="col-span-3 bg-gray-50 p-4 opacity-90 border border-black rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Identitas User</h2>
          <div className="space-y-4">
            <div className="flex justify-start">
              <span className="text-gray-700 mr-2">Nama:</span>
              <span className="text-gray-900 ml-20">John Doe</span>
              <a href="">
                <span className=" text-blue-500 hover:text-blue-700 underline mb-4 ml-32">Change</span>
              </a>
            </div>
            <div className="flex justify-start">
              <span className="text-gray-700">Email:</span>
              <span className="text-gray-900 ml-24">johndoe@example.com</span>
              <a href="">
                <span className=" text-blue-500 hover:text-blue-700 underline mb-4 ml-6">Change</span>
              </a>
            </div>
            <h2 className="text-xl font-semibold mb-4 mt-6">Contact</h2>
            <div className="space-y-4">
              <div className="flex justify-start">
                <span className="text-gray-700">Email:</span>
                <span className="text-gray-900 ml-24">Example@gmail.com</span>
                <a href="">
                  <span className=" text-blue-500 hover:text-blue-700 underline mb-4 ml-12">Change</span>
                </a>
              </div>
              <div className="flex justify-start">
                <span className="text-gray-700">No. Telepon:</span>
                <span className="text-gray-900 ml-12">+62 812 3456 7890</span>
                <a href="">
                  <span className=" text-blue-500 hover:text-blue-700 underline mb-4 ml-14">Change</span>
                </a>
              </div>
            </div>
          </div>
          {/* Tombol Save / Selesai */}
          <div className="flex justify-end mt-24">
            <button
              onClick={() => alert('Changes saved!')}
              className="px-6 py-2 text-white rounded-lg"
              style={{
                background: 'linear-gradient(90deg, #47EE54, #54A05A)',
              }}
            >
              Selesai
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangeProfilUser;
