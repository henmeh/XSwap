import styled from "styled-components";

export const Wrapper = styled.div`
  overflow-x: auto;
  height: 250px;
  box-shadow: 0 4px 8px 0 black;
  background-color: var(--primaryColor);
  color: var(--highLightColor);
  padding: 10px 20px;

  #from-token-select {
      display: flex;
      justify-content: space-between;
  }

  #swapamount-input {
      display: flex;
      justify-content: center;
      margin: 10px 0 0 0;
  }

  #swapbutton {
      display: flex;
      justify-content: center;
      margin: 10px 0 0 0;
  }

  #expected-return {
      display: flex;
      justify-content: center;
      margin: 10px 0 0 0;
  }

  #expected-return-value {
      display: flex;
      justify-content: center;
      margin: 10px 0 0 0;
  }

  #to-token-select {
      display: flex;
      justify-content: space-between;
  }
`;