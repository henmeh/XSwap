import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  :root {
    --maxWidth: 1280px; 
    --highLightColor: #FFFFFF;
    --primaryColor: #212332;
    --backgroundColor: #2A2D3E; 
    --accentColor: #E040FB;
    --buttonColor: #3f51b5;
    --fontSuperBig: 2.5rem;
    --fontBig: 1.5rem;
    --fontMed: 1.2rem;
    --fontSmall: 1rem;
  }

  * {
    box-sizing: border-box;
    font-family: 'Abel', sans-serif;  
  }

  body {  
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    background-color: var(--backgroundColor, white);

    h1 {
      font-size: 3rem;
      font-weight: 600;
      color: var(--highLightColor);
    }

    h3 {
      font-size: 1.1rem;
      font-weight: 600;
    }

    p {
      font-size: 1rem;
      color: var(--highLightColor);
    }
  }
`;
