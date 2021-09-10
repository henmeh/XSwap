import React from "react";
// Styles
import { Wrapper } from "./OpenJob.styles";
// Components
import NormalButton from "../Buttons/NormalButton/normalbutton";
// Functions
import {
  deleteJobById,
  getJobById,
  swapTokens,
} from "../../functions/functions";

const deleteJob = async (_jobId) => {
  await deleteJobById(_jobId);
};

const continueJob = async (_jobId) => {
  const job = await getJobById(_jobId);
  await swapTokens(
    job.attributes.fromTokenAddress,
    job.attributes.toTokenAddress,
    job.attributes.amount,
    job.attributes.fromChain,
    job.attributes.toChain,
    job.attributes.slippage,
    job.attributes.status
  );
};

const OpenJob = ({ jobId, fromTokenSymbol, toTokenSymbol }) => (
  <Wrapper>
    <td> {jobId} </td>
    <td> {`${fromTokenSymbol} -> ${toTokenSymbol}`} </td>
    <td>
      <div>
        <NormalButton text={"Continue"} onClick={() => continueJob(jobId)} />
        <NormalButton text={"Delete"} onClick={() => deleteJob(jobId)} />
      </div>
    </td>
  </Wrapper>
);

export default OpenJob;
/*

*/