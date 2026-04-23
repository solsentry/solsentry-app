"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function TokenSearchForm() {
  const router = useRouter();
  const [mint, setMint] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = mint.trim();
    if (!trimmed) {
      setError("Enter a mint address");
      return;
    }
    if (trimmed.length < 32 || trimmed.length > 44) {
      setError("Invalid Solana mint address (32–44 chars)");
      return;
    }
    setError(null);
    router.push(`/token/${encodeURIComponent(trimmed)}`);
  };

  return (
    <form onSubmit={handleSubmit} className="op-form">
      <input
        type="text"
        value={mint}
        onChange={(e) => {
          setMint(e.target.value);
          if (error) setError(null);
        }}
        placeholder="Solana mint address"
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
