import React from "react";
// Styles
import { Wrapper } from "./Footer.styles";
// Components
import Image from "../Image/image";
import moralis from "../../Images/moralis.png";
import oneInch from "../../Images/1inch.png";
import polygon from "../../Images/polygon.png";

const Footer = () => (
  <Wrapper>
    Built with: 
    <Image className="moralisImage" image={moralis} height={25} />
    <Image className="oneInchImage" image={oneInch} height={25} />
    <Image className="polygonImage" image={polygon} height={25} />
  </Wrapper>
);

export default Footer;
