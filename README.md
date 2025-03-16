# Escrow DApp with Aave Yield Generation

![Escrow DApp](/frontend/public/landing_image.jpg)

## About This Project

This full-stack decentralized application was developed as part of the **Alchemy University Ethereum Developer Bootcamp**. It implements a smart contract escrow system with a modern web interface, enhanced by Aave's yield-generating capabilities to earn interest on funds while in escrow.

## Project Overview

The Escrow DApp allows users to:
- Create secure escrow transactions with customizable timelock periods
- Generate yield on locked funds through Aave lending pools
- Approve fund releases after the timelock expires
- Cancel escrow transactions (initiated by the creator)
- Initiate and resolve disputes between parties
- Track transaction status and generated yield

## Project Structure

This project consists of two main components:

### 1. Smart Contracts (`/solidity`)
- Solidity contracts for the escrow system with Aave integration
- Testing suite using Hardhat and Viem
- Deployment scripts using Hardhat Ignition

### 2. Frontend Application (`/frontend`)
- Next.js application with Tailwind CSS and shadcn/ui components
- Web3 integrations via RainbowKit, Wagmi, and Viem
- User interface for interacting with the smart contracts

## Live Demo

The application is deployed on Sepolia testnet:
- Frontend: [Coming Soon]
- Smart Contract: [`0x665dd99C20A84acD35D6108f911e64cc36bc5102`](https://sepolia.etherscan.io/address/0x665dd99C20A84acD35D6108f911e64cc36bc5102#code)

## Supported Tokens

The application supports the following tokens on Aave v3 (Sepolia):
- DAI
- LINK
- USDC
- WBTC
- WETH
- USDT
- AAVE

## Technical Highlights

- **Smart Contract Security**: Implemented best practices including reentrancy guards, access controls, and event emissions
- **Yield Generation**: Integration with Aave v3 protocol for generating yield on locked funds
- **Dispute Resolution**: Built-in mechanisms for handling and resolving disputes
- **Modern UI/UX**: Responsive design with animations and intuitive user flows
- **Web3 Integration**: Seamless wallet connection and transaction handling

## Installation and Setup

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- MetaMask or another Web3 wallet

### Smart Contracts
1. Navigate to the solidity directory:
   ```bash
   cd solidity
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run tests:
   ```bash
   npx hardhat test
   ```

4. Deploy contracts (optional, already deployed on Sepolia):
   ```bash
   npx hardhat ignition deploy ignition/modules/Escrow.ts --network sepolia --deployment-id sepolia-deployment
   ```

### Frontend
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file with the following variables:
   ```
   NEXT_PUBLIC_WALLETCONNECT_ID=your_walletconnect_project_id
   NEXT_PUBLIC_ALCHEMY_ID=your_alchemy_api_key
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Development Workflow

1. Make changes to smart contracts in the `solidity/contracts` directory
2. Test your changes with `npx hardhat test`
3. Update the frontend to integrate with your contract changes
4. Test the full application flow locally

## Alchemy University Project

This project was created as the final assignment for the Ethereum Developer Bootcamp at Alchemy University. It demonstrates practical knowledge of:
- Solidity smart contract development
- DeFi protocol integration (Aave)
- Testing and deployment of smart contracts
- Building modern frontends for Web3 applications
- Managing wallet connections and transactions

## Documentation

- [Smart Contract Documentation](/solidity/README.md)
- [Frontend Documentation](/frontend/README.md)

## Future Enhancements

- Multi-signature escrow transactions
- Integration with additional DeFi protocols
- Mobile application
- Support for additional networks

## License

MIT

## Acknowledgements

- [Alchemy University](https://university.alchemy.com/) for the education and inspiration
- [Aave](https://aave.com/) for their lending protocol
- [Ethers.js](https://docs.ethers.org/v5/) and [Viem](https://viem.sh/) for Ethereum interactions
- [Next.js](https://nextjs.org/) for the frontend framework
- [RainbowKit](https://www.rainbowkit.com/) for wallet connections
