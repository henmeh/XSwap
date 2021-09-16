const moralis = require("moralis");
const { mappedPoSTokensEth, mappedPoSTokensPolygon } = require("./addresses.js");
const axios = require("axios");
const { erc20ABI } = require("../helpers/contractABI");
const MaticPOSClient = require("@maticnetwork/maticjs").MaticPOSClient;
const Matic = require("@maticnetwork/maticjs");
const Web3 = require("web3");

//Mainnet
//moralis.initialize("dOiVpAxnylme9VPx99olzmbyQzB4Jk2TgL0g1Y5A");
//moralis.serverURL = "https://kuuj059ugtmh.usemoralis.com:2053/server";

async function init() {
  window.web3 = await moralis.Web3.enable();
  //Testnet
  moralis.initialize("WkrP3HyS5n1oBT76fHjMKoHEg5dDjBxXeFJUiOOj");
  moralis.serverURL = "https://0kvvzllxphoo.bigmoralis.com:2053/server";
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

      /*  // Prepare for Fetching all the usdPrices in parallel await function
        let tokenPricePromises = [];
        // adding the native currencies from coingecko for eth
        tokenPricePromises.push(
          axios.get(
            `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=ethereum&order=market_cap_desc&per_page=100&page=1&sparkline=false`
          )
        );
        // adding the native currencies from coingecko for matic
        tokenPricePromises.push(
          axios.get(
            `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=matic-network&order=market_cap_desc&per_page=100&page=1&sparkline=false`
          )
        );
        // adding the promises for all other ERC20 tokens -> fetches prices from Moralis database
        for (let i = 2; i < balances.length; i++) {
          const promise = moralis.Web3API.token.getTokenPrice({
            address: balances[i]["tokenAddress"],
            chain: balances[i]["chainName"],
          });
          tokenPricePromises.push(promise);
        }

        // resolve the usdPrices
        const usdPrices = await Promise.all(tokenPricePromises);
        // adding the prices and tokenimages to the return object balances
        for (let i = 0; i < balances.length; i++) {
          if (
            balances[i]["tokenAddress"] ===
            "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee"
          ) {
            balances[i]["usdPrice"] = usdPrices[i].data[0].current_price;
          }
          // If balance is for matic as native the usd price must be fetched from coingecko API
          else if (
            balances[i]["tokenAddress"] ===
            "0x0000000000000000000000000000000000001001"
          ) {
            balances[i]["usdPrice"] = usdPrices[i].data[0].current_price;
          }
          // the usd price for all other tokens can be fetched from moralis
          else {
            balances[i]["usdPrice"] = usdPrices[i].usdPrice ? usdPrices[i].usdPrice : "NAN";
            // setting the token image
            // ask if the token is on eth or on polygon
            if (balances[i]["chainName"] === "eth") {
              balances[i]["image"] = oneInchTokenEth[balances[i]["tokenAddress"]] ? oneInchTokenEth[balances[i]["tokenAddress"]]["logoURI"] : false;
            }
            if (balances[i]["chainName"] === "polygon") {
              balances[i]["image"] = oneInchTokenPolygon[balances[i]["tokenAddress"]] ? oneInchTokenPolygon[balances[i]["tokenAddress"]]["logoURI"] : false;
            }
          }
        } */
        return balances;
      }
    } catch (error) {
      console.log(error);
    }
  },

  getMyEthTransactions: async function () {
    try {
      const user = await moralis.User.current();
      mappedPoSTokensEth.push(
        "0xA0c68C638235ee32657e8f720a23ceC1bFc77C77".toLowerCase(),
        "0x401F6c983eA34274ec46f84D70b31C151321188b".toLowerCase(),
        "0x11111112542d85b3ef69ae05771c2dccff4faa26".toLowerCase()
      );
      const paramsTx = {
        address: user.attributes.ethAddress,
        tokens: mappedPoSTokensEth,
      };
      const responseTransactions = await moralis.Cloud.run(
        "getEthTransactions",
        paramsTx
      );
      let methode;
      for (var i = 0; i < responseTransactions.length; i++) {
        if (
          responseTransactions[i]["method"].substring(0, 10) ===
          window.web3.eth.abi.encodeFunctionSignature(
            "depositEtherFor(address)"
          )
        ) {
          methode = "Deposit Ether For";
        } else if (
          responseTransactions[i]["method"].substring(0, 10) ===
          window.web3.eth.abi.encodeFunctionSignature("exit(bytes)")
        ) {
          methode = "Exit";
        } else if (
          responseTransactions[i]["method"].substring(0, 10) === "0x8b9e4f93"
        ) {
          methode = "Deposit ERC20 For User";
        } else if (
          responseTransactions[i]["method"].substring(0, 10) === "0x2e95b6c8"
        ) {
          methode = "Swap";
        } else if (
          responseTransactions[i]["method"].substring(0, 10) === "0x095ea7b3"
        ) {
          methode = "Approve";
        } else {
          methode = responseTransactions[i]["method"].substring(0, 10);
        }
        responseTransactions[i]["method"] = methode;
      }
      return responseTransactions;
    } catch (error) {
      console.log(error);
    }
  },

  getMyPolygonTransactions: async function () {
    try {
      const user = await moralis.User.current();
      mappedPoSTokensPolygon.push(
        "0x11111112542d85b3ef69ae05771c2dccff4faa26"
      );
      const paramsTx = {
        address: user.attributes.ethAddress,
        tokens: mappedPoSTokensPolygon,
      };
      const responseTransactions = await moralis.Cloud.run(
        "getPolygonTransactions",
        paramsTx
      );
      let methode;
      for (var i = 0; i < responseTransactions.length; i++) {
        if (
          responseTransactions[i]["method"].substring(0, 10) ===
          window.web3.eth.abi.encodeFunctionSignature("withdraw(uint256)")
        ) {
          methode = "Withdraw";
        } else if (
          responseTransactions[i]["method"].substring(0, 10) === "0x095ea7b3"
        ) {
          methode = "Approve";
        } else if (
          responseTransactions[i]["method"].substring(0, 10) === "0x7c025200"
        ) {
          methode = "Swap";
        } else {
          methode = responseTransactions[i]["method"].substring(0, 10);
        }
        responseTransactions[i]["method"] = methode;
      }
      return responseTransactions;
    } catch (error) {
      console.log(error);
    }
  },

  calcExpectedReturn: async function (_fromTokenAddress, _fromTokenDecimals, _toTokenAddress, _swapAmount, _fromChain, _toChain) {
    let expectedReturn;
    // select the correct swap
    // if fromChain == toChain than the expected return can be directly calculated
    if(_fromChain === _toChain) {
      const quoteRequest = await _getQuote(_fromTokenAddress, _toTokenAddress, _swapAmount, _toChain);
      expectedReturn = (parseInt(quoteRequest.toTokenAmount)) / Math.pow(10, quoteRequest.toToken.decimals);
    }
    // XSwap from Ethereumchain to Polygonchain
    else if(_fromChain === 1 && _toChain === 137) {
      // First check if the token can be directly bridged with the pos bridge
      if(mappedPoSTokensEth.includes(_fromTokenAddress)) {
        var _fromTokenIndex = mappedPoSTokensEth.indexOf(_fromTokenAddress);
        const _fromTokenAddressOnPolygon = mappedPoSTokensPolygon[_fromTokenIndex];
        // Check if the FromTokenAddress is the same as the ToTokenAddress otherwise it means that the Token will only be bridged 1 to 1 and the return will be 1
        if(_fromTokenAddressOnPolygon !== _toTokenAddress) {
          const quoteRequest = await _getQuote(_fromTokenAddressOnPolygon, _toTokenAddress, _swapAmount, _toChain);
          expectedReturn = (parseInt(quoteRequest.toTokenAmount)) / Math.pow(10, quoteRequest.toToken.decimals);
        }
        else {
          expectedReturn = _swapAmount / Math.pow(10, _fromTokenDecimals);
        }
      }
      // else if the fromToken is MATIC it must be bridged directly with the Plasmabridge
      else if(_fromTokenAddress === "0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0") {
        const _fromTokenAddressOnPolygon = "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee";
        const quoteRequest = await _getQuote(_fromTokenAddressOnPolygon, _toTokenAddress, _swapAmount, _toChain);
        expectedReturn = (parseInt(quoteRequest.toTokenAmount)) / Math.pow(10, quoteRequest.toToken.decimals);
      }
      // else if the fromToken cannot directly be bridged it will first be swapped to ETH on Ethereumchain than bridged with PoS Bridge and than again be swapped to the final Token on Polygon
      else {
        const quoteRequestSwapOnETH = await _getQuote(_fromTokenAddress, "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee", _swapAmount, _fromChain);
        const ethAmountToBridge = quoteRequestSwapOnETH.toTokenAmount;
        const quoteRequestSwapOnPolygon = await _getQuote("0x7ceb23fd6bc0add59e62ac25578270cff1b9f619", _toTokenAddress, ethAmountToBridge, _toChain);
        expectedReturn = (parseInt(quoteRequestSwapOnPolygon.toTokenAmount)) / Math.pow(10, quoteRequestSwapOnPolygon.toToken.decimals);
      }
    }
    // XSwap from Polygonchain to Ethereumchain
    else if(_fromChain === 137 && _toChain ===1) {
      // First check again if the token can be directly bridged with the pos bridge
      if(mappedPoSTokensPolygon.includes(_fromTokenAddress)) {
        _fromTokenIndex = mappedPoSTokensPolygon.indexOf(_fromTokenAddress);
        const _fromTokenAddressOnEth = mappedPoSTokensEth[_fromTokenIndex];
        // Check if the FromTokenAddress is the same as the ToTokenAddress otherwise it means that the Token will only be bridged 1 to 1 and the return will be 1
        if(_fromTokenAddressOnEth !== _toTokenAddress) {
          const quoteRequest = await _getQuote(_fromTokenAddressOnEth, _toTokenAddress, _swapAmount, _toChain);
          expectedReturn = (parseInt(quoteRequest.toTokenAmount)) / Math.pow(10, quoteRequest.toToken.decimals);
        }
        else {
          expectedReturn = _swapAmount / Math.pow(10, _fromTokenDecimals);
        }        
      }
      // else if the fromToken is MATIC it must be bridged directly with the Plasmabridge
      else if(_fromTokenAddress === "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee") {
        const _fromTokenAddressOnEth = "0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0";
        const quoteRequest = await _getQuote(_fromTokenAddressOnEth, _toTokenAddress, _swapAmount, _toChain);
        expectedReturn = (parseInt(quoteRequest.toTokenAmount)) / Math.pow(10, quoteRequest.toToken.decimals);
      }
      // else if the fromToken cannot directly be bridged it will first be swapped to WETH on Polygonchain than bridged with PoS Bridge and than again be swapped to the final Token on Eth
      else {
        const quoteRequestSwapOnPolygon = await _getQuote(_fromTokenAddress, "0x7ceb23fd6bc0add59e62ac25578270cff1b9f619", _swapAmount, _fromChain);
        const wethAmountToBridge = quoteRequestSwapOnPolygon.toTokenAmount;
        const quoteRequestSwapOnEth = await _getQuote("0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee", _toTokenAddress, wethAmountToBridge, _toChain);
        expectedReturn = (parseInt(quoteRequestSwapOnEth.toTokenAmount)) / Math.pow(10, quoteRequestSwapOnEth.toToken.decimals);
      }
    }
    return expectedReturn;
  },

  swapTokens: async function (_jobId) {
    // first get the actual Job
    let job = await _getJobById(_jobId);
    const user = await moralis.User.current();
    const _userAddress = user.attributes.ethAddress;
    
    // set all necessary swap parameters    
    let _fromTokenAddress = job.attributes.fromTokenAddress;
    let _newFromTokenAddress = job.attributes.newFromTokenAddress;
    let _toTokenAddress = job.attributes.toTokenAddress;
    let _swapAmount = job.attributes.amount;
    let _fromChain = job.attributes.fromChain;
    let _toChain = job.attributes.toChain;
    let _slippage = job.attributes.slippage;
    let _status = job.attributes.status;
    let _txHash = job.attributes.txHash;

    console.log(_fromTokenAddress);
    
    // If fromChain == toChain than direct Networkcheck and Swap
    if (_fromChain === _toChain) {
      switch(_status) {
        case "new XSwap":
          // Check for the right network in Metamask
          await _networkCheck(_toChain);
          // Do the swap and update Jobdata on Moralis DB
          [_status, _swapAmount, _txHash] = await _doSwap(_fromTokenAddress, _toTokenAddress, _swapAmount, _toChain, _slippage, _status);
          job.set("txHash", _txHash);
          job.set("status", _status);
          job.set("amount", _swapAmount);
          await job.save();
          break;
        case `Tokens swapped on ${_toChain}`:
          // Delete the Job after swapping
          await _deleteJobById(_jobId);
          break;  
      }
    }
    // Swap from Ethereum to Polygon
    else if (_fromChain === 1 && _toChain === 137) {
      // Check if fromToken can directly be bridged with the PoSBridge
      if (_fromTokenAddress === "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee" ||  _fromTokenAddress === "0x655f2166b0709cd575202630952d71e2bb0d61af"/*mappedPoSTokensEth.includes(_fromTokenAddress)*/) {
        console.log("Hallo von PoS XSwap");
        const _fromTokenIndex = mappedPoSTokensEth.indexOf(_fromTokenAddress);
        const _fromTokenAddressOnPolygon = "0xa6fa4fb5f76172d178d61b04b0ecd319c5d1c0aa"; //mappedPoSTokensPolygon[_fromTokenIndex];
        switch(_status) {
          case "new XSwap":
            // Check for the right network in Metamask
            //await _networkCheck(_fromChain);
            // PoS Bridging the Token and update JobData on Moralis DB
            [_status, _txHash] = await _bridgingPoS(_fromTokenAddress, _fromChain, _toChain, _swapAmount, _status);
            job.set("txHash", _txHash);
            job.set("status", _status);
            await job.save();
            break;
          case "wait to confirm PoS-Bridingprocess":
            // Check for the right network in Metamask
            //await _networkCheck(_fromChain);
            // wait until the PoS Bridging is confirmed on Polygon and update JobData on Moralis DB, FromTokenAddress for the Swap on Polygon has to change from the original FromToken on Eth to the corresponding from Token on Polygon
            //_status = await _checkPoSCompleted(_userAddress, _fromTokenAddress, _swapAmount, "0xb5505a6d998549090530911180f38aC5130101c6");
            _status = await _checkPoSCompleted_1(_txHash, _status);
            job.set("status", _status);
            job.set("newFromTokenAddress", _fromTokenAddressOnPolygon);
            await job.save();
            _fromTokenAddress = _fromTokenAddressOnPolygon;
            break;
          case "PoS-Bridgingprocess completed":
            // Check or the right network in Metamask
            //await _networkCheck(_toChain);
            // if the new FromToken on Polygon is set the actual Swap on Polygon can be done and update JobData on Moralis DB
            [_status, _swapAmount, _txHash] = [`Tokens swapped on ${_toChain}`, "1", "1"]//await _doSwap(_fromTokenAddress, _toTokenAddress, _swapAmount, _toChain, _slippage, _status);
            job.set("txHash", _txHash);
            job.set("status", _status);
            job.set("amount", _swapAmount);
            await job.save();
            break;
          case `Tokens swapped on ${_toChain}`:
            // Delete the Job after swapping
            await _deleteJobById(_jobId);
            break;
        }
      }
      // Check if FromToken is MaticToken on ETH -> can directly be bridged with Plasmabridge
      else if (_fromTokenAddress === "0x499d11e0b6eac7c0593d8fb292dcbbf815fb29ae" /*"0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0"*/) {
        console.log("Hallo von Plasma XSwap");
        const _fromTokenAddressOnPolygon = "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee";
        switch(_status) {
          case "new XSwap":
            // Check for the right network in Metamask
            //await _networkCheck(_fromChain);
            // bridging Matic Token from ETH to Polygon and update JobData on Moralis DB
            [_status, _txHash] = await _bridgingMatic(_fromChain, _toChain, _swapAmount, _status);
            job.set("txHash", _txHash);
            job.set("status", _status);
            await job.save();
            break;
          case "wait to confirm Plasma-Bridgingprocess":
            // Check for the right network in Metamask
            //await _networkCheck(_fromChain);
            // wait until the Plasma Bridging is confirmed on Polygon and update JobData on Moralis DB, FromTokenAddress for the Swap on Polygon has to change from the original FromToken on Eth to the corresponding FromToken n Polygon
            _status = await _checkMaticCompleted(_txHash, _status);
            job.set("status", _status);
            job.set("newFromTokenAddress", _fromTokenAddressOnPolygon);
            await job.save();
            //_fromTokenAddress = _fromTokenAddressOnPolygon;
            break;
          case "Plasma-Bridgingprocess completed":
            // Check for the right network in Metamask
            //await _networkCheck(_toChain);
            // if the new FromToken on Polygon is set the actual Swap on Polygon can be done and update JobData on Moralis DB
            [_status, _swapAmount, _txHash] = [`Tokens swapped on ${_toChain}`, "1", "1"] //await _doSwap(_newFromTokenAddress, _toTokenAddress, _swapAmount, _toChain, _slippage, _status);
            job.set("txHash", _txHash);
            job.set("status", _status);
            job.set("amount", _swapAmount);
            await job.save();
            break;
          case`Tokens swapped on ${_toChain}`:
            // Delete the Job after swapping
            await _deleteJobById(_jobId);
            break;
        }
      }
      // else if the FromToken cannot directly be bridged it will first be swapped to Eth on ETH than bridged with PoS Bridge to Polygonchain and than again be swapped to the final Token on Eth
      else {
        switch(_status) {
          case "new XSwap":
            // Check or the right network in Metamask
            await _networkCheck(_fromChain);
            const _fromTokenAddressOnPolygon = "0x7ceb23fd6bc0add59e62ac25578270cff1b9f619";
            // Swap FromToken on ETH to Eth on ETH and update JobData on Moralis DB
            [_status, _swapAmount, _txHash] = await _doSwap(_fromTokenAddress, "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee", _swapAmount, _fromChain, _slippage, _status);
            job.set("txHash", _txHash);
            job.set("status", _status);
            job.set("amount", _swapAmount);
            await job.save();
            break;
          case `Tokens swapped on ${_fromChain}`:
            // Check or the right network in Metamask
            await _networkCheck(_fromChain);
            // PoS Bridging the Token and update JobData on Moralis DB
            [_status, _txHash] = await _bridgingPoS("0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee", _fromChain, _toChain, _swapAmount, _status);
            job.set("txHash", _txHash);
            job.set("status", _status);
            await job.save();
            break;
          case "wait to confirm PoS-Bridingprocess":
            // Check or the right network in Metamask
            await _networkCheck(_fromChain);
            // wait until the PoS Bridging is confirmed on Polygon and update JobData on Moralis DB, FromTokenAddress for the Swap on Polygon has to change from the original FromToken on Eth to the corresponding from Token on Polygon
            _status = await _checkPoSCompleted_1(_txHash, _status);
            job.set("status", _status);
            job.set("fromTokenAddress", _fromTokenAddressOnPolygon);
            await job.save();
            _fromTokenAddress = _fromTokenAddressOnPolygon;
            break;
          case "PoS-Bridgingprocess completed":
            // Check or the right network in Metamask
            await _networkCheck(_toChain);
            // if the new FromToken on Polygon is set the actual Swap on Polygon can be done and update JobData on Moralis DB
            [_status, _swapAmount, _txHash] = await _doSwap(_fromTokenAddress, _toTokenAddress, _swapAmount, _toChain, _slippage, _status);
            job.set("txHash", _txHash);
            job.set("status", _status);
            job.set("amount", _swapAmount);
            await job.save();
            break;
          case `Tokens swapped on ${_toChain}`:
            // Delete the Job after swapping
            await _deleteJobById(_jobId);
            break;
        }
      }
    }
     // Swap from Polygon to ETH
    else if (_fromChain === 137 && _toChain === 1) {
        // Check if FromToken can directly be bridged with the PoSBridge
        if (_fromTokenAddress === "0xa6fa4fb5f76172d178d61b04b0ecd319c5d1c0aa" /*mappedPoSTokensPolygon.includes(_fromTokenAddress)*/) {
          const _fromTokenIndex = mappedPoSTokensPolygon.indexOf(_fromTokenAddress);
          const _fromTokenAddressOnEth = mappedPoSTokensEth[_fromTokenIndex];
          console.log("Hallo PoS Polygon to Eth")
          switch(_status) {
            case "new XSwap":
              // Check for the right network in Metamask
              //await _networkCheck(_fromChain);
              // PoS Bridging the Token and update JobData on Moralis DB
              [_status, _txHash] = await _bridgingPoS(_fromTokenAddress, _fromChain, _toChain, _swapAmount, _status);
              job.set("txHash", _txHash);
              job.set("status", _status);
              await job.save();
              break;
            case "wait for Checkpoint":
              // Check for the right network in Metamask
              //await _networkCheck(_fromChain);
              // Check for confirmed ERC20 burning on Polygon and update JobData on Moralis DB
              _status = await _checkForInclusion(_txHash, _status);
              job.set("status", _status);
              await job.save();
              break;
            case "Bridgingprocess checkpointed":
              // Check for the right network in Metamask
              //await _networkCheck(_toChain);
              // Calling function ERC20Exit on ETH and update JobData on Moralis DB
              _status = await _erc20Exit(_fromChain, _toChain, _txHash, _status);
              job.set("status", _status);
              job.set("fromTokenAddress", _fromTokenAddressOnEth);
              await job.save();
              _fromTokenAddress = _fromTokenAddressOnEth;
              break;
            case "erc20Exit":
              // Check or the right network in Metamask
              //await _networkCheck(_toChain);
              // if the new FromToken on ETH is set the actual Swap on ETH can be done and update JobData on Moralis DB
              //[_status, _swapAmount, _txHash] = await _doSwap(_fromTokenAddress, _toTokenAddress, _swapAmount, _toChain, _slippage, _status);
              [_status, _swapAmount, _txHash] = [`Tokens swapped on ${_toChain}`, "1", "1"]
              job.set("txHash", _txHash);
              job.set("status", _status);
              job.set("amount", _swapAmount);
              await job.save();
              break;
          case `Tokens swapped on ${_toChain}`:
              // Delete the Job after swapping
              await _deleteJobById(_jobId);
          }
        }
        // if FromToken is Matic it can directly be bridged with PlasmaBridge
        else if (_fromTokenAddress === "0x0000000000000000000000000000000000001001" /*"0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee"*/) {
          const _fromTokenAddressOnEth = "0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0";
          console.log("Hallo Plasmabrdiging from Polygon to ETH");
          switch(_status) {
            case "new XSwap":
              // Check for the right network in Metamask
            	//await _networkCheck(_fromChain);
              // Start bridging Matic and update JobData on Moralis DB
              [_status, _txHash] = await _bridgingMatic(_fromChain, _toChain, _swapAmount, _status);
              console.log(_txHash);
              job.set("txHash", _txHash);
              job.set("status", _status);
              await job.save();
              //break;
            case "plasmabridging":
              // Check for the right network in Metamask
            	//await _networkCheck(_fromChain);
              // Check for Checkpointinclusion for burned Token on Mainchain
              _status = await _checkForInclusion(_txHash, _status);
              job.set("status", _status);
              await job.save();
              //break;
            case "erc20PolygonToEthCompleted":
              // Check for the right network in Metamask
            	//await _networkCheck(_toChain);
              _status = await _maticWithdraw(_txHash, _status)
              job.set("status", _status);
              await job.save();
              break;
            case "challenge period":
              // Check for the right network in Metamask
            	//await _networkCheck(_toChain);
              _status = await _erc20Exit(_fromChain, _toChain, _txHash, _status);
              job.set("status", _status);
              job.set("fromTokenAddress", _fromTokenAddressOnEth);
              await job.save();
              _fromTokenAddress = _fromTokenAddressOnEth;
              //break;
            case "erc20Exit":
              // Check or the right network in Metamask
              //await _networkCheck(_toChain);
              // if the new FromToken on ETH is set the actual Swap on ETH can be done and update JobData on Moralis DB
              [_status, _swapAmount, _txHash] = await _doSwap(_fromTokenAddress, _toTokenAddress, _swapAmount, _toChain, _slippage, _status);
              job.set("txHash", _txHash);
              job.set("status", _status);
              job.set("amount", _swapAmount);
              await job.save();
              //break;
          case `Tokens swapped on ${_toChain}`:
              // Delete the Job after swapping
              await _deleteJobById(_jobId);
          } 
        }
        // else if the FromToken cannot directly be bridged it will first be swapped to WEth on Polygon than bridged with PoS Bridge to ETH and than again be swapped to the final Token on Eth
        else {
          switch(_status) {
            case "new XSwap":
              // Check or the right network in Metamask
              await _networkCheck(_fromChain);
              const _fromTokenAddressOnEth = "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee";
              // Swap FromToken on Polygon to WEth and update JobData on Moralis DB
              [_status, _swapAmount, _txHash] = await _doSwap(_fromTokenAddress, "0x7ceb23fd6bc0add59e62ac25578270cff1b9f619", _swapAmount, _fromChain, _slippage, _status);
              job.set("txHash", _txHash);
              job.set("status", _status);
              job.set("amount", _swapAmount);
              await job.save();
              break;
            case `Tokens swapped on ${_fromChain}`:
              // Check or the right network in Metamask
              await _networkCheck(_fromChain);
              // PoS Bridging the Token and update JobData on Moralis DB
              [_status, _txHash] = await _bridgingPoS("0x7ceb23fd6bc0add59e62ac25578270cff1b9f619", _fromChain, _toChain, _swapAmount, _status);
              job.set("txHash", _txHash);
              job.set("status", _status);
              await job.save();
              break;
            case "wait to confirm PoS-Bridingprocess":
              // Check or the right network in Metamask
              await _networkCheck(_fromChain);
              // wait until the PoS Bridging is confirmed on Polygon and update JobData on Moralis DB, FromTokenAddress for the Swap on Polygon has to change from the original FromToken on Eth to the corresponding from Token on Polygon
              _status = await _checkForInclusion(_txHash, _status);
              job.set("status", _status);
              await job.save();
              break;
              case "erc20PolygonToEthCompleted":
                // Check for the right network in Metamask
                await _networkCheck(_toChain);
                // Calling function ERC20Exit on ETH and update JobData on Moralis DB
                _status = await _erc20Exit(_fromChain, _toChain, _txHash, _status);
                job.set("status", _status);
                job.set("fromTokenAddress", _fromTokenAddressOnEth);
                await job.save();
                _fromTokenAddress = _fromTokenAddressOnEth;
                break;
              case "erc20Exit":
                  // Check or the right network in Metamask
                  await _networkCheck(_toChain);
                  // if the new FromToken on ETH is set the actual Swap on ETH can be done and update JobData on Moralis DB
                  [_status, _swapAmount, _txHash] = await _doSwap(_fromTokenAddress, _toTokenAddress, _swapAmount, _toChain, _slippage, _status);
                  job.set("txHash", _txHash);
                  job.set("status", _status);
                  job.set("amount", _swapAmount);
                  await job.save();
                  break;
              case `Tokens swapped on ${_toChain}`:
                  // Delete the Job after swapping
                  await _deleteJobById(_jobId);
          }
        }
    }
  },

  storeJobData: async function (_fromTokenAddress, _toTokenAddress, _swapAmount, _fromChain, _toChain, _slippage, _fromTokenSymbol, _toTokenSymbol) {
    const user = await moralis.User.current();
    const _userAddress = user.attributes.ethAddress;
    const Jobs = moralis.Object.extend("Jobs");
    const job = new Jobs();

    job.set("user", _userAddress);
    job.set("fromTokenAddress", _fromTokenAddress);
    job.set("toTokenAddress", _toTokenAddress);
    job.set("amount", _swapAmount);
    job.set("fromChain", _fromChain);
    job.set("toChain", _toChain);
    job.set("txHash", "");
    job.set("status", "new XSwap");
    job.set("slippage", _slippage);
    job.set("fromTokenSymbol", _fromTokenSymbol);
    job.set("toTokenSymbol", _toTokenSymbol);

    await job.save();

    return job.id; 
  },

  getMyJobs: async function () {
    const user = await moralis.User.current();
    const params = { address: user.attributes.ethAddress };
    const myJobs = await moralis.Cloud.run("getMyJobs", params);
    return myJobs;
  },

  deleteJobById: async function (_jobId) {
    const params = { id: _jobId };
    let job = await moralis.Cloud.run("getJobsById", params);
    //job.set("status", "finished");
    //await job.save();
    await job.destroy();
  },

  getJobById: async function (_jobId) {
    const params = { id: _jobId };
    let job = await moralis.Cloud.run("getJobsById", params);
    return job;
  }

};

async function _doSwap(_fromTokenAddress, _toTokenAddress, _swapAmount, _chain, _slippage, _status) {
  try {
    const user = await moralis.User.current();
    const _userAddress = user.attributes.ethAddress;
  
    //if an ERC20 token should be swapped than first approve 1inch to spend token
    if (_fromTokenAddress !== "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee") {
      window.ERC20TokencontractInstance = new window.web3.eth.Contract(erc20ABI, _fromTokenAddress);
      await window.ERC20TokencontractInstance.methods.approve("0x11111112542d85b3ef69ae05771c2dccff4faa26", _swapAmount).send({ from: _userAddress });
    }
  
    let response = await fetch(`https://api.1inch.exchange/v3.0/${_chain}/swap?fromTokenAddress=${_fromTokenAddress}&toTokenAddress=${_toTokenAddress}&amount=${_swapAmount}&fromAddress=${_userAddress}&slippage=${_slippage}`);
  
    const swap = await response.json();
    const send = await window.web3.eth.sendTransaction(swap.tx);
  
    return [`Tokens swapped on ${_chain}`, swap["toTokenAmount"], send.transactionHash];
  } catch (error) {
    console.log(error);
    return [_status, ""];
  }  
}

async function _networkCheck(_networkId) {
  let network = await window.web3.eth.net.getId();
  if (network !== _networkId && network === 1) {
    alert("Please Change Network in Metamask to Polygon and then press OK");
  } else if (network !== _networkId && network === 137) {
    alert("Please Change Network in Metamask to Ethereum and then press OK");
  }
}

async function _deleteJobById(_jobId) {
  const params = { id: _jobId };
  let job = await moralis.Cloud.run("getJobsById", params);
  //job.set("status", "finished");
  //await job.save();
  await job.destroy();
}

async function _getQuote(_fromTokenAddress, _toTokenAddress, _swapAmount, _chain) {
  try {
    const response = await axios.get(`https://api.1inch.exchange/v3.0/${_chain}/quote?fromTokenAddress=${_fromTokenAddress}&toTokenAddress=${_toTokenAddress}&amount=${_swapAmount}`);
    return (response.data);
  } catch (error) { console.log(error); }
}

async function _bridgingPoS(_fromTokenAddress, _fromChain, _toChain, _swapAmount, _status) {
  try {
    const user = await moralis.User.current();
    const _userAddress = user.attributes.ethAddress;

    const maticPos = new MaticPOSClient({
      network: "testnet",//"mainnet",
      version: "mumbai",//"v1",
      parentProvider: window.web3,
      maticProvider: "https://speedy-nodes-nyc.moralis.io/cff6f789838e10c4008b1baa/polygon/mumbai", //"https://speedy-nodes-nyc.moralis.io/cff6f789838e10c4008b1baa/polygon/mainnet",
    });

    const maticPosEthBack = new MaticPOSClient({
      network: "testnet", //"mainnet",
      version: "mumbai", //"v1",
      parentProvider: "https://speedy-nodes-nyc.moralis.io/cff6f789838e10c4008b1baa/eth/goerli", //"https://speedy-nodes-nyc.moralis.io/cff6f789838e10c4008b1baa/eth/mainnet",
      maticProvider: window.web3,
    });

    let txHash;
    //bridging from ETH to Polygon
    if (_fromChain === 1 && _toChain === 137) {
      //Deposit Ether from Ether to Polygon
      if (_fromTokenAddress === "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee") {
        txHash = await maticPos.depositEtherForUser(_userAddress, _swapAmount, { from: _userAddress });
      }
      //Deposit any other PoS Token from Ether to Polygon
      else {
        //approve polygonbridge to spend the ERC20 fromToken
        await maticPos.approveERC20ForDeposit(_fromTokenAddress, _swapAmount, { from: _userAddress });
        //bridging the ERC20 fromToken
        txHash = await maticPos.depositERC20ForUser(_fromTokenAddress, _userAddress, _swapAmount, { from: _userAddress });
      }
      return ["wait to confirm PoS-Bridingprocess", txHash.transactionHash];
    }
    //bridging from Polygon to ETH
    else if (_fromChain === 137 && _toChain === 1) {
        console.log("Hallo bridging PoS from Polygon to Eth")
        //Deposit any PoS Token from Polygon to Ether
        txHash = await maticPosEthBack.burnERC20(_fromTokenAddress, _swapAmount, { from: _userAddress });

        return ["wait for Checkpoint", txHash.transactionHash];
    }

     
  } catch (error) {
    console.log(error);
    return [_status, ""];
  }
}

async function _getJobById(_jobId) {
  try {
    const params = { id: _jobId };
    let job = await moralis.Cloud.run("getJobsById", params);
    return job;
  } catch (error) {
    console.log(error);
  }
}

async function _checkPoSCompleted_1(_txHash, _status) {
  try {
    let deposit = false;
    //while (!deposit) {
    deposit = await _depositCompletedPoS(_txHash);
    console.log(deposit);
    //}
    return deposit === true ? "PoS-Bridgingprocess completed" : `${_status}`;
  } catch (error) {
    console.log(error);
    return _status;
  }
}

async function _checkPoSCompleted(userAccount, rootToken, depositAmount, childChainManagerProxy) {
  const ws = new WebSocket("wss://ws-mumbai.matic.today/");

  return new Promise((resolve, reject) => {
    ws.onopen = function () {
      ws.send(
        `{"id": 1, "method": "eth_subscribe", "params": ["newDeposits", {"Contract": ${childChainManagerProxy}}]}`
      );

      ws.onmessage = function (msg) {
        const parsedMsg = msg;//JSON.parse(msg.data).result;
        console.log(parsedMsg);
        //if (
        //  parsedMsg &&
        //  parsedMsg.params &&
        //  parsedMsg.params.result &&
        //  parsedMsg.params.result.Data
        //) {
          console.log("checking");
          const fullData = parsedMsg.params.result.Data;
          const { 0: syncType, 1: syncData } = Web3.eth.abi.decodeParameters(
            ["bytes32", "bytes"],
            fullData
          );

          // check if sync is of deposit type (keccak256("DEPOSIT"))
          const depositType =
            "0x87a7811f4bfedea3d341ad165680ae306b01aaeacc205d227629cf157dd9f821";
          if (syncType.toLowerCase() === depositType.toLowerCase()) {
            const {
              0: userAddress,
              1: rootTokenAddress,
              2: depositData,
            } = Web3.eth.abi.decodeParameters(
              ["address", "address", "bytes"],
              syncData
            );

            // depositData can be further decoded to get amount, tokenId etc. based on token type
            // For ERC20 tokens
            const { 0: amount } = Web3.eth.abi.decodeParameters(
              ["uint256"],
              depositData
            );
            if (
              userAddress.toLowerCase() === userAccount.toLowerCase() &&
              rootToken.toLowerCase() === rootTokenAddress.toLowerCase() &&
              depositAmount === amount
            ) {
              resolve(true);
            }
          //}
        }
      };

      //ws.on("error", () => {
      //  reject(false);
      //});

      //ws.on("close", () => {
      //  reject(false);
      //});
    };
  });
}

async function _depositCompletedPoS(txHash) {
  // For mainnet, use Ethereum RPC
  const provider = new window.web3.providers.HttpProvider("https://speedy-nodes-nyc.moralis.io/cff6f789838e10c4008b1baa/eth/goerli" /*"https://speedy-nodes-nyc.moralis.io/cff6f789838e10c4008b1baa/eth/mainnet"*/);
  const web3 = new Web3(provider);

  // For mainnet, use the matic mainnet RPC: <Sign up for a dedicated free RPC URL at https://rpc.maticvigil.com/ or other hosted node providers.>
  const child_provider = new window.web3.providers.HttpProvider("https://speedy-nodes-nyc.moralis.io/cff6f789838e10c4008b1baa/polygon/mumbai"/*"https://speedy-nodes-nyc.moralis.io/cff6f789838e10c4008b1baa/polygon/mainnet"*/);

  const child_web3 = new Web3(child_provider);

  const contractInstance = new child_web3.eth.Contract(
    [
      {
        constant: true,
        inputs: [],
        name: "lastStateId",
        outputs: [
          {
            internalType: "uint256",
            name: "",
            type: "uint256",
          },
        ],
        payable: false,
        stateMutability: "view",
        type: "function",
      },
    ],
    "0x0000000000000000000000000000000000001001"
  );
  let tx = await window.web3.eth.getTransactionReceipt(txHash);
  let child_counter = await contractInstance.methods.lastStateId().call();
  let root_counter = web3.utils.hexToNumberString(tx.logs[1].topics[1]);
  return child_counter >= root_counter;
}

async function _bridgingMatic(_fromChain, _toChain, _swapAmount, _status) {
  try {
    const user = await moralis.User.current();
    const _userAddress = user.attributes.ethAddress;

    const maticPlasma = new Matic({
      network: "testnet",//"mainnet",
      version: "mumbai",//"v1",
      parentProvider: window.web3,
      maticProvider: "https://speedy-nodes-nyc.moralis.io/cff6f789838e10c4008b1baa/polygon/mumbai", //"https://speedy-nodes-nyc.moralis.io/cff6f789838e10c4008b1baa/polygon/mainnet",
    });

    const maticPlasmaBack = new Matic({
      network: "testnet", //"mainnet",
      version: "mumbai", //"v1",
      parentProvider: "https://speedy-nodes-nyc.moralis.io/cff6f789838e10c4008b1baa/eth/goerli", //"https://speedy-nodes-nyc.moralis.io/cff6f789838e10c4008b1baa/eth/mainnet",
      maticProvider: window.web3,
    });

    let txHash;
    if(_fromChain === 1 && _toChain === 137) {
      //Approve Polygon to spend the ERC20 MaticToken
      await maticPlasma.approveERC20TokensForDeposit("0x499d11E0b6eAC7c0593d8Fb292DCBbF815Fb29Ae" /*"0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0"*/, _swapAmount, { from: _userAddress });
      //Deposit ERC20 MaticToken
      txHash = await maticPlasma.depositERC20ForUser("0x499d11E0b6eAC7c0593d8Fb292DCBbF815Fb29Ae" /*"0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0"*/, _userAddress, _swapAmount, { from: _userAddress });
    }

    else if (_fromChain === 137 && _toChain === 1) {
      console.log("Hallo _brdiging Matic");
      txHash = await maticPlasmaBack.startWithdraw("0x0000000000000000000000000000000000001010", _swapAmount, {from: _userAddress});
    }
    
    return ["wait to confirm Plasma-Bridgingprocess", txHash.transactionHash];
  } catch (error) {
    console.log(error);
    return [_status, ""];
  }
}

async function _checkMaticCompleted(_txHash, _status) {
  try {
    console.log("Hallo _check Matic");
    let deposit;
    //while (!deposit) {
      deposit = await _depositCompletedMatic(_txHash);
      console.log(deposit);
    //}
    return deposit === true ? "Plasma-Bridgingprocess completed" : `${_status}`;
  } catch (error) {
    console.log(error);
    return _status;
  }
}

async function _depositCompletedMatic(txHash) {
  // For mainnet, use Ethereum RPC
  const provider = new window.web3.providers.HttpProvider("https://speedy-nodes-nyc.moralis.io/cff6f789838e10c4008b1baa/eth/goerli"/*"https://speedy-nodes-nyc.moralis.io/cff6f789838e10c4008b1baa/eth/mainnet"*/);
  const web3 = new Web3(provider);

  // For mainnet, use the matic mainnet RPC: <Sign up for a dedicated free RPC URL at https://rpc.maticvigil.com/ or other hosted node providers.>
  const child_provider = new window.web3.providers.HttpProvider("https://speedy-nodes-nyc.moralis.io/cff6f789838e10c4008b1baa/polygon/mumbai"/*"https://speedy-nodes-nyc.moralis.io/cff6f789838e10c4008b1baa/polygon/mainnet"*/);

  const child_web3 = new Web3(child_provider);

  const contractInstance = new child_web3.eth.Contract(
    [
      {
        constant: true,
        inputs: [],
        name: "lastStateId",
        outputs: [
          {
            internalType: "uint256",
            name: "",
            type: "uint256",
          },
        ],
        payable: false,
        stateMutability: "view",
        type: "function",
      },
    ],
    "0x0000000000000000000000000000000000001001"
  );
  let tx = await window.web3.eth.getTransactionReceipt(txHash);
  let child_counter = await contractInstance.methods.lastStateId().call();
  let root_counter = web3.utils.hexToNumberString(tx.logs[2].topics[1]);
  return child_counter >= root_counter;
}

async function _checkForInclusion(_txHash, _status) {
  try {
    console.log("Hallo _checkForInclusion");
    await _checkInclusion(_txHash, "0x2890ba17efe978480615e330ecb65333b880928e" /*"0x86E4Dc95c7FBdBf52e33D563BbDB00823894C287"*/);
    return "Bridgingprocess checkpointed";
  } catch (error) {
    console.log(error);
    return _status;
  }
}

async function _checkInclusion(txHash, rootChainAddress) {
  // For mainnet, use the matic mainnet RPC: <Sign up for a dedicated free RPC URL at https://rpc.maticvigil.com/ or other hosted node providers.>
  const child_provider = new window.web3.providers.HttpProvider("https://speedy-nodes-nyc.moralis.io/cff6f789838e10c4008b1baa/polygon/mumbai" /*"https://speedy-nodes-nyc.moralis.io/cff6f789838e10c4008b1baa/polygon/mainnet"*/);

  const child_web3 = new Web3(child_provider);

  // For mainnet, use Ethereum RPC
  const provider = new window.web3.providers.WebsocketProvider("wss://goerli.infura.io/ws/v3/134eb24f9b9d410baa2acac76d2a7be3"/*"wss://mainnet.infura.io/ws/v3/134eb24f9b9d410baa2acac76d2a7be3"*/);
  const web3 = new Web3(provider);

  let txDetails = await child_web3.eth.getTransactionReceipt(txHash);

  let block = txDetails.blockNumber;
  return new Promise(async (resolve, reject) => {
    web3.eth.subscribe(
      "logs",
      {
        address: rootChainAddress,
      },
      async (error, result) => {
        if (error) {
          reject(error);
        }
        if (result.data) {
          let transaction = web3.eth.abi.decodeParameters(
            ["uint256", "uint256", "bytes32"],
            result.data
          );

          if (block <= transaction["1"]) {
            resolve(result);
            provider.disconnect();
          }
        }
      }
    );
  });
}

async function _erc20Exit(_fromChain, _toChain, _txHash, _status) {
  try {
    const user = await moralis.User.current();
    const _userAddress = user.attributes.ethAddress;
    const maticPos = new MaticPOSClient({
      network: "testnet",//"mainnet", 
      version: "mumbai",//"v1",
      parentProvider: window.web3,
      maticProvider: "https://speedy-nodes-nyc.moralis.io/cff6f789838e10c4008b1baa/polygon/mumbai", //"https://speedy-nodes-nyc.moralis.io/cff6f789838e10c4008b1baa/polygon/mainnet",
    });
    const maticPlasma = new Matic({
      network: "testnet",//"mainnet",
      version: "mumbai",//"v1",
      parentProvider: window.web3,
      maticProvider: "https://speedy-nodes-nyc.moralis.io/cff6f789838e10c4008b1baa/polygon/mumbai", //"https://speedy-nodes-nyc.moralis.io/cff6f789838e10c4008b1baa/polygon/mainnet",
    });
    //if(_fromChain === 1 && _toChain === 137) {
      await maticPos.exitERC20(_txHash, { from: _userAddress });
    //}
    //else if (_fromChain === 137 && _toChain === 1) {
    //  console.log("Hallo _erc20Exit");
    //  await maticPlasma.processExits("0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0", {from: _userAddress});
    //}    
    return "erc20Exit";
  } catch (error) {
    console.log(error);
    return _status;
  }
}

async function _maticWithdraw(_txHash, _status) {
  try {
    const user = await moralis.User.current();
    const _userAddress = user.attributes.ethAddress;

    console.log("Hallo _maticWithdraw");

    const matic = new Matic({
      network: "testnet", //"mainnet",
      version: "mumbai", //"v1",
      parentProvider: window.web3,
      maticProvider: "https://speedy-nodes-nyc.moralis.io/cff6f789838e10c4008b1baa/polygon/mumbai", //"https://speedy-nodes-nyc.moralis.io/cff6f789838e10c4008b1baa/polygon/mainnet",
    });

    const maticPos = new MaticPOSClient({
      network: "testnet",//"mainnet",
      version: "mumbai",//"v1",
      parentProvider: window.web3,
      maticProvider: "https://speedy-nodes-nyc.moralis.io/cff6f789838e10c4008b1baa/polygon/mumbai", //"https://speedy-nodes-nyc.moralis.io/cff6f789838e10c4008b1baa/polygon/mainnet",
    });

    await matic.withdraw(_txHash, {from: _userAddress});
    return "challenge period"
  } catch (error) {
    console.log(error);
    return _status;
  }  
}