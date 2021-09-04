import React from "react";
// Style
import { Wrapper } from "./Image.styles";

const Image = ({ image, alt, height, marginRight }) => (
  <>
    <Wrapper src={image} alt={alt} height={height} marginRight={marginRight} />
  </>
);

export default Image;
