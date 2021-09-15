import React, { useEffect } from "react";
// Styles
import { Wrapper } from "./OpenJob.styles";
// Components
import NormalButton from "../Buttons/NormalButton/normalbutton";
// Functions
import { deleteJobById, swapTokens } from "../../functions/functions";

const deleteJob = async (_jobId) => {
  await deleteJobById(_jobId);
};

const continueJob = async (_jobId) => {
  await swapTokens(_jobId);
};

const OpenJob = ({ jobId, fromTokenSymbol, toTokenSymbol, status }) => {
  let _statusToShow;
  if (status === "Tokens swapped on 137") {
    _statusToShow = "Tokens swapped on Polygon";
  }
  else if (status === "Tokens swapped on 1") {
    _statusToShow = "Tokens swapped on Ethereum";
  }

  const componentDidMount = async () => {
    status === "wait to confirm PoS-Bridingprocess" || status === "wait to confirm Plasma-Bridgingprocess" && await swapTokens(jobId); 
  };

  useEffect(() => {
    componentDidMount();
  }, []);

  //if(status === "new" || status === "posbridgingcompleted" || status === "swapped1" || status === "swapped137" || status === "plasmabridgingcompleted" || status === "erc20PolygonToEthCompleted" || status === "erc20Exit" || status === "challenge period") {
    return (
      <Wrapper>
        <td> {jobId} </td>
        <td> {`XSwap from ${fromTokenSymbol} to ${toTokenSymbol}`} </td>
        <td> {status === "Tokens swapped on 137" || status === "Tokens swapped on 1" ? _statusToShow : status} </td>
        <td>
          <div>       
            <NormalButton text={"Continue"} onClick={() => continueJob(jobId)} />
            <NormalButton text={"Delete"} onClick={() => deleteJob(jobId)} />
          </div>
        </td>
      </Wrapper>
    )
  //}
  /*else {
    return (
      <Wrapper>
        <td> {jobId} </td>
        <td> {`${fromTokenSymbol} -> ${toTokenSymbol}`} </td>
        <td>
          <div>        
            Wait for Bridging
            <NormalButton text={"Delete"} onClick={() => deleteJob(jobId)} />
          </div>
        </td>
      </Wrapper>
    )
  }*/
};

export default OpenJob;