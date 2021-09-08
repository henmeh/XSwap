import styled from "styled-components";

export const Wrapper = styled.div`
  //width: 400px;
  height: 500px;
  box-shadow: 0 4px 8px 0 black;
  background-color: var(--primaryColor);
  text-align: center;
  color: white;
  display: flex;
  flex-direction: column;

  h2 {
    position: absolute;
    top: 42%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  

  @media (max-width: 1010px) {
    //    grid-column: 1 / 3;
    display: flex;
    justify-items: center;
    align-items: center;
  }
`;
