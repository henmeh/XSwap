import React, { useState, useEffect } from "react";
// Components
import Job from '../Job/job';
// Functions
import { getMyEthTransactions, getMyPolygonTransactions } from "../../functions/functions";
// Styling
import { Wrapper } from "./jobList.styles";

const JobList = ({ chain }) => {
  const [jobData, setJobData] = useState([]);

  const componentDidMount = async (_chain) => {
    let jobs = [];
    if (_chain === 0) {
      jobs = await getMyEthTransactions();
    } else if (_chain === 137) {
      jobs = await getMyPolygonTransactions();
    }
    setJobData(jobs);
  };

  useEffect(() => {
    //if(ethJobData.length === 0) {
    componentDidMount(chain);
    //}
  }, [chain]);

  return (
    <Wrapper>
     <h2>{chain === 0 ? "Follow your XSwaps on Ehtereum" : "Follow your XSwaps on Polygon"}</h2>
      <table>
        <thead>
          <tr>
            <th>Tx Hash</th>
            <th>Method</th>
            <th>To Address</th>
            <th>Ether</th>
            <th>Token Amount</th>
            <th>TokenSymbol</th>
            <th>Status</th>
            {chain === 137 && <th>Activity</th>}
          </tr>
        </thead>
        <tbody>
            {jobData.map(
              ({
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
                <Job
                  key={hash}
                  hash={hash}
                  method={method}
                  toAddress={toAddress}
                  value={parseInt(value)}
                  tokenAmount={parseInt(tokenAmount)}
                  tokenDecimals={parseInt(tokenDecimals)}
                  tokenSymbol={tokenSymbol}
                  status={status}
                  activity={activity}
                  activityId={activityId}
                  chain={chain}
                />
              )
            )}
          </tbody>
      </table>
    </Wrapper>
  );
};

export default JobList;
