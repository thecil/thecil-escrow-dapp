# Sample Hardhat Project

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, and a Hardhat Ignition module that deploys that contract.

Try running some of the following tasks:

```shell
npx hardhat test
npx hardhat ignition deploy ignition/modules/Escrow.ts --network sepolia --deployment-id sepolia-deployment
npx hardhat ignition verify sepolia-deployment
```

Escrow Contract: `0x665dd99C20A84acD35D6108f911e64cc36bc5102`

Successfully verified contract "contracts/EscrowYieldTestnet.sol:EscrowYieldTestnet" for network sepolia:
  - https://sepolia.etherscan.io/address/0x665dd99C20A84acD35D6108f911e64cc36bc5102#code