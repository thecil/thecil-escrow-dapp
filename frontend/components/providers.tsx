"use client";

import type { ReactNode } from "react";
import { WagmiProvider, cookieToInitialState } from "wagmi";
import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ThemeProvider } from "next-themes";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { hashFn } from "wagmi/query";
import { wagmiConfig } from "@/config/wagmi-config";
import { structuralSharing } from "@wagmi/core/query";

type Props = {
  children: ReactNode;
  cookie: string;
};

const Providers = ({ children, cookie }: Props) => {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);
  const [queryClient] = React.useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 30 * 1000, // 30 secs
            gcTime: 60 * 1000, // 60 secs
            queryKeyHashFn: hashFn,
            structuralSharing
          }
        }
      }),
  );
  const initialState = cookieToInitialState(wagmiConfig, cookie);
  return (
    <QueryClientProvider client={queryClient}>
      <WagmiProvider config={wagmiConfig} initialState={initialState}>
        <RainbowKitProvider modalSize="compact">
          <ThemeProvider enableSystem={false} defaultTheme="dark" attribute="class">
            {mounted && children}
          </ThemeProvider>
        </RainbowKitProvider>
      </WagmiProvider>
      <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-left" />
    </QueryClientProvider>
  );
};

export default Providers;
