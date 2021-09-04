import React from "react";
// Styling
import { Wrapper, Content } from "./Header.styles";
// Button
import NormalButton from "../Buttons/NormalButton/normalbutton";

const Header = ({ user, LogIn, LogOut }) => {
  return (
    <Wrapper>
      <h1>XSwap</h1>
      <div>
        {user ? `Logged in with: ${user.attributes.ethAddress}` : null}
        <NormalButton
          text={user ? "LogOut" : "LogIn"}
          onClick={user ? LogOut : LogIn}
        />
      </div>
    </Wrapper>
  );
};

export default Header;
