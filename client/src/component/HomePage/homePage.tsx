import { useEffect, useState, useRef } from "react";
import WalletConnector from "../../web3/walletConnector";
import useBet from "../../hook/useBet";
import { Interface } from "readline";
const HomePage = () => {
  const { connectWallet, addressShortcut, account, chainId } =
    WalletConnector();
  const { placeBet, approveContract, allowance } = useBet();
  const [data, setData] = useState<IPoolsObjectData>();
  const [isApproved, setIsApproved] = useState(false);

  interface IPoolsState {
    [key: string]: {
      gaugeWeight: number;
    };
  }
  interface IPoolsObjectData {
    id: number;
    poolName: string;
    weight: number;
    map: any;
  }
  useEffect(() => {
    checkIsApproved_contract();
  }, [account, chainId]);

  const [poolsValues, setPoolsValues] = useState<IPoolsState>({});

  const handleInputChange = (e: any, poolId: number, poolName: string) => {
    const value = +e.target.value;
    if (poolName == "3pool") {
      setPoolsValues((prevState) => ({
        ...prevState,
        [poolId]: {
          ...prevState[poolId],
          gaugeWeight_3Pool: value,
        },
      }));
    } else if (poolName == "steth") {
      setPoolsValues((prevState) => ({
        ...prevState,
        [poolId]: {
          ...prevState[poolId],
          gaugeWeight_steth: value,
        },
      }));
    } else if (poolName == "Paxos Dollar (USDP)") {
      setPoolsValues((prevState) => ({
        ...prevState,
        [poolId]: {
          ...prevState[poolId],
          gaugeWeight_paxosDollar: value,
        },
      }));
      console.log(poolsValues);
    }
  };

  const checkIsApproved_contract = async (): Promise<boolean | undefined> => {
    const approvalStatus = await allowance();
    if (approvalStatus !== undefined) {
      setIsApproved(approvalStatus);
      return approvalStatus;
    }
  };

  const getData = async () => {
    try {
      let response = await fetch("http://localhost:3000/");
      let data = await response.json();
      setData(data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <>
      <div>
        <header>
          <h1>Guess the Pool Weight</h1>
          <nav>
            <ul>
              {!account ? (
                <button onClick={connectWallet}>Connect Wallet</button>
              ) : (
                addressShortcut(account)
              )}
            </ul>
          </nav>
        </header>

        <main>
          <h2>Guess the Pool Weight</h2>
          <p>
            Welcome to Guess the Pool Weight, a guessing game based on smart
            contracts! Guess the weight of a pool number within a certain range,
            and if you guess correctly, you will be rewarded with
            cryptocurrency.
          </p>
          <div className="pool-list">
            <h2>Pool List</h2>
            {data?.map((pool: IPoolsObjectData) => {
              return (
                <>
                  <li>
                    <span>ID:{pool.id}</span> <span> Pool Name:</span>
                    {pool.poolName} <span>Pool Weight:</span>
                    {pool.weight}
                    <span> Weight Guess:</span>{" "}
                    <span>
                      <input
                      required
                        type="string"
                        onChange={(e) =>
                          handleInputChange(e, pool.id, pool.poolName)
                        }
                        placeholder="823..."
                      />
                    </span>
                  </li>
                </>
              );
            })}
            <ul id="pool-data"></ul>
          </div>
          <div style={{ display: "flex",justifyContent:"center" }}>
            {account&&!isApproved ? <button onClick={approveContract}>Approve</button> : ""}
            <button
              onClick={() => {
                placeBet(poolsValues);
              }}
              id="submit"
              type="submit"
            >
              Send Guess
            </button>
          </div>
          <p id="status"></p>
        </main>

        <footer>
          <p>&copy; 2023 Guess the Pool Weight. All rights reserved.</p>
        </footer>
        <script src="./contractAPI.js" type="module"></script>
      </div>
    </>
  );
};
export default HomePage;
