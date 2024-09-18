# Sample Hardhat Project

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, and a Hardhat Ignition module that deploys that contract.

Try running some of the following tasks:

```shell
npx hardhat test
npx hardhat ignition deploy ignition/modules/Escrow.ts --network sepolia --deployment-id sepolia-deployment
npx hardhat ignition verify sepolia-deployment
```

Escrow Contract: `0xD018195Faeb8739Fa5F11Cf93E1D2E267D4Db661`

Successfully verified contract "contracts/EscrowYieldTestnet.sol:EscrowYieldTestnet" for network sepolia:
  - https://sepolia.etherscan.io/address/0x3BAEb9466f866d0Ed7996586121e326f734211A9#code