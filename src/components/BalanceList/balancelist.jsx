import React from "react";
// Styling
import { Wrapper } from "./balanceList.styles";
import Balance from "../Balance/balance";

const BalanceList = ({ balanceData }) => {
  return (
    <Wrapper>
      <table>
          <thead>
            <tr>
              <th>Symbol</th>
              <th>Name</th>
              <th>Ticker</th>
              <th>Balance</th>
              <th>Chain</th>
              <th>Value USD</th>
            </tr>
          </thead>
          <tbody>
            {balanceData.map(
              ({
                balance,
                chain,
                decimals,
                image,
                name,
                symbol,
                tokenAddress,
                usdPrice,
              }) => (
                <Balance
                  key={tokenAddress}
                  balance={parseFloat(balance)}
                  chain={chain}
                  decimals={parseFloat(decimals)}
                  image={image}
                  name={name}
                  symbol={symbol}
                  usdPrice={usdPrice}
                />
              )
            )}
          </tbody>
        </table>
    </Wrapper>
  );
};

export default BalanceList;
