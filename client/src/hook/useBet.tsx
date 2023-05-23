import Web3 from "web3";
import WalletConnector from "../web3/walletConnector";
const web3 = new Web3(window.ethereum as unknown as any);
const GaugeWeight_ABI = require("../artifacts/betJSON.json");
const ERC20_ABI = require("../artifacts/erc20.json");
const CONTRACT_ADDRESS = "0x858919deeC32454De757e2C32A8FE8ada77dCff5";
const USDC_TOKEN_ADDRESS = "0x233175cecC981aedDcFbe4fB15A462B221f3C8C0";
let gaugeWeight_Instance = new web3.eth.Contract(
  GaugeWeight_ABI.abi,
  CONTRACT_ADDRESS
);

let erc20Contract = new web3.eth.Contract(ERC20_ABI, USDC_TOKEN_ADDRESS);

const useBet = () => {
  const { account,chainId } = WalletConnector();
  const placeBet = async (bet: any) => {
    try {
      if (!account) {
        return alert("You need connect account");
      }
      const resultBet = Object.values(bet).reduce(
        (acc: any, val: any) => ({ ...acc, ...val }),
        {}
      );
      gaugeWeight_Instance.methods
        .PlaceBet(resultBet)
        .send({ from: account, gas: 800000, gasPrice: 5000000000 })
        .then((receipt: any) => {
          console.log("receipt:", receipt);
        })
        .catch((error: Error) => {
          console.log("error:", error);
        });
    } catch (err) {
      alert("Error event:. Please make sure to fill in all fields");
      console.log(err);
    }
  };

  const approveContract = async () => {
    try {
      await erc20Contract.methods
        .approve(CONTRACT_ADDRESS, 100000000000000)
        .send({ from: account, gas: 800000, gasPrice: 5000000000 });
      alert(" wallet approved");
      return true;
    } catch (err) {
      console.log(err);
      return false;
    } finally {
    }
  };
  const allowance = async () => {
    if (account) {
      if (chainId == 80001) {
        const allowance = await erc20Contract.methods
          .allowance(account, CONTRACT_ADDRESS)
          .call();

        if (allowance > 0) {
          console.log(
            `The user has approved the spender to transfer ${allowance} tokens`
          );
          return true;
        } else {
          console.log(
            `The user has not approved the spender to transfer any tokens`
          );
          return false;
        }
      }
    }
  };

  return {
    placeBet,
    approveContract,
    allowance
  };
};
export default useBet;
