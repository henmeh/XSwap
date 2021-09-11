import React from "react";
// Styles
import { Wrapper } from "./Job.styles";
// Packages
import { DateTime } from "luxon";

const formatBalance = (balance, decimals) =>
  (balance / Math.pow(10, decimals)).toFixed(8);

const formatAddresses = (address) => 
  (`${address.substr(0, 6)}...${address.substr(address.length - 6)}`);

//const formatDate = (date) => (
//  );


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
  chain,
  date
}) => (
  <Wrapper>
    <td> { chain === 1 ? <a href={`https://etherscan.io/tx/${hash}`} target="_tab">{formatAddresses(hash)}</a> : <a href={`https://polygonscan.com/tx/${hash}`} target="_tab">{formatAddresses(hash)}</a> }</td>
    <td> {method}</td>
    <td> {formatAddresses(toAddress)}</td>
    <td> {value === 0 ? "0" : formatBalance(value, 18)}</td>
    <td> {tokenAmount ? formatBalance(tokenAmount, tokenDecimals) : "-"} </td>
    <td> {tokenSymbol} </td>
    <td> {date.toString().substring(0,24)} </td>
    <td> {status ? "confirmed" : "pending"} </td>
  </Wrapper>
);

export default Job;
