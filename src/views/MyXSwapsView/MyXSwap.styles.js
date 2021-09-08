import styled from "styled-components";

export const Wrapper = styled.div`
display: grid;
grid-template-columns: 1fr 1fr;
grid-column-gap: 10px;
align-items: center;
padding: 5px 5px;

@media (max-width: 1000px) {
  grid-template-columns: 1fr;
  grid-row-gap: 10px;
}
`;