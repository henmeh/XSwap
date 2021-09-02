import React from "react";
import { Wrapper } from "./NormalButton.styles";
import PropTypes from "prop-types";

const NormalButton = ({ text, onClick }) => (
  <Wrapper type="button" onClick={onClick}>
    {text}
  </Wrapper>
);

NormalButton.propTypes = {
  text: PropTypes.string,
  callback: PropTypes.func,
};

export default NormalButton;
