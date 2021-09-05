import React from "react";
// Styles
import { Wrapper } from "./navBar.styles";
// Components
import { Link } from "react-router-dom";
import Image from "../Image/image";
import swap from "../../Images/swap.png";
import bill from "../../Images/bill.png";

const NavBar = () => {
  return (
    <Wrapper>
      <Link id="link-side1" to="/">
        <div>
          <Image image={swap} height={25} width={25} />
          MyBalance / Swap
        </div>
      </Link>
      <Link id="link-side2" to="/myXSwaps">
        <div>
          <Image image={bill} height={25} />
          My XSwaps
        </div>
      </Link>
    </Wrapper>
  );
};

export default NavBar;