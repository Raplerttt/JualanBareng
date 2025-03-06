import React from "react";
import Main from "../components/layout/Main";
import LoginFormUser from "../user/UserLoginForm";

const UserLoginPages = () => {
  return (
    <div className="bg-blue-200">
    {/* <Main> */}
        <LoginFormUser/>
    {/* </Main> */}
    </div>
  );
};

export default UserLoginPages;