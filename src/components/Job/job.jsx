import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

const Td = styled.td`
  width: 15vh;
`;

const formatBalance = (balance, decimals) => (balance / Math.pow(10, decimals)).toFixed(3);

export default function Job(props) {
  return (
    <tr>
      <Td>{(props.hash).substring(0, 5) + "..." + (props.hash).substring((props.hash).length, (props.hash).length-5)}</Td>
      <Td>{props.method}</Td>
      <Td>{(props.toAddress).substring(0, 5) + "..." + (props.toAddress).substring((props.toAddress).length, (props.toAddress).length-5)}</Td>
      <Td>{props.ether ? formatBalance(props.ether, 18) : "-"}</Td>
      <Td>{props.tokenAmount ? formatBalance(props.tokenAmount, props.tokenDecimals) : "-"}</Td>
      <Td>{props.tokenSymbol ? props.tokenSymbol : "-"}</Td>
      <Td>{props.status ? "confirmed" : "pending"}</Td>
      <Td>{props.activity ? <button>ToDo</button> : "-"}</Td>
    </tr>
  );
}

/*Job.propTypes = {
  hash: PropTypes.string.isRequired,
  method: PropTypes.string.isRequired,
  toAddress: PropTypes.string.isRequired,
  ether: PropTypes.string.isRequired,
  tokenAmount: PropTypes.isRequired,
  tokenSymbol: PropTypes.isRequired,
  status: PropTypes.bool.isRequired,
  activity: PropTypes.string.isRequired,  
};*/