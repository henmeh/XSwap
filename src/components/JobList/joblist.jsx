import React, { useState, useEffect } from "react";
// Components
import Job from "../Job/job";
// Functions
import {
  getMyEthTransactions,
  getMyPolygonTransactions,
} from "../../functions/functions";
// Styling
import { Wrapper, Content } from "./jobList.styles";
// Moralis
import moralis from "moralis";

moralis.initialize("dOiVpAxnylme9VPx99olzmbyQzB4Jk2TgL0g1Y5A");
moralis.serverURL = "https://kuuj059ugtmh.usemoralis.com:2053/server";

const JobList = ({ chain }) => {
  const [jobData, setJobData] = useState([]);
  const init = async function () {
    let query;
    let subscription;
    if (chain === 0) {
      query = new moralis.Query("EthTransactions");
      subscription = await query.subscribe();
    } else if (chain === 137) {
      query = new moralis.Query("PolygonTransactions");
      subscription = await query.subscribe();
    }
    subscription.on("create", async (object) => {
      await componentDidMount(chain);
    });
    subscription.on("update", async (object) => {
      await componentDidMount(chain);
    });
  };

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

  init();
  return (
    <Wrapper>
      <h2>
        {chain === 0
          ? "Follow your XSwaps on Ethereum"
          : "Follow your XSwaps on Polygon"}
      </h2>
      <Content>
        <table>
          <thead>
            <tr>
              <th>Tx Hash</th>
              <th>Method</th>
              <th>To Address</th>
              <th>{chain === 0 ? "Ether" : "Matic"}</th>
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
      </Content>
    </Wrapper>
  );
};

export default JobList;
