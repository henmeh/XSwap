import React from "react";
// Styles
import { Wrapper } from './MyXSwap.styles';
// Component
import JobList from "../../components/JobList/joblist";

const MyXSwaps = ({ user }) => {
  if (user) {
    return (
      <Wrapper>
        <JobList chain={0} /> <JobList chain={137} />
      </Wrapper>
    );
  } else {
    return <div style={{ color: "white" }}>Log dich ein Alter</div>;
  }
};

export default MyXSwaps;
