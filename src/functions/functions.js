const moralis = require("moralis");
const tokenAddresses = require("./addresses.js");
const axios = require("axios");
const abi = require("./abi");
const MaticPOSClient = require("@maticnetwork/maticjs").MaticPOSClient;
const Matic = require("@maticnetwork/maticjs").default;
const Web3 = require("web3");

moralis.initialize("dOiVpAxnylme9VPx99olzmbyQzB4Jk2TgL0g1Y5A");
moralis.serverURL = "https://kuuj059ugtmh.usemoralis.com:2053/server";

async function init() {
  window.web3 = await moralis.Web3.enable();
}

init();

module.exports = {
  Login: async function () {
    try {
      const user = await moralis.authenticate();
      return user;
    } catch (error) {
      console.log(error);
    }
  },

  Logout: async function () {
    try {
      await moralis.User.logOut();
      return false;
    } catch (error) {
      console.log(error);
    }
  },

  getMyBalances: async function () {
    try {
      const user = await moralis.User.current();
      // Query Moralisdatabase only if user is logged in
      if (user) {
        // Fetching 1inch Tokens to add the token Image later
        const oneInchToken = await Promise.all([
          axios.get("https://api.1inch.exchange/v3.0/1/tokens"),
          axios.get("https://api.1inch.exchange/v3.0/137/tokens"),
        ]);

        const oneInchTokenEth = oneInchToken[0].data.tokens;
        const oneInchTokenPolygon = oneInchToken[1].data.tokens;

        // Fetching balances from Moralis database
        const _userAddress = user.attributes.ethAddress;
        const params = { address: _userAddress };
        const balances = await moralis.Cloud.run("getMyBalances", params);

        console.log(balances);

        // Prepare for Fetching all the usdPrices in parallel await function
        let tokenPricePromises = [];
        // adding the native currencies from coingecko for eth
        tokenPricePromises.push(axios.get(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=ethereum&order=market_cap_desc&per_page=100&page=1&sparkline=false`));
        // adding the native currencies from coingecko for matic
        tokenPricePromises.push(axios.get(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=matic-network&order=market_cap_desc&per_page=100&page=1&sparkline=false`));
        // adding the promises for all other ERC20 tokens -> fetches prices from Moralis database
        for (let i = 2; i < balances.length; i++) {
          const promise = moralis.Web3API.token.getTokenPrice({address: balances[i]["tokenAddress"], chain: balances[i]["chainName"],});
          tokenPricePromises.push(promise);
        }

        // resolve the usdPrices
        const usdPrices = await Promise.all(tokenPricePromises);
        // adding the prices and tokenimages to the return object balances
        for (let i = 0; i < balances.length; i++) {
          if (balances[i]["tokenAddress"] === "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee") {
            balances[i]["usdPrice"] = usdPrices[i].data[0].current_price;
          }
          // If balance is for matic as native the usd price must be fetched from coingecko API
          else if (balances[i]["tokenAddress"] === "0x0000000000000000000000000000000000001001") {
            balances[i]["usdPrice"] = usdPrices[i].data[0].current_price;
          }
          // the usd price for all other tokens can be fetched from moralis
          else {
            balances[i]["usdPrice"] = usdPrices[i].usdPrice;
            // setting the token image
            // ask if the token is on eth or on polygon
            if (balances[i]["chainName"] === "eth") {
              balances[i]["image"] = oneInchTokenEth[balances[i]["tokenAddress"]]["logoURI"];
            }
            if (balances[i]["chainName"] === "polygon") {
              balances[i]["image"] = oneInchTokenPolygon[balances[i]["tokenAddress"]]["logoURI"];
            }
          }
        }
        return balances;
      }
    } catch (error) {
      console.log(error);
    }
  },

  swapTokens: async function (
    _fromTokenAddress,
    _toTokenAddress,
    _swapAmount,
    _fromChain,
    _toChain,
    _status
  ) {
    let jobId;
    let status = _status;

    console.log(_fromTokenAddress);
    console.log(_toTokenAddress);
    console.log(_swapAmount);
    console.log(_fromChain);
    console.log(_toChain);
    console.log(_status);

    //if status is "new" Job than we will store the new JobData on Moralis
    //if(status === "new") {
    //  jobId = await _storeJobData(_fromTokenAddress, _toTokenAddress, _swapAmount, _fromChain, _toChain);
    //}

    //Casestudie for different swap scenarios
    //ETH -> ETH or Polygon -> Polygon
    //if(_fromChain === _toChain) {
    //Check that Metamask has the right network
    //  await _networkCheck(_fromChain);
    //If networkcheck passes the actual swap can follow
    //  await _doSwap(jobId, 0);
    //}
    //if the job is a cross chain swap
    //else {
    //  console.log("not implemented yet")
    //}
  },
};

async function _storeJobData(
  _fromTokenAddress,
  _toTokenAddress,
  _swapAmount,
  _fromChain,
  _toChain
) {
  const user = await moralis.User.current();
  const _userAddress = user.attributes.ethAddress;
  const Jobs = moralis.Object.extend("Jobs");
  const job = new Jobs();

  job.set("user", _userAddress);
  job.set("fromTokenAddress", _fromTokenAddress);
  job.set("toTokenAddress", _toTokenAddress);
  job.set("amount", _swapAmount.toString());
  job.set("fromChain", _fromChain);
  job.set("toChain", _toChain);
  job.set("txHash", "");
  job.set("status", "open");

  await job.save();

  return job.id;
}

async function _networkCheck(_networkId) {
  let network = await window.web3.eth.net.getId();
  if (network !== _networkId && network === 1) {
    alert("Please Change Network in Metamask to Polygon and then press OK");
  } else if (network !== _networkId && network === 137) {
    alert("Please Change Network in Metamask to Ethereum and then press OK");
  }
}

async function _doSwap(_jobId, _step) {
  const user = await moralis.User.current();
  const _userAddress = user.attributes.ethAddress;

  //find job by id
  const params = { id: _jobId };
  let job = await moralis.Cloud.run("getJobsById", params);

  let _toTokenAddress;
  //decide if there is a swap to eth before bridging
  if (_step === 0) {
    _toTokenAddress = job.attributes.toTokenAddress;
  }
  if (_step === 1) {
    _toTokenAddress = "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee";
  }
  if (_step === 2) {
    _toTokenAddress =
      "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619".toLowerCase();
  }

  //Approve 1inch to spend token
  if (
    job.attributes.fromTokenAddress !==
    "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee"
  ) {
    window.ERC20TokencontractInstance = new window.web3.eth.Contract(
      abi.erc20ABI,
      job.attributes.fromTokenAddress
    );
    await window.ERC20TokencontractInstance.methods
      .approve(
        "0x11111112542d85b3ef69ae05771c2dccff4faa26",
        job.attributes.amount
      )
      .send({ from: _userAddress });
  }
  //get TX Data for swap to sign and to do the swap
  let response;
  if (_step === 0) {
    //await _checkSwapAmount(_jobId, job.attributes.toChain, job.attributes.fromTokenAddress, _toTokenAddress, job.attributes.amount, _userAddress);
    response = await fetch(
      `https://api.1inch.exchange/v3.0/${job.attributes.toChain}/swap?fromTokenAddress=${job.attributes.fromTokenAddress}&toTokenAddress=${_toTokenAddress}&amount=${job.attributes.amount}&fromAddress=${_userAddress}&slippage=1`
    );
  }
  if (_step === 1 || _step === 2) {
    //await _checkSwapAmount(_jobId, job.attributes.fromChain, job.attributes.fromTokenAddress, _toTokenAddress, job.attributes.amount, _userAddress);
    response = await fetch(
      `https://api.1inch.exchange/v3.0/${job.attributes.fromChain}/swap?fromTokenAddress=${job.attributes.fromTokenAddress}&toTokenAddress=${_toTokenAddress}&amount=${job.attributes.amount}&fromAddress=${_userAddress}&slippage=1`
    );
  }

  const swap = await response.json();
  const send = await window.web3.eth.sendTransaction(swap.tx);

  job.set("txHash", send.transactionHash);
  job.set("status", "swapped");
  job.set("amount", swap["toTokenAmount"]);
  await job.save();
  return ["swapped", swap["toTokenAmount"]];
}

async function _deleteJob(_jobId) {
  const params = { id: _jobId };
  let job = await moralis.Cloud.run("getJobsById", params);
  await job.destroy();
}
