import styled from "styled-components";

export const Wrapper = styled.div`
  background: var(--backgroundColor);
  overflow-x: auto;

  thead {
    color: var(--accentColor);
    width: 100px;
    text-align: center;
    border-bottom: 1px solid gray; 
    //margin: auto;
  }

  table {
    //width: 100%;
    margin: 0 20px;
    border-collapse: collapse;
    background-color: var(--primaryColor);
    box-shadow: 0 4px 8px 0 black;
  }
`;