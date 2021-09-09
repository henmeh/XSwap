import React from "react";
// Style
import { Wrapper } from "./Image.styles";

const Image = ({ className, image, alt, height, width, marginRight }) => (
  <>
    <Wrapper className = {className} src={image} alt={alt} height={height} width={width} marginRight={marginRight} />
  </>
);

export default Image;
