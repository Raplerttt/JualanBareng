import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import AuthForm from './AuthFormSeller'; // Ensure AuthForm is properly imported
import logo from '../assets/logo.png'; // Correct path to the logo

const SellerLoginForm = () => {
  const navigate = useNavigate(); // Initialize the navigate hook

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="container mx-auto flex flex-col md:flex-row rounded-lg shadow-lg overflow-hidden">
        {/* Left Side (Mobile Version) */}
        <div className="w-full md:w-1/2 bg-green-50 p-8 flex flex-col items-center justify-center space-y-4">
          <img
            src={logo} // Correct way to reference the imported logo
            alt="Logo"
            className="w-43 h-43 mb-4" // Adjusted size for better visibility
          />
          <h2 className="text-2xl font-semibold text-green-600 text-center md:text-left mb-4">
            Be a Good Seller
          </h2>

          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 w-full">
            <button
              className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600"
              onClick={() => navigate('/user/login')} // Navigate to user login
            >
              Login as User
            </button>
            <button
              className="flex-1 px-4 py-2 rounded-lg shadow"
              style={{
                background: 'linear-gradient(90deg, #47EE54, #54A05A)',
                color: 'white',
              }}
              onClick={() => navigate('/user/register')} // Navigate to user register
            >
              Register as User
            </button>
          </div>
        </div>

        {/* Right Side (Auth Form) */}
        <div className="w-full md:w-1/2 p-8 bg-blue-200">
          {/* Using AuthForm for login form */}
          <AuthForm
            formType="login" // Indicating this is the login form
            buttonText="Login" // Button text
            onSubmit={async (e) => {
              e.preventDefault();
              // Add form submit logic here
              try {
                // Assuming AuthForm handles the login logic and returns a promise
                await AuthForm.handleLogin(); // Replace with actual login logic
                console.log("Login Success");
                navigate('/seller/dashboard'); // Redirect to seller dashboard after successful login
              } catch (error) {
                console.error("Login failed:", error);
                // Handle error (e.g., show a notification)
              }
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default SellerLoginForm;