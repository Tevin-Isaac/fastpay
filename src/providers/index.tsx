"use client";

import * as React from "react";
import {
  RainbowKitProvider,
  getDefaultWallets,
  getDefaultConfig,
} from "@rainbow-me/rainbowkit";
import { coinbaseWallet } from "@rainbow-me/rainbowkit/wallets";
import { baseSepolia } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";

const projectId = process.env.NEXT_PUBLIC_WC_PROJECT_ID as string;

const { wallets } = getDefaultWallets();

const config = getDefaultConfig({
  appName: "FastPay",
  projectId,
  wallets: [
    ...wallets,
    {
      groupName: "Other",
      wallets: [coinbaseWallet],
    },
  ],
  chains: [baseSepolia],
  ssr: true,
});

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider modalSize="compact">{children}</RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
