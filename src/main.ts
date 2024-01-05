const axios = require("axios").default;
import { Provider, types, utils, Wallet } from "zksync-web3";
import ethers from "ethers";

// var dataWallet = [{ address: "address", privateKey: "privateKey" }];
const provider = new Provider("https://mainnet.era.zksync.io");
let wallet = Wallet.createRandom();
console.log("Address: ", wallet.address);
console.log("Private Key: ", wallet.privateKey);
wallet = new Wallet(wallet.privateKey, provider);
// const wallet = new Wallet(dataWallet[0].privateKey, provider);

const toAddress = "0x3355df6D4c9C3035724Fd0e3914dE96A5a83aaf4";

async function main(_toAddress: string, txData: any) {
  const tx = await wallet.sendTransaction({
    ...txData,
  });
  await tx.wait();
}

async function getParamPaymaster() {
  const bodyParameters = {
    feeTokenAddress: "0x3355df6d4c9c3035724fd0e3914de96a5a83aaf4",
    txData: {
      from: wallet.address,
      to: "0x3355df6D4c9C3035724Fd0e3914dE96A5a83aaf4",
      data: "0x095ea7b30000000000000000000000002da10a1e27bf85cedd8ffb1abbe97e53391c02950000000000000000000000000000000000000000000000000000000000000000",
    },
  };
  await axios
    .post("https://paymaster.zyfi.org/api/v1/generaltx", bodyParameters)
    .then(async function (response: { data: { txData: any; }; }) {
      let txData = await response.data.txData;
      console.log("txData: ", txData);
      main(toAddress, txData);
    })
    .catch(console.log);
}
getParamPaymaster();
