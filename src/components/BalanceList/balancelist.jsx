import React, { useState, useEffect } from "react";
// Functions
import { getMyBalances } from "../../functions/functions";
// Styling
import { Wrapper } from "./balanceList.styles";
import Balance from "../Balance/balance";

const BalanceList = () => {
  const [balanceData, setBalanceData] = useState([]);

  const componentDidMount = async () => {
    let balances = await getMyBalances();
    setBalanceData(balances);
  };

  useEffect(() => {
    if(balanceData.length === 0) {
      componentDidMount();
    }
  });

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
                  usdPrice={parseFloat(usdPrice)}
                />
              )
            )}
          </tbody>
        </table>
    </Wrapper>
  );
};

export default BalanceList;
