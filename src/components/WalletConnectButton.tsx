"use client";

import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useWallet } from "@solana/wallet-adapter-react";
import Link from "next/link";

export function WalletConnectButton() {
  const { connected, publicKey } = useWallet();

  if (connected && publicKey) {
    return (
      <div className="wallet-connected">
        <Link href="/me" className="wallet-me-link">
          My profile
        </Link>
        <WalletMultiButton className="wallet-btn-tiny" />
      </div>
    );
  }

  return <WalletMultiButton className="wallet-btn-nav" />;
}
