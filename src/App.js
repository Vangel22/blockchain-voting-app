import { useState } from "react";
import { ethers } from "ethers";

import Lock from "./artifacts/contracts/Lock.sol/Lock.json";
import { VStack, chakra, Input, Text } from "@chakra-ui/react";

//the address that our contract is deployed after npx hardhat run
const lockAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

function App() {
  const [lockValue, setLockValue] = useState("");

  async function fetchLock() {
    if (typeof window.ethereum !== "undefined") {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(lockAddress, Lock.abi, provider);
      try {
        const data = await contract.lock();
        setLockValue(data);
        console.log("data", data);
      } catch (err) {
        throw new Error(err);
      }
    }
  }

  async function setLock(value) {
    if (!value) return;
    if (!typeof window.ethereum !== "undefined") {
      await requestAccount();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(lockAddress, Lock.abi, signer);
      const transaction = await contract.setLock(value);
      await transaction.wait();
      fetchLock();
    }
  }

  async function requestAccount() {
    await window.ethereum.request({ method: "eth_requestAccounts" });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    await setLock(event.target.lockInput.value);
    setLockValue(event.target.lockInput.value);
    event.target.lockInput.value = "";
  }

  return (
    <VStack>
      <chakra.form onSubmit={(event) => handleSubmit(event)}>
        <Input name="lockInput" />
      </chakra.form>
      <Text>Lock message: {lockValue}</Text>
    </VStack>
  );
}

export default App;
