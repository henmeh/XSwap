import React, { useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Popover from '@material-ui/core/Popover';
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import TokenSelectButton from "../Buttons/popOverButton";
import axios from "axios";
import Button from "@material-ui/core/Button";
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

export default function Swap(props) {
  const classes = useStyles();

  const [ethToken, setEthToken] = React.useState([]);
  const [polygonToken, setPolygonToken] = React.useState([]);
  const [fromToken, setFromToken] = React.useState({});
  const [toToken, setToToken] = React.useState({});
  const [swapAmount, setSwapAmount] = React.useState();
  const [fromChain, setFromChain] = React.useState();
  const [toChain, setToChain] = React.useState();
  const [status, setStatus] = React.useState();

  //Chain indizes
  //Ethereum  = 1
  //Polygon = 137
    
  const componentDidMount = async () => {
    if (props.user) {
      let loadingData = await Promise.all([
        axios.get("https://api.1inch.exchange/v3.0/1/tokens"),
        axios.get("https://api.1inch.exchange/v3.0/137/tokens"),])
      
      setEthToken(Object.values(loadingData[0].data.tokens));
      setPolygonToken(Object.values(loadingData[1].data.tokens));
    } //else {
    //}
  };

  useEffect(() => {
    if (ethToken.length === 0) {
      //component did mount
      componentDidMount();
    } else {
      //component did update
    }
  });

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
    const swapAmountWei = Number(swapAmount) * Math.pow(10, Number(fromToken.decimals))
    swapTokens(fromToken.address, toToken.address, swapAmountWei, fromChain, toChain, status);
  }

  return (
    <Card className={classes.root}>
      <CardContent>
      <div>
      <TokenSelectButton title="Token on Ethereum" tokens={ethToken} chain={1} status={"new"} tokenChoice={handleFromTokenChoice}/>
      <TokenSelectButton title="Token on Polygon" tokens={polygonToken} chain={137} status={"new"} tokenChoice={handleFromTokenChoice}/>
    </div>
    <div><Input type="number" placeholder="Input Swapamount" onChange={((event) => setSwapAmount(event.target.value))}/></div>
    <div><Button variant="contained" color="primary" onClick={swap}>Swap</Button></div>
    <div>Expected return </div>
    <div>{""} </div>
    <div>
      <TokenSelectButton title="Token on Ethereum" tokens={ethToken} chain={1} status={"new"} tokenChoice={handleToTokenChoice}/>
      <TokenSelectButton title="Token on Polygon" tokens={polygonToken} chain={137} status={"new"} tokenChoice={handleToTokenChoice}/>
    </div>
      </CardContent>
    </Card>
  );
}
