import React from "react";
// Styles
import { Wrapper } from "./Job.styles";

const formatBalance = (balance, decimals) =>
  (balance / Math.pow(10, decimals)).toFixed(8);

const formatAddresses = (address) => 
  (`${address.substr(0, 6)}...${address.substr(address.length - 6)}`);


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
  chain
}) => (
  <Wrapper>
    <td> { chain === 0 ? <a href={`https://etherscan.io/tx/${hash}`} target="_tab">{formatAddresses(hash)}</a> : <a href={`https://polygonscan.com/tx/${hash}`} target="_tab">{formatAddresses(hash)}</a> }</td>
    <td> {method}</td>
    <td> {formatAddresses(toAddress)}</td>
    <td> {value === 0 ? "0" : formatBalance(value, 18)}</td>
    <td> {tokenAmount ? formatBalance(tokenAmount, tokenDecimals) : "-"} </td>
    <td> {tokenSymbol} </td>
    <td> {status ? "confirmed" : "pending"} </td>
    {chain===137 && <td> {activity && activityId } </td>}
  </Wrapper>
);

export default Job;
