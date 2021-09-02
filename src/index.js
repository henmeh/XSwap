import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { MoralisProvider } from "react-moralis";

ReactDOM.render(
  <React.StrictMode>
    <MoralisProvider appId="dOiVpAxnylme9VPx99olzmbyQzB4Jk2TgL0g1Y5A" serverUrl="https://kuuj059ugtmh.usemoralis.com:2053/server">
    <App />
    </MoralisProvider>,
  </React.StrictMode>,
  document.getElementById('root')
);
