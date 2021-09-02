import styled from "styled-components";

export const Wrapper = styled.tr`
  //border-right: 1px solid green;
  
  :hover {
      opacity: 0.8; 
  }
  
  td {
    color: var(--highLightColor);
    border-bottom: 1px solid black; 
    width: 100px;
    text-align: center;
    padding: 5px 0;  
  }
`;
