import Link from "next/link";
import { WalletConnectButton } from "./WalletConnectButton";

export function Nav() {
  return (
    <nav className="nav">
      <div className="container nav-inner">
        <Link href="/" className="nav-brand">
          <span className="dot" aria-hidden />
          SolSentry
        </Link>
        <div className="nav-links">
          <Link href="/operator">Operator</Link>
          <Link href="/token">Token</Link>
          <Link href="/leaderboard">Leaderboard</Link>
          <Link href="/alerts">Alerts</Link>
          <Link href="/docs">Docs</Link>
          <a href="https://github.com/solsentry" target="_blank" rel="noreferrer">
            GitHub
          </a>
          <WalletConnectButton />
        </div>
      </div>
    </nav>
  );
}
