"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function OperatorSearchForm() {
  const router = useRouter();
  const [wallet, setWallet] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = wallet.trim();
    if (!trimmed) {
      setError("Enter a wallet address");
      return;
    }
    if (trimmed.length < 32 || trimmed.length > 44) {
      setError("Invalid Solana address length (32–44 chars)");
      return;
    }
    setError(null);
    router.push(`/operator/${encodeURIComponent(trimmed)}`);
  };

  return (
    <form onSubmit={handleSubmit} className="op-form">
      <input
        type="text"
        value={wallet}
        onChange={(e) => {
          setWallet(e.target.value);
          if (error) setError(null);
        }}
        placeholder="Solana wallet address"
        spellCheck={false}
        autoComplete="off"
        className="op-input"
      />
      <button type="submit" className="op-submit">
        Check
      </button>
      {error && <div className="op-error">{error}</div>}
    </form>
  );
}
