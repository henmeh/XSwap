import styled from "styled-components";

export const Wrapper = styled.tr`
  :hover {
    opacity: 0.8;
  }

  td {
    color: var(--highLightColor);
    border-bottom: 1px solid black;
    text-align: center;
    padding: 5px 0;
  }

  div {
    display: flex;
    flex-direction: row;
    justify-content: center;
  }
`;
