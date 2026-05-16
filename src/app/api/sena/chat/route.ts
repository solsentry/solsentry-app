// /api/sena/chat — Interactive Sena chat stub.
//
// TODO: Replace canned responses with real LLM (Claude API) once budget
// cleared by Crash. For now, keyword matching against entity summary
// returns deterministic replies so the UX flow is shippable today.

import { NextResponse } from "next/server";

export const runtime = "nodejs";

interface ChatBody {
  entity_type: "operator" | "token";
  entity_id: string;
  summary?: Record<string, unknown>;
  message: string;
  history?: { role: "user" | "sena"; text: string }[];
}

function shortId(id: string) {
  if (!id) return "";
  if (id.length <= 12) return id;
  return id.slice(0, 6) + "…" + id.slice(-4);
}

function pickReply(body: ChatBody): string {
  const msg = body.message.toLowerCase();
  const s = body.summary ?? {};
  const id = body.entity_id;
  const isOperator = body.entity_type === "operator";

  const riskLevel = (s.riskLevel as string | undefined) ?? "UNKNOWN";
  const riskScore = s.riskScore as number | undefined;
  const totalTokens = s.totalTokens as number | undefined;
  const confirmedRugs = s.confirmedRugs as number | undefined;
  const rugRatePct = s.rugRatePct as number | undefined;
  const tags = (s.tags as string[] | undefined) ?? [];
  const flags = (s.flags as string[] | undefined) ?? [];
  const symbol = s.symbol as string | undefined;
  const deployer = s.deployer as string | undefined;

  // Drain / trace
  if (/(drain|trace|cash[- ]?out|cex|exit)/.test(msg)) {
    const target = isOperator ? id : deployer ?? id;
    return `Here's the drain pattern for ${shortId(target)}. Open /drain/${target} for the full hop trace — we follow SOL outflow until it hits a known CEX or mixer.`;
  }

  // History
  if (/(history|past|previous|track record|record|how many)/.test(msg)) {
    if (isOperator && totalTokens !== undefined) {
      return `This operator has ${totalTokens.toLocaleString()} tokens deployed in our monitored window${confirmedRugs !== undefined ? `, ${confirmedRugs.toLocaleString()} confirmed rugs (${(rugRatePct ?? 0).toFixed(1)}% rate)` : ""}. Full per-token list at /operator/${id}.`;
    }
    return `History view for this entity isn't broken out in chat yet. Try /operator/${deployer ?? id} for the deployer's full track record.`;
  }

  // Network / clusters
  if (/(cluster|network|connected|related|graph|tree)/.test(msg)) {
    const target = isOperator ? id : deployer ?? id;
    return `Open /network/${target} to see the operator graph — wallets that funded this address, co-deployed tokens, and shared bot infrastructure.`;
  }

  // Why risky / CRITICAL
  if (/(why|risk|critical|dangerous|safe|reason|flag)/.test(msg)) {
    if (riskLevel === "CRITICAL") {
      const reasons: string[] = [];
      if (rugRatePct !== undefined && rugRatePct > 80)
        reasons.push(`${rugRatePct.toFixed(1)}% rug rate across deployments`);
      if (tags.length) reasons.push(`tags: ${tags.slice(0, 3).join(", ")}`);
      if (flags.length) reasons.push(`flags: ${flags.slice(0, 3).join(", ")}`);
      const tail = reasons.length
        ? ` Signals: ${reasons.join(" · ")}.`
        : "";
      return `CRITICAL means the operator graph has high-confidence evidence of repeated rug patterns.${tail} 96.6% CRITICAL precision in aggregate.`;
    }
    if (riskLevel === "HIGH") {
      return `HIGH means multiple strong signals fired but the operator graph hasn't fully convicted. 98.9% HIGH precision in aggregate. ${flags.length ? `Flags: ${flags.slice(0, 4).join(", ")}.` : ""}`;
    }
    if (riskLevel === "SAFE") {
      return `Marked SAFE — no strong rug signals detected${riskScore !== undefined ? ` (score ${riskScore}/100)` : ""}. That doesn't guarantee future behavior; keep an eye on liquidity events.`;
    }
    return `Risk level is ${riskLevel}${riskScore !== undefined ? ` (${riskScore}/100)` : ""}. Not enough signal yet to escalate.`;
  }

  // Deployer
  if (/(deployer|deployed by|who made|operator|behind)/.test(msg)) {
    if (!isOperator && deployer) {
      return `This token was deployed by ${shortId(deployer)}. Open /operator/${deployer} to see the rest of their portfolio.`;
    }
    if (isOperator) {
      return `You're already on the operator view — ${shortId(id)}. Tokens deployed: ${totalTokens ?? "—"}.`;
    }
    return `Deployer not resolved yet for this mint. Check back after the next scan cycle.`;
  }

  // Telegram / alerts
  if (/(alert|telegram|notify|monitor|watch)/.test(msg)) {
    return `Add ${shortId(id)} to your watchlist on @solsentryai — you'll get a Telegram ping the moment it moves or deploys again.`;
  }

  // Symbol / metadata for token
  if (!isOperator && /(symbol|name|metadata|what is)/.test(msg)) {
    return `Token ${symbol ?? shortId(id)}${riskLevel ? ` · risk ${riskLevel}` : ""}${riskScore !== undefined ? ` (${riskScore}/100)` : ""}. Full mint data at /token/${id}.`;
  }

  // Default
  const label =
    riskLevel && riskLevel !== "UNKNOWN" ? riskLevel : "not yet classified";
  return `I see ${shortId(id)} is ${label}. To dive deeper, try /network/${isOperator ? id : deployer ?? id}, or ask me about its drain trace, history, or why it's flagged.`;
}

export async function POST(req: Request) {
  let body: ChatBody;
  try {
    body = (await req.json()) as ChatBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  if (!body?.message || !body?.entity_id || !body?.entity_type) {
    return NextResponse.json(
      { error: "entity_type, entity_id and message are required" },
      { status: 400 },
    );
  }

  const reply = pickReply(body);
  // Simulate brief analyst think time (~400ms)
  await new Promise((r) => setTimeout(r, 400));
  return NextResponse.json({ reply });
}
