import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import AuthForm from './authFormRegistrasi'; // Ensure AuthForm is properly imported
import logo from '../assets/logo.png'; // Correct path to the logo

const RegisterFormUser  = () => {
  const navigate = useNavigate(); // Initialize the navigate hook

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="container mx-auto flex flex-col md:flex-row rounded-lg shadow-lg overflow-hidden">
        {/* Left Side (Mobile Version) */}
        <div className="w-full md:w-1/2 flex flex-col items-center justify-center p-8 bg-green-50">
          <img
            src={logo} // Correct way to reference the imported logo
            alt="Logo"
            className="w-43 h-43 mb-4" // Adjusted size for better visibility
          />
          <h2 className="text-2xl font-semibold text-green-600 text-center md:text-left mb-4">
            Ingin Menjadi Penjual?
          </h2>

          {/* Flex container for buttons (Mobile and Desktop) */}
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 w-full">
            <button
              className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600"
              onClick={() => navigate('/seller/login')} // Navigate to seller login
            >
              Masuk Sebagai Penjual
            </button>
            <button
              className="flex-1 px-4 py-2 rounded-lg shadow"
              style={{
                background: 'linear-gradient(90deg, #47EE54, #54A05A)',
                color: 'white',
              }}
              onClick={() => navigate('/seller/register')} // Navigate to seller register
            >
              Daftar Sebagai Penjual
            </button>
          </div>
        </div>

        {/* Right Side (Auth Form) */}
        <div className="w-full md:w-1/2 p-8 bg-blue-200">
          {/* Using AuthForm for registration form */}
          <AuthForm
            formType="register" // Indicating this is the registration form
            buttonText="Register" // Button text
            onSubmit={(e) => {
              e.preventDefault();
              // Add form submit logic here
              console.log("Form Submitted");
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default RegisterFormUser ;