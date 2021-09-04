import styled from "styled-components";

export const Wrapper = styled.div`
  //background: var(--backgroundColor);
  overflow-x: auto;
  height: 500px;

  thead {
    color: var(--accentColor);
    width: 100px;
    text-align: center;
    border-bottom: 1px solid gray; 
  }

  table {
    margin: 0 auto;
    border-collapse: collapse;
    background-color: var(--primaryColor);
    box-shadow: 0 4px 8px 0 black;
  }
`;