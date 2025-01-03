import React from "react";
import Main from "../components/Main";
import Navbar from "../components/NavbarComponents";
import Footer from "../components/FooterComponents";
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