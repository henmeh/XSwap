import React from "react";
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