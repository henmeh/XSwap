import styled from "styled-components";

export const Wrapper = styled.div`
  //background: var(--backgroundColor);
  text-align: center;
  color: var(--highLightColor);
`;

export const Content = styled.div`
  height: 450px;
  overflow-x: auto;
  box-shadow: 0 4px 8px 0 black;

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
    background-color: var(--primaryColor);
  }
`;