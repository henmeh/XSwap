import React from "react";
// Styles
import { Wrapper } from "./Balance.style";
import PropTypes from "prop-types";
// Components
import Image from "../Image/image";
import NoImage from "../../Images/NoImage.png";

const formatBalance = (balance, decimals) => (balance / Math.pow(10, decimals)).toFixed(8);
const valueCalculator = (balance, decimals, price) => ((balance / Math.pow(10, decimals)) * price).toFixed(2);

export default function Balance({ image, name, symbol, balance, decimals, chain, usdPrice }) {
  return (
    <Wrapper>
        <td>
          <Image image={image ? image : NoImage} alt="TokenLogo" height={25} />
        </td>
        <td>{name}</td>
        <td>{symbol}</td>
        <td>{formatBalance(balance, decimals)}</td>
        <td>
          <Image image={chain} alt="ChainLogo" height={25} />
        </td>
        <td>
          {valueCalculator(balance, decimals, usdPrice)}
        </td>
    </Wrapper>
  );
}

Balance.propTypes = {
  symbol: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  balance: PropTypes.number.isRequired,
  decimals: PropTypes.number.isRequired,
};
