import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import Main from "../components/layout/Main";
import Navbar from "../components/layout/NavbarComponents";
import Footer from "../components/layout/FooterComponents";
import ChatComponents from "../components/ChatComponents";
import { AuthContext } from "../auth/authContext";

const ChatPages = () => {
  const { isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/user/login"); // Ganti sesuai path halaman login Anda
  };

  return (
    <>
        <Navbar />
        {isAuthenticated ? (
          <ChatComponents />
        ) : (
          <div style={{ textAlign: "center", marginTop: "20px" }}>
            <h2>Anda harus masuk untuk melihat halaman ini.</h2>
            <button
              onClick={handleLogin}
              style={{ padding: "10px 20px", fontSize: "16px" }}
            >
              Masuk
            </button>
          </div>
        )}
      <Footer />
    </>
  );
};

export default ChatPages;