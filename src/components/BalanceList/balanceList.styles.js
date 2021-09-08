import styled from "styled-components";

export const Wrapper = styled.div`
  overflow-x: auto;
  height: 500px;
  box-shadow: 0 4px 8px 0 black;
  background-color: var(--primaryColor);

  thead {
    color: var(--accentColor);
    width: 100px;
    text-align: center;
    border-bottom: 1px solid gray; 
  }

  table {
    width: 100%;
    height: 100%;
    margin: 0 auto;
    border-collapse: collapse;
  }
`;