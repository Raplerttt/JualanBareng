import React from "react";
import { useNavigate } from "react-router-dom";

const AuthFormSeller = ({
  formType = "login", // Default formType is "login"
  buttonText = "Login",
  onSubmit,
}) => {
  const navigate = useNavigate(); // Initialize the navigate hook

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (formType === "login") {
      // Perform login logic here (like authentication checks)
      console.log("Logging in...");
      
      // Redirect to home page after login
      navigate("/"); // Redirect to home page
    } else {
      // Perform registration logic here
      console.log("Registering...");
      
      // Optionally, redirect to seller login page after registration
      // navigate("/seller/login");
    }

    // Call the parent onSubmit if provided
    if (onSubmit) {
      onSubmit(e);
    }
  };

  return (
    <div className="w-full p-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        {formType === "login" ? "Login" : "Register"} as a Seller
      </h2>
      <form className="space-y-4" onSubmit={handleSubmit}>
        {formType === "register" && (
          <>
            {/* Registration form fields */}
            <div>
              <label className="block text-gray-600">Store Name</label>
              <input
                type="text"
                placeholder="Enter your store name"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-green-300"
              />
            </div>
            <div>
              <label className="block text-gray-600">Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-green-300"
              />
            </div>
            <div>
              <label className="block text-gray-600">Phone Number</label>
              <input
                type="text"
                placeholder="Enter your phone number"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-green-300"
              />
            </div>
            <div>
              <label className="block text-gray-600">Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-green-300"
              />
            </div>
            <div>
              <label className="block text-gray-600">Confirm Password</label>
              <input
                type="password"
                placeholder="Confirm your password"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-green-300"
              />
            </div>
          </>
        )}
        {formType === "login" && (
          <>
            <div>
              <label className="block text-gray-600">Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-green-300"
              />
            </div>
            <div>
              <label className="block text-gray-600">Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-green-300"
              />
            </div>
          </>
        )}
        <div className="flex items-center justify-between">
          <div className="flex items-center justify-start w-1/2">
            {formType === "login" && (
              <div className="mt-4 text-sm">
                <span className="text-gray-600">Don't have an account? </span>
                <a href="/seller/register" className="text-blue-500 hover:underline">
                  Register as Seller
                </a>
              </div>
            )}
          </div>
          <div className="flex items-center justify-end w-1/2">
            <button
              type="submit"
              className="px-6 py-2 rounded-lg text-white font-medium"
              style={{
                background: "linear-gradient(90deg, #47EE54, #54A05A)",
              }}
            >
              {buttonText}
            </button>
          </div>
        </div>
      </form>
      {formType === "register" && (
        <div className="mt-4 text-sm">
          <span className="text-gray-600">Already have an account? </span>
          <a href="/seller/login" className="text-blue-500 hover:underline">
            Login
          </a>
        </div>
      )}
    </div>
  );
};

export default AuthFormSeller;
