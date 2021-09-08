import React, { useState, useEffect } from "react";
// Components
import BalanceList from "./BalanceList/balancelist";
import DonutChart from "./DonutChart/donutchart";
import Swap from "./Swap/swap";
import styled from "styled-components";
// Functions
import { getMyBalances } from "../functions/functions";

// Display as Grid
const Wrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
  grid-column-gap: 15px;
  grid-row-gap: 15px;
  padding: 5px 5px;
  align-items: center;
  width: 100%;
  
  @media (max-width: 1510px) {
    margin: 40px 0 0 0;
    .item3{
      grid-column: 1 / 3;
    }
  }

  @media (max-width: 1010px) {
    grid-column-gap: 0px;
    .item2{
      grid-column: 1 / 3;
    }
    .item3{
      grid-column: 1 / 4;
    }
  }
`;

const Home = ({ user }) => {
  const [balanceData, setBalanceData] = useState(false);

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
    return (
      <Wrapper>
        <div class="item1"><BalanceList balanceData={balanceData} /></div>
        <div class="item2"><DonutChart balanceData={balanceData} /></div>
        <div class="item3"><Swap /></div>
      </Wrapper>
    );
  } else {
    return <div style={{ color: "white" }}>Log dich ein Alter</div>;
  }
};

export default Home;

/*
<div class="item1"><BalanceList balanceData={balanceData} /></div>
        <div class="item2"><DonutChart balanceData={balanceData} /></div>
        <div class="item3"><Swap /></div>
*/
