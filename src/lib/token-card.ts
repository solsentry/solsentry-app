// Pure helpers for the closed-beta token card (/token/[mint]).
// Kept out of the page so the gating rules are in one reviewable place.

import type { Token } from "@/lib/api";

export const BASE58_RE = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;

export const BETA_SEAL = "Beta — research preview; risk scores are being re-measured";

/**
 * Deployer wallet gate. `predictions.dev_wallet` raw is NOT the deployer (it can be an
 * LP-position holder or a third party), so the address is shown ONLY when the API
 * itself says the attribution is proven on-chain:
 *
 *   dev_wallet_attribution === "verified"  AND
 *   dev_wallet_verdict     === "verified_deployer"  AND
 *   dev_wallet is a non-empty string
 *
 * Anything else (unverified / inconclusive / fields missing / older API) → null,
 * and the card says "deployer not verified". Values observed live 2026-09-30:
 *   verified + verified_deployer + source=resolver   → shown
 *   unverified + inconclusive + source=null          → hidden
 *   (fields absent, dev_wallet null)                 → hidden
 */
export function verifiedDeployer(tok: Token | null | undefined): string | null {
  if (!tok) return null;
  if (tok.dev_wallet_attribution !== "verified") return null;
  if (tok.dev_wallet_verdict !== "verified_deployer") return null;
  return typeof tok.dev_wallet === "string" && tok.dev_wallet.length > 0 ? tok.dev_wallet : null;
}

// Signals that are really OPERATOR history (LOCK-01 / LOCK-03): the closed beta card
// shows mint-level facts only, never counts or narrative about a wallet's other tokens.
const OPERATOR_SIGNAL_RE =
  /deployer[_\s-]*(history|has|rug)|operator|serial|repeat[_\s-]*(deployer|offender)|rug[_\s-]*history|confirmed[_\s-]*rugs?|known[_\s-]*rugger|linked[_\s-]*wallets?|prior[_\s-]*rugs?|rugger/i;

export function isOperatorSignal(...texts: Array<string | null | undefined>): boolean {
  return texts.some((t) => !!t && OPERATOR_SIGNAL_RE.test(t));
}
