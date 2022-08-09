import { useState } from "react";
import { ethers } from "ethers";

import Ballot from "./artifacts/contracts/Ballot.sol/Ballot.json";
import {
  VStack,
  HStack,
  chakra,
  Heading,
  Input,
  Text,
  Button,
} from "@chakra-ui/react";

//the address that our contract is deployed after npx hardhat run
const ballotAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

function App() {
  const [ballotValue, setBallotValue] = useState("");
  const [ballotOfficialName, setBallotOfficialName] = useState("");

  async function startBallot() {
    //adding ballot voters
    if (typeof window.ethereum !== "undefined") {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(ballotAddress, Ballot.abi, provider);
      try {
        const data = await contract.addVoter(
          0xdf57089febbacf7ba0bc227dafbffa9fc08a93fdc68e1e42411a14efcf23656e,
          "Vangel Test"
        );
        setBallotValue(data);
        console.log("data", data);
      } catch (err) {
        throw new Error(err);
      }
    }
  }

  async function setBallot(value) {
    if (!value) return;
    if (!typeof window.ethereum !== "undefined") {
      await requestAccount();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(ballotAddress, Ballot.abi, signer);
      const transaction = await contract.setBallot(value);
      await transaction.wait();
      startBallot();
    }
  }

  async function requestAccount() {
    await window.ethereum.request({ method: "eth_requestAccounts" });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    await setBallot(event.target.ballotInput.value);
    setBallotValue(event.target.ballotInput.value);
    event.target.ballotInput.value = "";
  }

  console.log("testing", ballotValue);
  return (
    <>
      <VStack h="full" w="full">
        <Text>Deploy ballot to blockchain with the official name: </Text>
        <Input
          w="fit-content"
          onChange={(e) => setBallotOfficialName(e.target.value)}
        />
      </VStack>
      <VStack h="full" w="full">
        <Heading>{ballotOfficialName}</Heading>
        <VStack h="full" w="full" bg="gray" justify="center">
          <Text>Fetch Ballot Message From Smart Contract</Text>
          <Button onClick={startBallot}>Fetch ballot</Button>
          <HStack>
            <chakra.form onSubmit={(event) => handleSubmit(event)}>
              <Input name="ballotInput" />
              <Button>Set ballot</Button>
            </chakra.form>
            <VStack>
              <Text>Ballot message: {ballotValue}</Text>
            </VStack>
          </HStack>
        </VStack>
      </VStack>
    </>
  );
}

export default App;
