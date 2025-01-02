import React from 'react';
import AuthForm from '../components/AuthForm'; // Pastikan kamu telah membuat AuthForm

const RegisterForm = () => {
  return (
    <div className="items-center justify-center bg-gray-100">
      <div className="container mx-auto flex bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Left Side */}
        <div className="w-1/2 bg-green-50 p-8 flex flex-col items-center justify-center space-y-4">
          <img
            src="/logo.png" // Ganti dengan path logo Anda
            alt="Logo"
            className="w-20 h-20"
          />
          <h2 className="text-2xl font-semibold text-green-600">
            Want to become a seller?
          </h2>
          
          {/* Flex container for buttons */}
          <div className="flex space-x-4 w-full justify-center">
            <button className="px-4 py-2 w-1/2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600">
              Login as Seller
            </button>
            <button
              className="px-4 py-2 w-1/2 rounded-lg shadow"
              style={{
                background: 'linear-gradient(90deg, #47EE54, #54A05A)',
                color: 'white',
              }}
            >
              Register as Seller
            </button>
          </div>
        </div>

        {/* Right Side */}
        <div className="w-1/2 p-8">
          {/* Menggunakan AuthForm untuk form registrasi */}
          <AuthForm
            formType="register" // Menentukan bahwa ini adalah form untuk registrasi
            buttonText="Register" // Teks tombol
            onSubmit={(e) => {
              e.preventDefault();
              // Tambahkan logika submit form di sini
              console.log("Form Submitted");
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
