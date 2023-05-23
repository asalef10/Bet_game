import { InjectedConnector } from "@web3-react/injected-connector";
import { useWeb3React } from "@web3-react/core";
import Web3 from "web3";


const injected = new InjectedConnector({
  supportedChainIds: [1337, 80001, 1, 3, 4, 5, 42, 137, 56, 43114, 421611],
});
const WalletConnector = () => {
    let web3: Web3;
    if (window.ethereum) {
      web3 = new Web3(window.ethereum as unknown as any);
    } else {
      console.log("No Ethereum provider found in window.ethereum");
    }
  const { account, activate, chainId } = useWeb3React();

  const connectWallet = async () => {
    await activate(injected);
    console.log(account);
    return account;
  };

  const addressShortcut = (addressWallet:string) => {
    let address = `${addressWallet?.slice(0, 6)}...${addressWallet?.slice(
      -4
    )} `;
    return address;
  };
  return {
    connectWallet,
    addressShortcut,
    account,
    chainId,
  };
};
export default WalletConnector;
