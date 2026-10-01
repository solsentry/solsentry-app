// Pure helpers for the public scan card on the home page.
// Kept out of the component so the gating rules live in one reviewable place.

/**
 * Deployer wallet gate. The raw `dev_wallet` field is NOT necessarily the deployer
 * (it can be an LP-position holder or a third party), so the address is shown ONLY
 * when the API itself says the attribution is proven on-chain:
 *
 *   dev_wallet_attribution === "verified"  AND
 *   dev_wallet_verdict     === "verified_deployer"  AND
 *   dev_wallet is a non-empty string
 *
 * Anything else (unverified / inconclusive / fields missing / older API) returns
 * null, and the card says "deployer not verified".
 */
export interface DeployerFields {
  dev_wallet?: string | null;
  dev_wallet_attribution?: string | null;
  dev_wallet_verdict?: string | null;
}

export function verifiedDeployer(tok: DeployerFields | null | undefined): string | null {
  if (!tok) return null;
  if (tok.dev_wallet_attribution !== "verified") return null;
  if (tok.dev_wallet_verdict !== "verified_deployer") return null;
  return typeof tok.dev_wallet === "string" && tok.dev_wallet.length > 0 ? tok.dev_wallet : null;
}

/** True when the payload carries the attribution fields at all (else the cell is hidden). */
export function hasDeployerFields(tok: DeployerFields | null | undefined): boolean {
  return (
    !!tok &&
    typeof tok.dev_wallet_attribution === "string" &&
    typeof tok.dev_wallet_verdict === "string"
  );
}

// Tags that describe a wallet's other tokens rather than this mint. The public card
// shows mint-level facts only.
const WALLET_HISTORY_TAG_RE =
  /deployer[_\s-]*(history|has|rug)|operator|serial|repeat[_\s-]*(deployer|offender)|rug[_\s-]*history|confirmed[_\s-]*rugs?|known[_\s-]*rugger|linked[_\s-]*wallets?|prior[_\s-]*rugs?|rugger/i;

export function isWalletHistoryTag(t: string | null | undefined): boolean {
  return !!t && WALLET_HISTORY_TAG_RE.test(t);
}
