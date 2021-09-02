import React from "react";
// Styles
import { Wrapper } from "./Balance.style";
import PropTypes from "prop-types";
import MyImage from "../Image/image";

const formatBalance = (balance, decimals) => (balance / Math.pow(10, decimals)).toFixed(8);
const valueCalculator = (balance, decimals, price) => ((balance / Math.pow(10, decimals)) * price).toFixed(2);

export default function Balance(props) {
  return (
    <Wrapper>
        <td>
          <MyImage image={props.image} alt="-" height={25} />
        </td>
        <td>{props.name}</td>
        <td>{props.symbol}</td>
        <td>{formatBalance(props.balance, props.decimals)}</td>
        <td>
          <MyImage image={props.chain} alt="-" height={25} />
        </td>
        <td>
          {valueCalculator(props.balance, props.decimals, props.usdPrice)}
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
