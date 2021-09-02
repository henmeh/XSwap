Moralis.Cloud.define("getEthTransactions", async (request) => {
	const address = request.params.address;
    const contracts = request.params.tokens;
  	const query = new Parse.Query("EthTransactions");
	query.equalTo("from_address", address);
    query.containedIn("to_address", contracts);
	query.descending("block_number");
	query.limit(10);
	return await query.find();
});

Moralis.Cloud.define("getPolygonTransactions", async (request) => {
	const address = request.params.address;
    const contracts = request.params.tokens;
  	const query = new Parse.Query("PolygonTransactions");
	query.equalTo("from_address", address);
  	query.containedIn("to_address", contracts);
  	query.descending("block_number");
	query.limit(10);
	return await query.find();
});

Moralis.Cloud.define("getMyBalances", async (request) => {
    //query for EthBalance
    const queryEth = new Moralis.Query("EthBalance");
    queryEth.equalTo("address", request.params.address);
    const resultEth = await queryEth.first();
    const ethbalance = resultEth.get("balance")
    const eth = {
    	name: "Ether",
      	symbol: "Eth",
        balance: ethbalance,
      	decimals: "18",
      	tokenAddress: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee"
    };
  
  	//query for PolygonBalance
    const queryPolygon = new Moralis.Query("PolygonBalance");
    queryPolygon.equalTo("address", request.params.address);
    const resultPolygon = await queryPolygon.first();
    const polygonbalance = resultPolygon.get("balance")
    const polygon = {
    	name: "Matic",
      	symbol: "Matic",
        balance: polygonbalance,
      	decimals: "18",
      	tokenAddress: "0x0000000000000000000000000000000000001001"
    };
    //query for EthTokenBalances
    const queryEthToken = new Moralis.Query("EthTokenBalance");
    queryEthToken.equalTo("address", request.params.address);
    const ethTokenbalance = await queryEthToken.find();
    
    //query for PoylgonTokenBalances
    const queryPoylgonToken = new Moralis.Query("PolygonTokenBalance");
    queryPoylgonToken.equalTo("address", request.params.address);
    const polygonTokenbalance = await queryPoylgonToken.find();
   
  	const results = [[eth, polygon], [...ethTokenbalance, ...polygonTokenbalance]];
    return results;
});

Moralis.Cloud.define("getEthTokenBalances", async (request) => {
    const query = new Moralis.Query("EthTokenBalance");
    query.equalTo("address", request.params.address);
    const tokenbalance = await query.find();
    const results = [];
    if (!tokenbalance) return;
    for(let i = 0; i < tokenbalance.length; ++i) {
        if (tokenbalance[i].attributes["balance"] == "0") {
            tokenbalance[i].destroy();
        }
        results.push(tokenbalance[i]);
    }
   return results;
});

Moralis.Cloud.define("getPolygonTokenBalances", async (request) => {
    const query = new Moralis.Query("PolygonTokenBalance");
    query.equalTo("address", request.params.address);
    const tokenbalance = await query.find();
    const results = [];
    if (!tokenbalance) return;
    for(let i = 0; i < tokenbalance.length; ++i) {
        if (tokenbalance[i].attributes["balance"] == "0") {
            tokenbalance[i].destroy();
        }
        results.push(tokenbalance[i]);
    }
   return results;
});

  Moralis.Cloud.define("getEthBalance", async (request) => {
    const query = new Moralis.Query("EthBalance");
    query.equalTo("address", request.params.address);
    const result = await query.first();
    const ethbalance = result.get("balance")
   return ethbalance;
  });

  Moralis.Cloud.define("getBscBalance", async (request) => {
    const query = new Moralis.Query("PolygonBalance");
    query.equalTo("address", request.params.address);
    const result = await query.first();
    const bscbalance = result.get("balance")
   return bscbalance;
  });

  Moralis.Cloud.define("getPolygonBalance", async (request) => {
    const query = new Moralis.Query("PolygonBalance");
    query.equalTo("address", request.params.address);
    const result = await query.first();
    const polygonbalance = result.get("balance")
   return polygonbalance;
  });

  Moralis.Cloud.define("getNewTransactionStatus", async (request) => {
    const query = new Moralis.Query("EthTransactions");
    query.equalTo("hash", request.params.txHash);
    const result = await query.first();
    const status = result.get("confirmed")
   return status;
  });

  Moralis.Cloud.define("getNewEthTokenTransfers", async (request) => {
    const query = new Moralis.Query("EthTokenTransfers");
    query.equalTo("transaction_hash", request.params.txHash);
    const result = await query.first();
    return result;
  });

  Moralis.Cloud.define("getEthTokenSymbol", async (request) => {
    const query = new Moralis.Query("EthTokenBalance");
    query.equalTo("token_address", request.params.tokenAddress);
    const result = await query.first();
    return result;
  });

  Moralis.Cloud.define("getNewPolygonTokenTransfers", async (request) => {
    const query = new Moralis.Query("PolygonTokenTransfers");
    query.equalTo("transaction_hash", request.params.txHash);
    const result = await query.first();
    return result;
  });

  Moralis.Cloud.define("getPolygonTokenSymbol", async (request) => {
    const query = new Moralis.Query("PolygonTokenBalance");
    query.equalTo("token_address", request.params.tokenAddress);
    const result = await query.first();
    return result;
  });

  Moralis.Cloud.define("getJobsById", async (request) => {
    const query = new Moralis.Query("Jobs");
    query.equalTo("objectId", request.params.id);
    const result = await query.first();
    return result;
  });

  Moralis.Cloud.define("getMyJobs", async (request) => {
    const query = new Moralis.Query("Jobs");
    query.equalTo("user", request.params.address);
    const result = await query.find();
    return result;
  });

Moralis.Cloud.define("getEthTransactions2", async (request) => {
	const address = request.params.address;
    const contracts = request.params.tokens;
  	const queryEthTx = new Parse.Query("EthTransactions");
    queryEthTx.equalTo("from_address", address);
    queryEthTx.containedIn("to_address", contracts);
    queryEthTx.descending("block_number");
    queryEthTx.limit(10);
	const ethTransactions = await queryEthTx.find();
  	
  	let result = [];
  
  	for(let i = 0; i < ethTransactions.length; ++i) {
        const queryTransfers = new Parse.Query("EthTokenTransfers");
      	queryTransfers.equalTo("transaction_hash", ethTransactions[i].get("hash"));
      	const tokenTransferResult = await queryTransfers.first();    
      	if(tokenTransferResult){
            const queryTokenInfo = new Parse.Query("EthTokenBalance");
        	queryTokenInfo.equalTo("token_address", tokenTransferResult.get("token_address"));
            const tokenInfo = await queryTokenInfo.first();
          	const tx = {
              hash: ethTransactions[i].get("hash"),
              method: ethTransactions[i].get("input"),
              toAddress: ethTransactions[i].get("to_address"),
              ether: ethTransactions[i].get("value"),
              tokenAmount: tokenTransferResult.get("value"),
              tokenSymbol: tokenInfo.get("symbol"),
              tokenDecimals: tokenInfo.get("decimals"),
              status: ethTransactions[i].get("confirmed"),
              activity: false
            }
            result.push(tx);
        } else {
          	const tx = {
              hash: ethTransactions[i].get("hash"),
              method: ethTransactions[i].get("input"),
              toAddress: ethTransactions[i].get("to_address"),
              ether: ethTransactions[i].get("value"),
              tokenAmount: false,
              tokenSymbol: false,
              tokenDecimals: false,
              status: ethTransactions[i].get("confirmed"),
              activity: false
            }
            result.push(tx);
        }
    }
    return result;
});

Moralis.Cloud.define("getPolygonTransactions2", async (request) => {
	const address = request.params.address;
    const contracts = request.params.tokens;
  	const queryPolygonTx = new Parse.Query("PolygonTransactions");
    queryPolygonTx.equalTo("from_address", address);
    queryPolygonTx.containedIn("to_address", contracts);
    queryPolygonTx.descending("block_number");
    queryPolygonTx.limit(10);
	const polygonTransactions = await queryPolygonTx.find();
  	
  	let result = [];
  
  	for(let i = 0; i < polygonTransactions.length; ++i) {
        const queryTransfers = new Parse.Query("PolygonTokenTransfers");
      	queryTransfers.equalTo("transaction_hash", polygonTransactions[i].get("hash"));
      	const tokenTransferResult = await queryTransfers.first();
      
      	const queryJobs = new Parse.Query("Jobs");
      	queryJobs.equalTo("txHash", polygonTransactions[i].get("hash"));
      	const jobResult = await queryJobs.first();    
      
      	let activity;
      	if(jobResult && jobResult.get("status") == "erc20Ethcompleted") {
        	activity = jobResult.get("status");
        } else {
        	activity = false;
        }
      
      	if(tokenTransferResult){
            const queryTokenInfo = new Parse.Query("PolygonTokenBalance");
        	queryTokenInfo.equalTo("token_address", tokenTransferResult.get("token_address"));
            const tokenInfo = await queryTokenInfo.first();
          	const tx = {
              hash: polygonTransactions[i].get("hash"),
              method: polygonTransactions[i].get("input"),
              toAddress: polygonTransactions[i].get("to_address"),
              ether: polygonTransactions[i].get("value"),
              tokenAmount: tokenTransferResult.get("value"),
              tokenSymbol: tokenInfo.get("symbol"),
              tokenDecimals: tokenInfo.get("decimals"),
              status: polygonTransactions[i].get("confirmed"),
              activity: activity
            }
            result.push(tx);
        } else {
          	const tx = {
              hash: polygonTransactions[i].get("hash"),
              method: polygonTransactions[i].get("input"),
              toAddress: polygonTransactions[i].get("to_address"),
              ether: polygonTransactions[i].get("value"),
              tokenAmount: false,
              tokenSymbol: false,
              tokenDecimals: false,
              status: polygonTransactions[i].get("confirmed"),
              activity: activity
            }
            result.push(tx);
        }
    }
    return result;
});