import React from "react";
// Style
import { Wrapper } from "./Image.styles";

const Image = ({ image, alt, height, width, marginRight }) => (
  <>
    <Wrapper src={image} alt={alt} height={height} width={width} marginRight={marginRight} />
  </>
);

export default Image;
