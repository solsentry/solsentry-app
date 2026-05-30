"use client";

// SIWS sign-in button. On wallet connect:
//   1. POST /v1/auth/wallet/nonce { pubkey } → { nonce, message, issued_at }
//   2. wallet.signMessage(message) → 64-byte ed25519 signature
//   3. POST /v1/auth/wallet/verify { pubkey, nonce, signature, issued_at }
//   4. Server sets HttpOnly solsentry_session cookie → redirect to callback.

import { useCallback, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import bs58 from "bs58";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "https://api.solsentry.app";

function encodeSig(sig: Uint8Array): string {
  // Base58 — matches what wallets typically emit and what the backend's
  // _decode_signature() tries first via solders.Signature.from_string.
  try {
    return bs58.encode(sig);
  } catch {
    // Fall back to base64 if bs58 not available at runtime
    if (typeof btoa === "function") {
      let s = "";
      for (let i = 0; i < sig.length; i++) s += String.fromCharCode(sig[i]);
      return btoa(s);
    }
    return "";
  }
}

export function ConnectWalletButton() {
  const { publicKey, signMessage, connected } = useWallet();
  const router = useRouter();
  const params = useSearchParams();
  const [status, setStatus] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const signIn = useCallback(async () => {
    if (!publicKey || !signMessage) {
      setStatus("Wallet does not support message signing.");
      return;
    }
    setBusy(true);
    setStatus(null);

    try {
      const pubkey = publicKey.toBase58();

      const nonceRes = await fetch(`${API_BASE}/v1/auth/wallet/nonce`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ pubkey }),
      });
      if (!nonceRes.ok) throw new Error("Failed to request nonce");
      const { nonce, message, issued_at } = await nonceRes.json();

      const encoded = new TextEncoder().encode(message);
      const signature = await signMessage(encoded);

      const verifyRes = await fetch(`${API_BASE}/v1/auth/wallet/verify`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          pubkey,
          nonce,
          signature: encodeSig(signature),
          issued_at,
        }),
      });
      if (!verifyRes.ok) {
        const body = await verifyRes.json().catch(() => ({}));
        throw new Error(body.error || "Verification failed");
      }

      const callback = params.get("callback") || "/app";
      router.push(callback);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Sign-in failed";
      setStatus(msg);
    } finally {
      setBusy(false);
    }
  }, [publicKey, signMessage, router, params]);

  return (
    <div className="siws-button">
      <WalletMultiButton />
      {connected && (
        <button type="button" onClick={signIn} disabled={busy} className="siws-primary">
          {busy ? "Signing in…" : "Sign in with this wallet"}
        </button>
      )}
      {status && <p className="siws-status">{status}</p>}
      <style jsx>{`
        .siws-button {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          align-items: stretch;
        }
        .siws-primary {
          background: #d97706;
          color: #100e0a;
          border: 0;
          font-weight: 600;
          padding: 0.85rem 1.25rem;
          border-radius: 8px;
          cursor: pointer;
        }
        .siws-primary:hover {
          background: #f59e0b;
        }
        .siws-primary:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        .siws-status {
          color: #f87171;
          font-size: 0.875rem;
          margin: 0;
        }
      `}</style>
    </div>
  );
}
