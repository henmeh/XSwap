import React, { useState, useEffect } from "react";
// Styling 
import { Wrapper } from './HomeView.styles';
// Components
import BalanceList from "../../components/BalanceList/balancelist";
import DonutChart from "../../components/DonutChart/donutchart";
import Swap from "../../components/Swap/swap";
// Functions
import { getMyBalances } from "../../functions/functions";
// Moralis
import moralis from "moralis";

//Mainnet
//moralis.initialize("dOiVpAxnylme9VPx99olzmbyQzB4Jk2TgL0g1Y5A");
//moralis.serverURL = "https://kuuj059ugtmh.usemoralis.com:2053/server";

//Testnet
moralis.initialize("WkrP3HyS5n1oBT76fHjMKoHEg5dDjBxXeFJUiOOj");
moralis.serverURL = "https://0kvvzllxphoo.bigmoralis.com:2053/server";

const Home = ({ user }) => {
  const [balanceData, setBalanceData] = useState(false);

  const init = async function () {
    let queryEthBalance = new moralis.Query("EthBalance");
    let subscriptionEthBalance = await queryEthBalance.subscribe();
    let queryPolygonBalance = new moralis.Query("PolygonBalance");
    let subscriptionPolygonBalance = await queryPolygonBalance.subscribe();
    let queryEthTokenBalance = new moralis.Query("EthTokenBalance");
    let subscriptionEthTokenBalance = await queryEthTokenBalance.subscribe();
    let queryPolygonTokenBalance = new moralis.Query("PolygonTokenBalance");
    let subscriptionPolygonTokenBalance = await queryPolygonTokenBalance.subscribe();

    subscriptionEthBalance.on("create", async (object) => {
      await componentDidMount();
    });
    subscriptionEthBalance.on("update", async (object) => {
      await componentDidMount();
    });
    subscriptionPolygonBalance.on("create", async (object) => {
      await componentDidMount();
    });
    subscriptionPolygonBalance.on("update", async (object) => {
      await componentDidMount();
    });
    subscriptionEthTokenBalance.on("create", async (object) => {
      await componentDidMount();
    });
    subscriptionEthTokenBalance.on("update", async (object) => {
      await componentDidMount();
    });
    subscriptionPolygonTokenBalance.on("create", async (object) => {
      await componentDidMount();
    });
    subscriptionPolygonTokenBalance.on("update", async (object) => {
      await componentDidMount();
    });
  }

  const componentDidMount = async () => {
    let balances = await getMyBalances();
    setBalanceData(balances);
  };

  useEffect(() => {
    if (!balanceData) {
      componentDidMount();
    }
  });

  if (user) {
    init();
    return (
      <Wrapper>
        <div className="item1"><BalanceList balanceData={balanceData} /></div>
       
        <div className="item3"><Swap /></div>
      </Wrapper>
    );
  } else {
    return <div style={{ color: "white" }}>Log dich ein Alter</div>;
  }
};

export default Home;

/*
 <div className="item2"><DonutChart balanceData={balanceData} /></div>
*/