import React from "react";
// Styles
import { Wrapper } from "./navBar.styles";
// Components
import { Link } from "react-router-dom";

const NavBar = () => {
  return (
      <Wrapper>
        <Link id="link-side1" to="/"><span>MyBalances</span></Link>
        <Link id="link-side2" to="/myXSwaps">My XSwaps</Link>
      </Wrapper>
  );
};

export default NavBar;
