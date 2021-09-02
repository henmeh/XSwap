import React from "react";
// Styles
import { Wrapper, Content } from "./navBar.styles";
// Components
import { Link } from "react-router-dom";

const NavBar = () => {
  return (
    <Wrapper>
      <Content>
        <a><Link to="/">Seite 1</Link></a>
        <a><Link to="/">Seite 2</Link></a>
      </Content>
    </Wrapper>
  );
};

export default NavBar;
