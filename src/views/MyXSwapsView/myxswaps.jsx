import React, { useState, useEffect } from "react";
// Styles
import { Wrapper } from "./MyXSwap.styles";
// Component
import JobList from "../../components/JobList/joblist";
import OpenJobList from "../../components/OpenJobList/openjoblist";
import NormalButton from "../../components/Buttons/NormalButton/normalbutton";

const MyXSwaps = ({ user }) => {
  const [chain, setChain] = useState(1);

  if (user) {
    return (
      <Wrapper>
        <div className="openJobs">
          <OpenJobList />
        </div>
        <div className="transactions">
          <div className="chainButtons">
            <NormalButton text={"Ethereum"} onClick={() => setChain(1)} />
            <NormalButton text={"Polygon"} onClick={() => setChain(137)} />
            <h2>
              {chain === 1
                ? "Follow your XSwaps on Ethereum"
                : "Follow your XSwaps on Polygon"}
            </h2>
          </div>
          <JobList chain={chain} />
        </div>
      </Wrapper>
    );
  } else {
    return <div style={{ color: "white" }}>Log dich ein Alter</div>;
  }
};

export default MyXSwaps;
