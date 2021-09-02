import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  :root {
    --maxWidth: 1280px; 
    --highLightColor: #fff;
    --primaryColor: #000033;
    --backgroundColor: #00004d; 
    --accentColor: #cc00cc;
    --buttonColor: #0000ff;
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
    background-color: var(--backgroundColor);

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
