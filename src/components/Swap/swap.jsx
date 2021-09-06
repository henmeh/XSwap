import React, { useState, useEffect } from "react";
// Styles
import { Wrapper } from "./Swap.styles";
import { makeStyles } from "@material-ui/core/styles";
import TokenSelectButton from "../Buttons/popOverButton";
import axios from "axios";
import NormalButton from '../Buttons/NormalButton/normalbutton';
import TextField from '@material-ui/core/TextField';
import Input from '@material-ui/core/Input';
import { swapTokens } from "../../functions/functions";



const useStyles = makeStyles((theme) => ({
  paper: {
    border: "1px solid",
    padding: theme.spacing(1),
    backgroundColor: theme.palette.background.paper,
  },
  root: {
    minWidth: 275,
  },
  bullet: {
    display: "inline-block",
    margin: "0 2px",
    transform: "scale(0.8)",
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
}));

export default function Swap() {
  const classes = useStyles();

  const [ethToken, setEthToken] = useState([]);
  const [polygonToken, setPolygonToken] = useState([]);
  const [fromToken, setFromToken] = useState({});
  const [toToken, setToToken] = useState({});
  const [swapAmount, setSwapAmount] = useState();
  const [slippage, setSlippage] = useState("0.01");
  const [fromChain, setFromChain] = useState();
  const [toChain, setToChain] = useState();
  const [status, setStatus] = useState();

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

  const swap = () => {
    console.log(fromToken);
    console.log(toToken);
    console.log(fromChain);
    console.log(toChain);
    console.log(swapAmount);
    console.log(slippage);
    console.log(status);
    //const swapAmountWei = Number(swapAmount) * Math.pow(10, Number(fromToken.decimals))
    //swapTokens(fromToken.address, toToken.address, swapAmountWei, fromChain, toChain, status);
  }

  const check = (value) => {
    console.log(value);
  }

  return (
    <Wrapper>
      <div id="from-token-select">
        <TokenSelectButton title="Token on Ethereum" tokens={ethToken} chain={1} status={"new"} tokenChoice={handleFromTokenChoice}/>
        <TokenSelectButton title="Token on Polygon" tokens={polygonToken} chain={137} status={"new"} tokenChoice={handleFromTokenChoice}/>
      </div>
      <div id="select-slippage" onChange={(event) => {setSlippage(event.target.value)}}>
      Max Slippage: 
      <input type="radio" id="0.1%" value="0.001" name="slippage"/>
      <label >0.1%</label>
      <input type="radio" id="0.5%" value="0.005" name="slippage"/>
      <label >0.5%</label>
      <input type="radio" id="1.00%" value="0.01" name="slippage" defaultChecked/>
      <label >1.0%</label>
      <input type="radio" id="3.00%" value="0.03" name="slippage"/>
      <label >3.0%</label>      
      </div>
      <div id="swapamount-input">
      <input type="number" placeholder="Input Swapamount" onChange={((event) => setSwapAmount(event.target.value))}/>
      </div>
      <div id="swapbutton">
        <NormalButton text={"Swap"} onClick={swap} />
      </div>
      <div id="expected-return">
        Expected return 
      </div>
      <div id="expected-return-value"> {""} </div>
      <div id="to-token-select">
        <TokenSelectButton title="Token on Ethereum" tokens={ethToken} chain={1} status={"new"} tokenChoice={handleToTokenChoice}/>
        <TokenSelectButton title="Token on Polygon" tokens={polygonToken} chain={137} status={"new"} tokenChoice={handleToTokenChoice}/>
      </div>    
    </Wrapper>
  );
}