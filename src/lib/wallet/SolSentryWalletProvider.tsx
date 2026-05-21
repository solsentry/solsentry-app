"use client";

// SolSentry wallet provider — wraps @solana/wallet-adapter-react for
// Phantom / Solflare. Backpack adapter removed: @solana/wallet-adapter-wallets
// dropped BackpackWalletAdapter in 2024 (Backpack pushes their own SDK).
// Mainnet by default; override via NEXT_PUBLIC_SOLANA_RPC env.

import { useMemo, type ReactNode } from "react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import { clusterApiUrl } from "@solana/web3.js";

import "@solana/wallet-adapter-react-ui/styles.css";

interface Props {
  children: ReactNode;
  endpoint?: string;
}

export function SolSentryWalletProvider({ children, endpoint }: Props) {
  const rpcEndpoint = useMemo(
    () =>
      endpoint ||
      process.env.NEXT_PUBLIC_SOLANA_RPC ||
      clusterApiUrl(WalletAdapterNetwork.Mainnet),
    [endpoint],
  );

  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
    ],
    [],
  );

  return (
    <ConnectionProvider endpoint={rpcEndpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
