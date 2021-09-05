import styled from "styled-components";

export const Wrapper = styled.div`
  //width: 400px;
  overflow-x: auto;
  height: 500px;
  box-shadow: 0 4px 8px 0 black;
  background-color: var(--primaryColor);

  h2 {
    color: var(--highLightColor);
    text-align: center;
  }

  div {
  }

  @media (max-width: 1000px) {
    justify-self: center;
  }
`;
