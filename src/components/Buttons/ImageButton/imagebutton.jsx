import React from "react";
// Components
import Image from "../../Image/image";
// Styling
import { Wrapper } from "./ImageButton.styles";

const ImageButton = ({ image, height, onClick }) => (
  <Wrapper type="button" onClick={onClick}>
    <Image className={"imageButtont"} image={image} alt="image-button" height={height} />
  </Wrapper>
);

export default ImageButton;
