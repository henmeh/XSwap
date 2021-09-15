import React, { useState, useEffect } from "react";
import axios from "axios";
// Styles
import { Wrapper } from "./Swap.styles";
// Components
import NormalButton from '../Buttons/NormalButton/normalbutton';
import TokenSelectButton from "../Buttons/popOverButton";
// Functions
import { swapTokens, calcExpectedReturn, storeJobData } from "../../functions/functions";

export default function Swap() {
  const [ethToken, setEthToken] = useState([]);
  const [polygonToken, setPolygonToken] = useState([]);
  const [fromToken, setFromToken] = useState({});
  const [toToken, setToToken] = useState({});
  const [swapAmount, setSwapAmount] = useState();
  const [slippage, setSlippage] = useState("1");
  const [fromChain, setFromChain] = useState();
  const [toChain, setToChain] = useState();
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

  const handleToTokenChoice = (_toToken, _chain) => {
    setToToken(_toToken);
    setToChain(_chain);
  }

  const swap = async () => {
    const swapAmountWei = Number(swapAmount) * Math.pow(10, Number(fromToken.decimals))
    // store the new Job
    const jobId = await storeJobData(fromToken.address, toToken.address, swapAmountWei.toString(), fromChain, toChain, slippage, fromToken.name, toToken.name);    
    // start the new Job
    await swapTokens(jobId);
  }

  const swapEth_Eth_to_Polygon = async () => {
    // store the new Job
    const jobId = await storeJobData("0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee", "0xa6fa4fb5f76172d178d61b04b0ecd319c5d1c0aa", "10000000000000000", 1, 137, "1", "Eth", "WETH");    
    await swapTokens(jobId);
  }

  const swapPoS_Eth_to_Polygon = async () => {
    // store the new Job
    const jobId = await storeJobData("0x655f2166b0709cd575202630952d71e2bb0d61af", "0xfe4f5145f6e09952a5ba9e956ed0c25e3fa4c7f1", "10000000000000000", 1, 137, "1", "DERC20", "DERC20");    
    await swapTokens(jobId);
  }

  const swapPlasma_Eth_to_Polygon = async () => {
    // store the new Job
    const jobId = await storeJobData("0x499d11e0b6eac7c0593d8fb292dcbbf815fb29ae", "0x2d7882bedcbfddce29ba99965dd3cdf7fcb10a1e", "500000000000000000", 1, 137, "1", "Testv4", "TST");    
    await swapTokens(jobId);
  }

  const swapPoS_Polygon_to_Eth = async () => {
    // store the new Job
    const jobId = await storeJobData("0xa6fa4fb5f76172d178d61b04b0ecd319c5d1c0aa", "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee", "10000000000000000", 137, 1, "1", "WETH", "ETH");    
    await swapTokens(jobId);
  }

  const swapPlasma_Polygon_to_Eth = async () => {
    // store the new Job
    const jobId = await storeJobData("0x0000000000000000000000000000000000001001", "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee", "1000000000000000000", 137, 1, "1", "Matic", "ETH");    
    await swapTokens(jobId);
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
        <NormalButton text={"Swap Eth from Eth to Polygon"} onClick={swapEth_Eth_to_Polygon} />
        <NormalButton text={"Swap PoS from Eth to Polygon"} onClick={swapPoS_Eth_to_Polygon} />
        <NormalButton text={"Swap Plasma from Eth to Polygon"} onClick={swapPlasma_Eth_to_Polygon} />
        <NormalButton text={"Swap PoS from Polygon to Eth"} onClick={swapPoS_Polygon_to_Eth} />
        <NormalButton text={"Swap Plasma from Polygon to Eth"} onClick={swapPlasma_Polygon_to_Eth} />
    </Wrapper>
  );
}

/*
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

*/