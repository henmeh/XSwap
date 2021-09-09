import React, { useState, useEffect } from "react";
// Components
import OpenJob from "../OpenJob/openjob";
// Functions
import { getMyJobs } from "../../functions/functions";
// Styling
import { Wrapper, Content } from "./OpenJobList.styles";

const OpenJobList = () => {
  const [openJobData, setOpenJobData] = useState([]);

  const componentDidMount = async () => {
    let openJobs;
    openJobs = await getMyJobs();
    setOpenJobData(openJobs);
  };

  useEffect(() => {
    componentDidMount();
  }, []);

  return (
    <Wrapper>
      <h2>Open XSwaps</h2>
      <Content>
        <table>
          <thead>
            <tr>
              <th>XSwapId</th>
              <th>ToDo</th>
            </tr>
          </thead>
          <tbody>
            {openJobData.map(({ id }) => (
              <OpenJob key={id} jobId={id} />
            ))}
          </tbody>
        </table>
      </Content>
    </Wrapper>
  );
};

export default OpenJobList;
