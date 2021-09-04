import React from "react";
// Styling
import { Wrapper, Content } from "./Header.styles";
// Button
import NormalButton from "../Buttons/NormalButton/normalbutton";

const Header = ({ user, LogIn, LogOut }) => {
  return (
    <Wrapper>
      <h1>XSwap</h1>
      <NormalButton
        text={user ? "LogOut" : "LogIn"}
        onClick={user ? LogOut : LogIn}
      />
    </Wrapper>
  );
};

export default Header;
