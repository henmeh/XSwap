import React from "react";
// Components
import BalanceList from "./BalanceList/balancelist";

import styled from "styled-components";

// Display as Grid
const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  grid-column-gap: 10px;
  align-items: center;
  padding: 5px 5px;
  
  @media (max-width: 768px) {
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
  return (     
    <Wrapper> 
      {user ? (
        <BalanceList />
      ) : (
        <div style={{ color: "white" }}>Log dich ein Alter</div>
      )}
  </Wrapper>
  );
};

export default Home;