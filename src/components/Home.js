import React, { useState, useEffect } from "react";
// Components
import BalanceList from "./BalanceList/balancelist";
import DonutChart from "./DonutChart/donutchart";
import styled from "styled-components";
// Functions
import { getMyBalances } from "../functions/functions";

// Display as Grid
const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-column-gap: 10px;
  align-items: center;
  justify-content: center;
  padding: 5px 5px;

  @media (max-width: 1000px) {
    grid-template-columns: 1fr;
    grid-row-gap: 10px;
  }
`;

/*
// Display as FlexBox
const Wrapper = styled.div`
  display: flex;
  //flex-direction: row;
  justify-content: space-around;
  align-items: center;
  padding: 5px 5px;
  //flex-wrap: wrap;
  //height: 1500px;

  //@media (max-width: 768px) {
  //  flex-direction: column;
  //}
`;
*/

const Home = ({ user }) => {
  const [balanceData, setBalanceData] = useState([]);

  const componentDidMount = async () => {
    let balances = await getMyBalances();
    setBalanceData(balances);
  };

  useEffect(() => {
      componentDidMount();
  }, []);

  if (user) {
    return (
      <Wrapper>
        <BalanceList balanceData={balanceData} />
        <DonutChart balanceData={balanceData}/>
      </Wrapper>
    );
  } else {
    return <div style={{ color: "white" }}>Log dich ein Alter</div>;
  }
};

export default Home;

/*

*/