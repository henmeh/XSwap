import React, { useState } from "react";
// Styles
import { Wrapper } from "./MyXSwap.styles";
// Component
import JobList from "../../components/JobList/joblist";
import OpenJobList from "../../components/OpenJobList/openjoblist";
import ImageButton from "../../components/Buttons/ImageButton/imagebutton";
import Ethereum from "../../Images/ethereum.png";
import Polygon from "../../Images/polygon3.png";

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
            <ImageButton image={Ethereum} height={25} onClick={() => setChain(1)} />
            <ImageButton image={Polygon} height={25} onClick={() => setChain(137)} />
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
