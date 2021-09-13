import styled from "styled-components";

export const Wrapper = styled.div`
display: grid;
grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
grid-column-gap: 15px;
grid-row-gap: 15px;
padding: 5px 5px;
align-items: center;
width: 100%;

@media (max-width: 1540px) {
  margin: 40px 0 0 0;
  .item3{
    grid-column: 1 / 3;
  }
}

@media (max-width: 1010px) {
  grid-column-gap: 0px;
  .item2{
    grid-column: 1 / 3;
  }
  .item3{
    grid-column: 1 / 4;
  }
}
`;
