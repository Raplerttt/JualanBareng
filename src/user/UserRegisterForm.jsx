import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import AuthForm from '../components/AuthFormUser'; // Ensure AuthForm is properly imported

const RegisterFormUser  = () => {
  const navigate = useNavigate(); // Initialize the navigate hook


  return (
    <div className="items-center justify-center">
      <div className="container mx-auto flex flex-col md:flex-row rounded-lg shadow-lg overflow-hidden">
        {/* Left Side (Mobile Version) */}
        <div className="w-full md:w-1/2 bg-green-50 p-8 flex flex-col items-center justify-center space-y-4">
          <img
            src="/logo.png" // Replace with your logo path
            alt="Logo"
            className="w-20 h-20"
          />
          <h2 className="text-2xl font-semibold text-green-600 text-center md:text-left">
            Want to become a seller?
          </h2>

          {/* Flex container for buttons (Mobile and Desktop) */}
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 w-full">
            <button
              className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600"
              onClick={() => navigate('/seller/login')} // Navigate to seller login
            >
              Login as Seller
            </button>
            <button
              className="flex-1 px-4 py-2 rounded-lg shadow"
              style={{
                background: 'linear-gradient(90deg, #47EE54, #54A05A)',
                color: 'white',
              }}
              onClick={() => navigate('/seller/register')} // Navigate to seller register
            >
              Register as Seller
            </button>
          </div>
        </div>

        {/* Right Side (Auth Form) */}
        <div className="w-full md:w-1/2 p-8">
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

export default RegisterFormUser;