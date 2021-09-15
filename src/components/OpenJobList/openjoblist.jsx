import React, { useState, useEffect } from "react";
// Components
import OpenJob from "../OpenJob/openjob";
// Functions
import { getMyJobs, swapTokens } from "../../functions/functions";
// Styling
import { Wrapper, Content } from "./OpenJobList.styles";
// Moralis
import moralis from "moralis";

//Mainnet
//moralis.initialize("dOiVpAxnylme9VPx99olzmbyQzB4Jk2TgL0g1Y5A");
//moralis.serverURL = "https://kuuj059ugtmh.usemoralis.com:2053/server";

//Testnet
moralis.initialize("WkrP3HyS5n1oBT76fHjMKoHEg5dDjBxXeFJUiOOj");
moralis.serverURL = "https://0kvvzllxphoo.bigmoralis.com:2053/server";

const OpenJobList = () => {
  const [openJobData, setOpenJobData] = useState([]);

  const componentDidMount = async () => {
    let openJobs;
    openJobs = await getMyJobs();
    setOpenJobData(openJobs);
    /*let openJobsToDo = [];
    if(openJobs.length !== 0) {
      for(var i = 0; i < openJobs.length; i++) {
        if(openJobs[i].attributes.status === "posbridging" || openJobs[i].attributes.status === "plasmabridging") {
          console.log(openJobs[i].id);
          //const promise = await swapTokens(openJobs[i].id);
          //openJobsToDo.push(promise);
        }
      }
      //await Promise.all(openJobsToDo);
    }*/
  };

  const init = async function () {
    let query;
    let subscription;
    query = new moralis.Query("Jobs");
    subscription = await query.subscribe();
    subscription.on("delete", async () => {
      await componentDidMount();
    });
    subscription.on("create", async () => {
      await componentDidMount();
    });
    subscription.on("update", async () => {
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
              <th>XSwap Status</th>
              <th>ToDo</th>
            </tr>
          </thead>
          <tbody>
            {openJobData.map((job) => (
              <OpenJob key={job.id} jobId={job.id} fromTokenSymbol={job.attributes.fromTokenSymbol} toTokenSymbol={job.attributes.toTokenSymbol} status={job.attributes.status}/>
            ))}
          </tbody>
        </table>
      </Content>
    </Wrapper>
  );
};

export default OpenJobList;
