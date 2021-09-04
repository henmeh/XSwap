import React from "react";
// Styles
//import { Wrapper } from "./Balance.style";
//import PropTypes from "prop-types";
//import Image from "../Image/image";

const formatBalance = (balance, decimals) =>
  (balance / Math.pow(10, decimals)).toFixed(8);
const valueCalculator = (balance, decimals, price) =>
  ((balance / Math.pow(10, decimals)) * price).toFixed(2);

const Job = ({
  hash,
  method,
  toAddress,
  value,
  tokenAmount,
  tokenDecimals,
  tokenSymbol,
  status,
  activity,
  activityId,
}) => (
  <tr>
    <td> {hash} </td>
    <td> {method}</td>
    <td> {toAddress}</td>
    <td> {value}</td>
    <td> {tokenAmount} </td>
    <td> {tokenSymbol} </td>
    <td> {status} </td>
    <td> {activity} </td>
  </tr>
);

export default Job;
