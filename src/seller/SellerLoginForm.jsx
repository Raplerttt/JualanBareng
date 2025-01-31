import React from 'react';
import AuthForm from '../components/AuthFormSeller'; // Ensure AuthForm is properly imported

const SellerLoginForm = () => {
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
            Be a Good Seller
          </h2>
        </div>

        {/* Right Side (Auth Form) */}
        <div className="w-full md:w-1/2 p-8">
          {/* Using AuthForm for login form */}
          <AuthForm
            formType="login" // Indicating this is the login form
            buttonText="Login" // Button text
            onSubmit={(e) => {
              e.preventDefault();
              // Add form submit logic here
              console.log("Login Success");
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default SellerLoginForm;
