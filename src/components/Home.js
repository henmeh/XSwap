import React from 'react';
// Components
import BalanceList from './BalanceList/balancelist';
import NavBar from './NavBar/navbar';
import Swap from './Swap/swap';

import styled from "styled-components";

const Div = styled.div`
  display: flex;
  justify-content: center;
  padding: 5px 5px;
`;

const Home = ({ user }) => {
  return (
  <>
    <NavBar />
    {user ? <Div>
      <BalanceList />
      <Swap />
    </Div> : <div>Log dich ein Alter</div>}
  </>
  );};

export default Home;
