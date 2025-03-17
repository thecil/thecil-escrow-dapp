# Escrow DApp Frontend

This is the frontend interface for the Escrow DApp with Aave Yield Generation. Built with Next.js, it provides a user-friendly interface to interact with the Escrow smart contracts.

## Overview

The frontend application enables users to:
- Connect their wallets using RainbowKit
- Create new escrow transactions with various tokens
- View and manage their existing escrow transactions
- Approve fund releases after timelock expiration
- Cancel escrow transactions
- Handle disputes with other parties
- Track yield generated through Aave

## Technology Stack

- **Framework**: Next.js 14 (App Router)
- **UI Libraries**: 
  - Tailwind CSS for styling
  - shadcn/ui components
  - Framer Motion for animations
- **Web3 Integration**:
  - RainbowKit for wallet connection
  - Wagmi for contract interactions
  - Viem for Ethereum utilities
- **Form Handling**: 
  - React Hook Form
  - Zod for validation

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Key Components

### Pages
- **Welcome Page**: Landing page with features overview
- **Dashboard**: Main interface for managing escrow transactions
- **Escrow Details**: View detailed information about specific escrow transactions

### Web3 Components
- **New Escrow Transaction**: Form for creating new escrow deals
- **Escrow Transaction Table**: List of all user's escrow transactions
- **Escrow Details**: Detailed view of a specific escrow transaction
- **Escrow Buttons**: Action buttons for approving, cancelling, and disputing transactions

### Features
- **Responsive Design**: Works on desktop and mobile devices
- **Real-time Updates**: Transaction status updates in real-time
- **Token Support**: Multiple ERC20 tokens supported through Aave
- **Secure Authentication**: Wallet-based authentication
- **Transaction History**: View all your escrow transactions

## Environment Setup

Create a `.env.local` file with the following variables:
```
NEXT_PUBLIC_WALLETCONNECT_ID=your_walletconnect_project_id
NEXT_PUBLIC_ALCHEMY_ID=your_alchemy_api_key
```

## Deployment

The easiest way to deploy the Next.js app is to use the [Vercel Platform](https://vercel.com/new).

## License

MIT
