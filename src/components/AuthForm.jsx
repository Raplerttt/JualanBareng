import React from "react";

const AuthForm = ({
  formType = "login", // Default formType is "login"
  buttonText = "Login",
  onSubmit,
}) => {
  return (
    <div className="w-full p-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        {formType === "login" ? "Login" : "Register"} as a User
      </h2>
      <form className="space-y-4" onSubmit={onSubmit}>
        {formType === "register" && (
          <>
            <div>
              <label className="block text-gray-600">Full Name</label>
              <input
                type="text"
                placeholder="Enter your full name"
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
                <a href="/" className="text-blue-500 hover:underline">
                  Register
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
          <a href="/login" className="text-blue-500 hover:underline">
            Login
          </a>
        </div>
      )}
    </div>
  );
};

export default AuthForm;
