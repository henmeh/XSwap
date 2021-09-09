import React from "react";
// Styles
import { Wrapper } from "./OpenJob.styles";

const OpenJob = ({ jobId }) => (
  <Wrapper>
    <td> {jobId} </td>
    <td> Hier kommen die Buttons hin </td>
  </Wrapper>
);

export default OpenJob;
