import React, { useState, useCallback, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../utils/axios"; // Import instance axios yang sudah dikonfigurasi
import { GoogleLogin } from 'react-google-login'; // Import GoogleLogin
import FacebookLogin from 'react-facebook-login'; // Import FacebookLogin
import { AuthContext } from '../auth/authContext'; // Import AuthContext

const AuthFormUser  = ({ buttonText = "Login" }) => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext); // Get login function from AuthContext
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false); // State untuk loading

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const newErrors = {};
    const { email, password } = formData;

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Format email tidak valid";
    }
    if (!password || password.length < 8 || password.length > 30 || !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/.test(password)) {
      newErrors.password = "Password harus 8-30 karakter, mengandung huruf besar, kecil, angka & simbol";
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validasi input
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setError(validationErrors);
      return;
    }

    // Ambil data dari state
    const { email, password } = formData;

    const userData = {
      identifier: email, // Kirim email
      password,
    };

    console.log("📤 Data yang dikirim ke backend:", userData); // Debugging

    try {
      setLoading(true); // Set loading true saat proses login
      const response = await axios.post(
        "/auth/login", // Pastikan URL ini sesuai dengan endpoint backend Anda
        userData,
        { headers: { "Content-Type": "application/json" } }
      );
    
      console.log("✅ Login berhasil:", response.data);
    
      // Check if the response contains the expected properties
      if (response.data && response.data.success) {
        const { token, refreshToken, user } = response.data; // Destructure the response
    
        // Store tokens in local storage
        localStorage.setItem("token", token);
        localStorage.setItem("refreshToken", refreshToken);
        localStorage.setItem("user", JSON.stringify(user)); // Store user data
    
        // Call login function from AuthContext with user data
        login(user); // Call login function from AuthContext
        navigate("/"); // Ganti dengan rute yang sesuai setelah login
      } else {
        setError({ general: "Login failed: Invalid response from server." });
      }
    } catch (error) {
      console.error("❌ Error response:", error.response?.data || error.message);
      // Handle specific error messages from the server
      if (error.response && error.response.data) {
        setError({ general: error.response.data.message || "Terjadi kesalahan!" });
      } else {
        setError({ general: "Terjadi kesalahan! Silakan coba lagi." });
      }
    } finally {
      setLoading(false); // Set loading false setelah proses selesai
    }
  };

  const handleGoogleLoginSuccess = async (response) => {
    const { tokenId } = response; // Ambil tokenId dari respons Google
    try {
      const res = await axios.post('/auth/google-login', { idToken: tokenId }); // Kirim tokenId ke backend
      localStorage.setItem("token", res.data.token);
      login(res.data.user); // Call login function from AuthContext
      navigate("/"); // Redirect setelah login
    } catch (error) {
      console.error("Google login failed:", error);
      setError({ general: "Login dengan Google gagal!" });
    }
  };

  const handleGoogleLoginFailure = (error) => {
    console.error("Google login error:", error);
    setError({ general: "Login dengan Google gagal!" });
  };

  const responseFacebook = async (response) => {
    const { accessToken } = response; // Ambil accessToken dari respons Facebook
    try {
      const res = await axios.post('/auth/facebook-login', { accessToken }); // Kirim accessToken ke backend
      localStorage.setItem("token", res.data.token);
      login(res.data.user); // Call login function from AuthContext
      navigate("/"); // Redirect setelah login
    } catch (error) {
      console.error("Facebook login failed:", error);
      setError({ general: "Login dengan Facebook gagal!" });
    }
  };

  const handleFacebookLoginFailure = (error) => {
    console.error("Facebook login error:", error);
    setError({ general: "Login dengan Facebook gagal!" });
  };

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  return (
    <div className="w-full p-8">
      <h2 className="text-2xl font-bold text-white mb-6 text-center">Login as a User</h2>
      {error.general && <p className="text-red-500 text-sm mb-4">{error.general}</p>}
      <form className="space-y-4" onSubmit={handleSubmit}>
        <InputField label="Email" name="email" value={formData.email} onChange={handleChange} error={error.email} />
        <PasswordField label="Password" name="password" value={formData.password} onChange={handleChange} showPassword={showPassword} togglePasswordVisibility={togglePasswordVisibility} error={error.password} />
        
        <div className="flex items-center justify-between">
          <div className="text-sm text-white">
            Don't have an account? <a href="/user/register" className="text-blue-500 hover:underline">Register</a>
          </div>
          <button type="submit" className="px-6 py-2 rounded-lg text-white font-medium bg-gradient-to-r from-blue-700 to-blue-500" disabled={loading}>
            {loading ? "Loading..." : buttonText}
          </button>
        </div>
      </form>

      {/* Forgot Password Link */}
      <div className="mt-4 text-center">
        <a href="/user/forgot-password" className="text-blue-500 hover:underline">Forgot Password?</a>
      </div>

      {/* Social Media Login Buttons */}
      <div className="mt-6 flex justify-center space-x-4">
        <GoogleLogin
          clientId="YOUR_GOOGLE_CLIENT_ID" // Ganti dengan Client ID Anda
          buttonText="Login with Google"
          onSuccess={handleGoogleLoginSuccess}
          onFailure={handleGoogleLoginFailure}
          cookiePolicy={'single_host_origin'}
          className="flex items-center px-4 py-2 border rounded-lg text-gray-700 border-gray-300 hover:bg-gray-100"
        />
        <FacebookLogin
          appId="YOUR_FACEBOOK_APP_ID" // Ganti dengan App ID Anda
          autoLoad={false}
          fields="name,email,picture"
          callback={responseFacebook}
          onFailure={handleFacebookLoginFailure}
          cssClass="flex items-center px-4 py-2 border rounded-lg text-gray-700 border-white hover:bg-gray-100"
          textButton="Login with Facebook"
        />
      </div>
    </div>
  );
};

const InputField = ({ label, name, value, onChange, error }) => (
  <div>
    <label className="block text-white">{label}</label>
    <input type="text" name={name} value={value} onChange={onChange} className="w-full px-4 py-2 border rounded-lg focus:ring-green-300" />
    {error && <p className="text-red-500 text-sm">{error}</p>}
  </div>
);

const PasswordField = ({ label, name, value, onChange, showPassword, togglePasswordVisibility, error }) => (
  <div>
    <label className="block text-white">{label}</label>
    <div className="relative">
      <input type={showPassword ? "text" : "password"} name={name} value={value} onChange={onChange} className="w-full px-4 py-2 border rounded-lg focus:ring-green-300" />
      <button type="button" onClick={togglePasswordVisibility} className="absolute inset-y-0 right-0 px-3 flex items-center text-sm">
        {showPassword ? "👁️" : "👁️‍🗨️"}
      </button>
    </div>
    {error && <p className="text-red-500 text-sm">{error}</p>}
  </div>
);

export default AuthFormUser ;