import React from "react";
import Main from "../components/layout/Main";
import Navbar from "../components/layout/NavbarComponents";
import Footer from "../components/layout/FooterComponents";
import ChatComponents from "../components/ChatComponents";


const ChatPages = () => {
  return (
    <>
    <Main>
      <Navbar />
      <ChatComponents />
    </Main>
      <Footer />
    </>
  );
};

export default ChatPages;