import React from "react";
import Job from "../Job/job";
import styled from "styled-components";

const Table = styled.table`
  font-size: 1.4rem;
  margin: 0px 0px 0px 0px
`;

const Tr = styled.tr`
border: 1px solid #cccccc;
`

export default function SwapJobList(props) {
    return (
      <Table className="table table-primary table-bordered">
        <thead>
          <Tr>
          <th>TxHash</th>
            <th>Methode</th>
            <th>To Address</th>
            <th>Ether</th>
            <th>Token Amount</th>
            <th>Token Symbol</th>
            <th>Status</th>
            <th>Activity</th>
          </Tr>
        </thead>
        <tbody>
          {props.jobData.map(({ hash, method, toAddress, ether, tokenAmount, tokenSymbol, tokenDecimals, status, activity }) => (
            <Job
              key={hash}
              hash={hash}
              method={method}
              toAddress={toAddress}
              ether={ether}
              tokenAmount={tokenAmount}
              tokenSymbol={tokenSymbol}
              tokenDecimals={tokenDecimals}
              status={status}
              activity={activity}
            />
          ))}
        </tbody>
      </Table>
    );
  
}