# Escrow Smart Contract with Aave Yield

This project implements an Escrow system that leverages Aave's yield-generating capabilities. When funds are locked in escrow, they are deposited into Aave's lending pools, generating yield until they are withdrawn.

## Overview

The EscrowYieldTestnet smart contract enables users to:
- Create escrow transactions with timelock functionality
- Generate yield on locked funds using Aave protocol
- Approve fund releases after timelock expires
- Cancel escrow transactions (initiated by creator)
- Initiate and resolve disputes

## Deployed Contract

The contract is deployed on Sepolia testnet:
- Address: `0x665dd99C20A84acD35D6108f911e64cc36bc5102`
- [View on Etherscan](https://sepolia.etherscan.io/address/0x665dd99C20A84acD35D6108f911e64cc36bc5102#code)

## Smart Contracts

### EscrowYieldTestnet.sol

The main contract that handles:
- Creating escrow transactions
- Approving funds after timelock expiration
- Cancelling escrow transactions
- Dispute mechanisms
- Interaction with Aave's lending pools

### EscrowVariables.sol

An abstract contract that defines:
- Data structures (enums, structs)
- Mappings
- Events
- Modifiers
- Getter functions

## Technology Stack

- **Solidity**: v0.8.24
- **Testing Framework**: Hardhat with Viem
- **Contracts**:
  - OpenZeppelin: v5.0.2 (Ownable, Pausable, ReentrancyGuard, IERC20)
  - Aave Core v3: v1.19.3 (Pool, PoolAddressesProvider)
- **Development Tools**:
  - Hardhat: v2.22.8
  - Hardhat Ignition: For deployment
  - Hardhat Gas Reporter: For optimization
  - Hardhat Contract Sizer: For contract size monitoring
  - Hardhat Docgen: For documentation generation

## Testing

The codebase includes comprehensive tests for:
- Contract deployment
- Creating escrow transactions
- Approving escrow transactions after timelock
- Canceling escrow transactions
- Dispute handling and resolution

To run the tests:

```shell
npx hardhat test
```

## Deployment

Use Hardhat Ignition to deploy the contract:

```shell
npx hardhat ignition deploy ignition/modules/Escrow.ts --network sepolia --deployment-id sepolia-deployment
```

Verify the deployed contract:

```shell
npx hardhat ignition verify sepolia-deployment
```

## Aave Integration

The contract integrates with Aave v3 on Sepolia testnet, supporting the following tokens:
- DAI
- LINK
- USDC
- WBTC
- WETH
- USDT
- AAVE

## Features

- **Yield Generation**: Locked funds earn interest through Aave
- **Timelock**: Funds cannot be released until the specified time has passed
- **Dispute Resolution**: Mechanisms for handling disagreements between parties
- **Ownership**: Contract owner can pause the contract and rescue tokens in emergency
- **Security**: Built with ReentrancyGuard and other security best practices

## License

MIT