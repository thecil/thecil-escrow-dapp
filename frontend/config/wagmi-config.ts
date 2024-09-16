"use client";

import { getDefaultConfig, getDefaultWallets } from "@rainbow-me/rainbowkit";
import { http, cookieStorage, createStorage } from "wagmi";
import { sepolia } from "wagmi/chains";

const sepoliaRpc = process.env.NEXT_PUBLIC_ALCHEMY_RPC as string;
const projectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_ID as string;

const { wallets } = getDefaultWallets();

export const wagmiConfig = getDefaultConfig({
  appName: "Escrow Dapp",
  projectId: projectId,
  wallets: [...wallets],
  chains: [sepolia],
  ssr: true,
  storage: createStorage({
    storage: cookieStorage
  }),
  transports: {
    [sepolia.id]: http(sepoliaRpc, {
      key: "alchemy-sepolia"
    })
  }
});
