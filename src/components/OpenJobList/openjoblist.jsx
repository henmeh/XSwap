import React, { useState, useEffect } from "react";
// Components
import OpenJob from "../OpenJob/openjob";
// Functions
import { getMyJobs } from "../../functions/functions";
// Styling
import { Wrapper, Content } from "./OpenJobList.styles";
// Moralis
import moralis from "moralis";

moralis.initialize("dOiVpAxnylme9VPx99olzmbyQzB4Jk2TgL0g1Y5A");
moralis.serverURL = "https://kuuj059ugtmh.usemoralis.com:2053/server";

const OpenJobList = () => {
  const [openJobData, setOpenJobData] = useState([]);

  const componentDidMount = async () => {
    let openJobs;
    openJobs = await getMyJobs();
    setOpenJobData(openJobs);
  };

  const init = async function () {
    let query;
    let subscription;
    query = new moralis.Query("Jobs");
    subscription = await query.subscribe();
    subscription.on("delete", async () => {
      await componentDidMount();
    });
  };

  init();

  useEffect(() => {
    componentDidMount();
  }, []);

  return (
    <Wrapper>
      <h2>Open XSwaps</h2>
      <Content>
        <table>
          <thead>
            <tr>
              <th>XSwapId</th>
              <th>XSwap Description</th>
              <th>ToDo</th>
            </tr>
          </thead>
          <tbody>
            {openJobData.map((job) => (
              <OpenJob key={job.id} jobId={job.id} fromTokenSymbol={job.attributes.fromTokenSymbol} toTokenSymbol={job.attributes.toTokenSymbol}/>
            ))}
          </tbody>
        </table>
      </Content>
    </Wrapper>
  );
};

export default OpenJobList;
