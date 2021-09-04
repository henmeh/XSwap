import React, { useState, useEffect } from "react";
// Components
import Job from '../Job/job';
// Functions
import { getMyEthTransactions, getMyPolygonTransactions } from "../../functions/functions";
// Styling
import { Wrapper } from "./jobList.styles";

const JobList = ({ chain }) => {
  const [jobData, setJobData] = useState([]);

  const componentDidMount = async () => {
    let jobs = [];
    if (chain === 0) {
      jobs = await getMyEthTransactions();
    } else if (chain === 137) {
      jobs = await getMyPolygonTransactions();
    }
    setJobData(jobs);
    console.log(jobData);
  };

  useEffect(() => {
    //if(ethJobData.length === 0) {
    componentDidMount();
    //}
  }, []);

  return (
    <Wrapper>
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
            {chain === 137 ? <th>Activity</th> : null}
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
                />
              )
            )}
          </tbody>
      </table>
    </Wrapper>
  );
};

export default JobList;
