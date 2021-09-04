import React from "react";

import styled from "styled-components";
import JobList from "./JobList/joblist";

// Display as Grid
const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-column-gap: 10px;
  align-items: center;
  padding: 5px 5px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    grid-row-gap: 10px;
  
  }
`;

const MyXSwaps = ({ user }) => {
  return (     
    <Wrapper> 
     <JobList chain={0}/>
     <JobList chain={137}/>
  </Wrapper>
  );
};

export default MyXSwaps;