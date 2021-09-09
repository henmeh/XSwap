import React, { useState, useEffect } from "react";
import axios from "axios";
// Styles
import { Wrapper } from "./Swap.styles";
// Components
import NormalButton from '../Buttons/NormalButton/normalbutton';
import TokenSelectButton from "../Buttons/popOverButton";
// Functions
import { swapTokens, calcExpectedReturn } from "../../functions/functions";

export default function Swap() {
  const [ethToken, setEthToken] = useState([]);
  const [polygonToken, setPolygonToken] = useState([]);
  const [fromToken, setFromToken] = useState({});
  const [toToken, setToToken] = useState({});
  const [swapAmount, setSwapAmount] = useState();
  const [slippage, setSlippage] = useState("1");
  const [fromChain, setFromChain] = useState();
  const [toChain, setToChain] = useState();
  const [status, setStatus] = useState();
  const [expectedReturn, setExpectedReturn] = useState();

  //Chain indizes
  //Ethereum  = 1
  //Polygon = 137
    
  const componentDidMount = async () => {
      let loadingData = await Promise.all([
        axios.get("https://api.1inch.exchange/v3.0/1/tokens"),
        axios.get("https://api.1inch.exchange/v3.0/137/tokens"),])
      
      setEthToken(Object.values(loadingData[0].data.tokens));
      setPolygonToken(Object.values(loadingData[1].data.tokens));
  };

  useEffect(() => {
    componentDidMount();
  }, []);

  const handleFromTokenChoice = (_token, _chain) => {
    setFromToken(_token);
    setFromChain(_chain);
  }

  const handleToTokenChoice = (_toToken, _chain, _status) => {
    setToToken(_toToken);
    setToChain(_chain);
    setStatus(_status);
  }

  const swap = async () => {
    const swapAmountWei = Number(swapAmount) * Math.pow(10, Number(fromToken.decimals))
    await swapTokens(fromToken.address, toToken.address, swapAmountWei.toString(), fromChain, toChain, slippage, status);
  }

  const changeSwapAmount = async (_swapAmount) => {
    if(_swapAmount && parseFloat(_swapAmount) !== 0) {
      setSwapAmount(_swapAmount);
      const swapAmountWei = Number(_swapAmount) * Math.pow(10, Number(fromToken.decimals))
      const expReturn = await calcExpectedReturn(fromToken.address, fromToken.decimals, toToken.address, swapAmountWei.toString(), fromChain, toChain);
      setExpectedReturn(expReturn);
    } 
    else {
      setSwapAmount();
      setExpectedReturn();
    }
  }

  return (
    <Wrapper>
      <div id="from-token-select">
        <TokenSelectButton title="Token on Ethereum" tokens={ethToken} chain={1} status={"new"} tokenChoice={handleFromTokenChoice}/>
        <TokenSelectButton title="Token on Polygon" tokens={polygonToken} chain={137} status={"new"} tokenChoice={handleFromTokenChoice}/>
      </div>
      <div id="select-slippage" onChange={(event) => {setSlippage(event.target.value)}}>
      Max Slippage: 
      <input type="radio" id="0.1%" value="0.1" name="slippage"/>
      <label >0.1%</label>
      <input type="radio" id="0.5%" value="0.5" name="slippage"/>
      <label >0.5%</label>
      <input type="radio" id="1.00%" value="1" name="slippage" defaultChecked/>
      <label >1.0%</label>
      <input type="radio" id="3.00%" value="3" name="slippage"/>
      <label >3.0%</label>      
      </div>
      <div id="swapamount-input">
      <input type="number" placeholder="Input Swapamount" onChange={((event) => changeSwapAmount(event.target.value))}/>
      </div>
      <div id="swapbutton">
        <NormalButton text={"Swap"} onClick={swap} />
      </div>
      <div id="expected-return">
        Expected return 
      </div>
      <div id="expected-return-value"> {expectedReturn ? expectedReturn : "-"} </div>
      <div id="to-token-select">
        <TokenSelectButton title="Token on Ethereum" tokens={ethToken} chain={1} status={"new"} tokenChoice={handleToTokenChoice}/>
        <TokenSelectButton title="Token on Polygon" tokens={polygonToken} chain={137} status={"new"} tokenChoice={handleToTokenChoice}/>
      </div>    
    </Wrapper>
  );
}