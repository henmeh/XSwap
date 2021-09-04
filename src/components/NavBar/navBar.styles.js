import styled from "styled-components";

export const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  padding: 14px 16px;
  
  #link-side1 {
    margin-right: 25px;
    color: var(--highLightColor);
  }
  #link-side2 {
    margin-left: 25px;
    color: var(--highLightColor);
  }

  div {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
`;

