import React, { useContext } from "react";
import { AuthContext } from "../../App";
//import "./RandomName.css";

function Menu() {
  const loginStatus = useContext(AuthContext);

  return (
    <div className="main-menu">
      {loginStatus.isLogin ? "Log Out" : "Log In"}
    </div>
  );
}

export default Menu;
