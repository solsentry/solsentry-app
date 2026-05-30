"use client";

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { AlertTriangle, Copy, ExternalLink, Shield, TrendingUp, Users } from 'lucide-react';
import { RiskBadge } from '@/components/RiskBadge';

// DESIGN TOKENS (exact from V0_REMAINING spec for this generation)
const TOKENS = {
  bg: '#0a0a0a',
  surface: '#1a1a1a',
  surfaceCard: '#1a1a1a',
  border: '#262626',
  amber: '#f59e0b',
  amberGlow: 'shadow-[0_0_20px_rgba(245,158,11,0.15)]',
  textPrimary: '#fafafa',
  textMuted: '#a3a3a3',
  textDim: '#525252',
  critical: '#ef4444',
  high: '#f59e0b',
  medium: '#eab308',
  safe: '#14b8a6',
  fontMono: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
};

interface MockTokenData {
  mint: string;
  symbol: string;
  name: string;
  riskScore: number;
  riskLevel: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'SAFE';
  verdict: string;
  age: string;
  holders: number;
  liquidity: number;
  volume24h: number;
  topHolderConcentration: number;
  bondingCurve: string;
  devWallet: string;
  devRisk: string;
  devTokens: number;
  devRugs: number;
  devRugRate: number;
  signals: Array<{
    label: string;
    impact: number;
    description: string;
  }>;
  holdersTable: Array<{
    address: string;
    balance: string;
    pct: number;
    label: string;
  }>;
  similarTokens: Array<{
    mint: string;
    symbol: string;
    risk: string;
    outcome: string;
  }>;
  narrative: string;
  confidence: number;
  lastUpdated: string;
}

// High-quality mock for a CRITICAL partner example (fictionalized, follows rules)
const MOCK_CRITICAL: MockTokenData = {
  mint: '4kxsCuteRLQdNiTXA33YYsvywAPNA6DQTifswxjL5pH1',
  symbol: 'RUGX',
  name: 'RugX Protocol',
  riskScore: 94,
  riskLevel: 'CRITICAL',
  verdict: 'AVOID — Serial rugger deployer with extreme concentration signals',
  age: '47m ago',
  holders: 1247,
  liquidity: 18400,
  volume24h: 142000,
  topHolderConcentration: 68,
  bondingCurve: 'Active (78% complete)',
  devWallet: '4kxscuteRLQdNiTXA33YYsvywAPNA6DQTifswxjL5pH1',
  devRisk: 'CRITICAL',
  devTokens: 3212,
  devRugs: 2953,
  devRugRate: 91.9,
  signals: [
    { label: 'Deployer is serial rugger', impact: -40, description: '2,953 confirmed rugs across 3,212 tokens' },
    { label: 'Bundle launch detected', impact: -22, description: 'Coordinated snipers + dev wallets in first 8 blocks' },
    { label: 'Top 5 holders control 68%', impact: -18, description: 'Extreme concentration — classic drain setup' },
    { label: 'No locked liquidity', impact: -12, description: 'LP not burned or locked' },
    { label: 'Rapid holder decay pattern', impact: -8, description: 'Matches 14 previous rugs by same dev' },
  ],
  holdersTable: [
    { address: '7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU', balance: '28.4M', pct: 28.4, label: 'Dev (bundle)' },
    { address: '9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM', balance: '14.1M', pct: 14.1, label: 'CEX hot wallet' },
    { address: '3n4fJ3vKxL9pQ2mR7sT8uV6wX5yZ4aB3cD2eF1gH9iJ', balance: '11.9M', pct: 11.9, label: 'Unknown' },
    { address: '5tYbN8mK2pL7vR3sX9wQ4uE6iO1aP5bC7dF9gH2jK4lM', balance: '9.2M', pct: 9.2, label: 'Sniper cluster' },
    { address: '8vZcM3nP6qR9sT2uV5wX8yZ1aB4cD7eF0gH3iJ6kL9mN', balance: '4.8M', pct: 4.8, label: 'Unknown' },
  ],
  similarTokens: [
    { mint: '7vKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU', symbol: 'DUMP', risk: 'CRITICAL', outcome: 'Rug (3h)' },
    { mint: '2n4fJ3vKxL9pQ2mR7sT8uV6wX5yZ4aB3cD2eF1gH9iJ', symbol: 'EXIT', risk: 'CRITICAL', outcome: 'Rug (11h)' },
    { mint: '9tYbN8mK2pL7vR3sX9wQ4uE6iO1aP5bC7dF9gH2jK4lM', symbol: 'RUGV2', risk: 'HIGH', outcome: 'Rug (41h)' },
  ],
  narrative: "This token was deployed by a known serial operator (4kxscute...) with a 91.9% historical rug rate. The launch shows classic bundle + sniper coordination in the first minutes, followed by rapid liquidity concentration into a small number of wallets. Holder distribution and sell pressure patterns match 14 previous rugs from the same cluster. Liquidity is not locked. High probability of coordinated exit within hours.",
  confidence: 94,
  lastUpdated: '2m ago',
};

// Using the project's RiskBadge component for consistency
// while keeping the v0 visual treatment for this partner page.

export default function ScanTokenPage() {
  const params = useParams<{ mint: string }>();
  const mint = params.mint || MOCK_CRITICAL.mint;

  // In real version this would fetch from API or use props
  const data = MOCK_CRITICAL; // Using high-quality mock per spec

  const copy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div style={{ background: TOKENS.bg, color: TOKENS.textPrimary, minHeight: '100vh', fontFamily: 'Inter, system-ui, sans-serif' }}>
      {/* Minimal premium nav for partner landing */}
      <nav style={{ borderBottom: `1px solid ${TOKENS.border}`, padding: '12px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 28, height: 28, background: TOKENS.amber, borderRadius: 6 }} />
            <span style={{ fontWeight: 700, fontSize: 18, letterSpacing: '-0.02em' }}>SolSentry</span>
          </div>
          <div style={{ fontSize: 12, color: TOKENS.textMuted }}>
            Threat intelligence for Solana
          </div>
        </div>
      </nav>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 24px 80px' }}>
        {/* HERO */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
            <div style={{ width: 56, height: 56, background: TOKENS.surface, border: `1px solid ${TOKENS.border}`, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, fontWeight: 700 }}>
              {data.symbol.slice(0, 2)}
            </div>
            <div>
              <div style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-0.02em' }}>{data.name}</div>
              <div style={{ fontSize: 15, color: TOKENS.textMuted }}>${data.symbol}</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            <div
              onClick={() => copy(data.mint)}
              style={{
                fontFamily: TOKENS.fontMono,
                fontSize: 13,
                background: TOKENS.surface,
                border: `1px solid ${TOKENS.border}`,
                padding: '6px 12px',
                borderRadius: 8,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              {data.mint.slice(0, 6)}…{data.mint.slice(-6)}
              <Copy size={14} />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div
                style={{
                  fontSize: 42,
                  fontWeight: 800,
                  lineHeight: 1,
                  color: data.riskLevel === 'CRITICAL' ? TOKENS.critical : TOKENS.amber,
                }}
              >
                {data.riskScore}
              </div>
              <div>
                <RiskBadge level={data.riskLevel} />
                <div style={{ fontSize: 11, color: TOKENS.textDim, marginTop: 2 }}>RISK SCORE</div>
              </div>
            </div>
          </div>

          <div style={{ marginTop: 16, fontSize: 17, color: TOKENS.textMuted, maxWidth: 720 }}>
            {data.verdict}
          </div>

          <div style={{ marginTop: 16, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <button
              onClick={() => copy(data.mint)}
              style={{
                background: TOKENS.amber,
                color: '#111',
                padding: '10px 18px',
                borderRadius: 8,
                fontWeight: 600,
                fontSize: 14,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                border: 'none',
                cursor: 'pointer',
              }}
            >
              <Copy size={16} /> Copy mint address
            </button>
            <Link
              href={`/operator/${data.devWallet}`}
              style={{
                background: TOKENS.surface,
                border: `1px solid ${TOKENS.border}`,
                padding: '10px 18px',
                borderRadius: 8,
                fontSize: 14,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                color: TOKENS.textPrimary,
                textDecoration: 'none',
              }}
            >
              View deployer profile <ExternalLink size={16} />
            </Link>
          </div>
        </div>

        {/* QUICK STATS BAR */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12, marginBottom: 32 }}>
          {[
            { label: 'Age', value: data.age, icon: <AlertTriangle size={16} /> },
            { label: 'Holders', value: data.holders.toLocaleString(), icon: <Users size={16} /> },
            { label: 'Liquidity', value: `$${data.liquidity.toLocaleString()}`, icon: <TrendingUp size={16} /> },
            { label: '24h Volume', value: `$${data.volume24h.toLocaleString()}`, icon: <TrendingUp size={16} /> },
            { label: 'Top 5 Concentration', value: `${data.topHolderConcentration}%`, icon: <AlertTriangle size={16} /> },
            { label: 'Bonding Curve', value: data.bondingCurve, icon: <Shield size={16} /> },
          ].map((stat, i) => (
            <div key={i} style={{ background: TOKENS.surface, border: `1px solid ${TOKENS.border}`, borderRadius: 10, padding: 14 }}>
              <div style={{ fontSize: 11, color: TOKENS.textDim, marginBottom: 4 }}>{stat.label}</div>
              <div style={{ fontSize: 17, fontWeight: 600 }}>{stat.value}</div>
            </div>
          ))}
        </div>

        {/* RISK BREAKDOWN */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ fontSize: 13, color: TOKENS.textMuted, marginBottom: 10, fontWeight: 600 }}>RISK BREAKDOWN</div>
          <div style={{ background: TOKENS.surface, border: `1px solid ${TOKENS.border}`, borderRadius: 12, padding: 20 }}>
            {data.signals.map((sig, idx) => (
              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: idx < data.signals.length - 1 ? `1px solid ${TOKENS.border}` : 'none' }}>
                <div>
                  <div style={{ fontWeight: 600 }}>{sig.label}</div>
                  <div style={{ fontSize: 13, color: TOKENS.textDim }}>{sig.description}</div>
                </div>
                <div style={{ fontSize: 15, fontWeight: 700, color: sig.impact < 0 ? TOKENS.critical : TOKENS.safe, minWidth: 52, textAlign: 'right' }}>
                  {sig.impact}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* DEPLOYER + HOLDERS */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 32 }}>
          {/* Deployer */}
          <div style={{ background: TOKENS.surface, border: `1px solid ${TOKENS.border}`, borderRadius: 12, padding: 20 }}>
            <div style={{ fontSize: 13, color: TOKENS.textDim, marginBottom: 8 }}>DEPLOYER</div>
            <div style={{ fontFamily: TOKENS.fontMono, fontSize: 13, marginBottom: 8 }}>{data.devWallet}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <RiskBadge level={data.devRisk} />
              <span style={{ fontSize: 13 }}>{data.devRugRate}% rug rate</span>
            </div>
            <div style={{ fontSize: 13, color: TOKENS.textMuted }}>
              {data.devTokens.toLocaleString()} tokens • {data.devRugs.toLocaleString()} rugs
            </div>
            <Link href={`/operator/${data.devWallet}`} style={{ fontSize: 13, color: TOKENS.amber, marginTop: 12, display: 'inline-block' }}>
              Full operator profile →
            </Link>
          </div>

          {/* Holder concentration */}
          <div style={{ background: TOKENS.surface, border: `1px solid ${TOKENS.border}`, borderRadius: 12, padding: 20 }}>
            <div style={{ fontSize: 13, color: TOKENS.textDim, marginBottom: 8 }}>TOP HOLDERS (CONCENTRATION WARNING)</div>
            {data.holdersTable.slice(0, 4).map((h, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, padding: '5px 0', borderBottom: i < 3 ? `1px solid ${TOKENS.border}` : 'none' }}>
                <div style={{ fontFamily: TOKENS.fontMono }}>{h.address.slice(0, 6)}…{h.address.slice(-4)}</div>
                <div style={{ color: TOKENS.textMuted }}>{h.pct}% <span style={{ color: TOKENS.textDim }}>({h.label})</span></div>
              </div>
            ))}
            <div style={{ fontSize: 12, color: TOKENS.critical, marginTop: 8 }}>Top 5 control {data.topHolderConcentration}% — high rug risk</div>
          </div>
        </div>

        {/* AI NARRATIVE */}
        <div style={{ background: TOKENS.surface, border: `1px solid ${TOKENS.border}`, borderLeft: `4px solid ${TOKENS.amber}`, borderRadius: 12, padding: 22, marginBottom: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <span style={{ color: TOKENS.amber }}>✦</span>
            <span style={{ fontWeight: 700 }}>Sentinel’s Assessment</span>
            <span style={{ marginLeft: 'auto', fontSize: 12, color: TOKENS.textDim }}>Confidence: {data.confidence}% • {data.lastUpdated}</span>
          </div>
          <div style={{ fontSize: 15, lineHeight: 1.55, color: TOKENS.textPrimary }}>
            {data.narrative}
          </div>
        </div>

        {/* SIMILAR TOKENS */}
        <div style={{ marginBottom: 40 }}>
          <div style={{ fontSize: 13, color: TOKENS.textDim, marginBottom: 10 }}>OTHER TOKENS BY THIS DEPLOYER</div>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {data.similarTokens.map((t, i) => (
              <Link key={i} href={`/scan/${t.mint}`} style={{ background: TOKENS.surface, border: `1px solid ${TOKENS.border}`, borderRadius: 10, padding: '10px 16px', fontSize: 14, textDecoration: 'none', color: TOKENS.textPrimary }}>
                ${t.symbol} <span style={{ color: TOKENS.critical }}>({t.risk})</span> • {t.outcome}
              </Link>
            ))}
          </div>
        </div>

        {/* PARTNER CTA STRIP */}
        <div style={{ background: 'rgba(245,158,11,0.08)', border: `1px solid ${TOKENS.amber}30`, borderRadius: 12, padding: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <div style={{ fontWeight: 600 }}>This scan powered by SolSentry</div>
            <div style={{ fontSize: 13, color: TOKENS.textMuted }}>Real-time operator risk for your users. Free public API + MCP.</div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <Link href="/mcp" style={{ fontSize: 13, padding: '8px 16px', border: `1px solid ${TOKENS.border}`, borderRadius: 8, color: TOKENS.textPrimary, textDecoration: 'none' }}>
              Get MCP
            </Link>
            <Link href="/api" style={{ fontSize: 13, padding: '8px 16px', background: TOKENS.amber, color: '#111', borderRadius: 8, textDecoration: 'none', fontWeight: 600 }}>
              API Docs
            </Link>
          </div>
        </div>
      </div>

      <footer style={{ borderTop: `1px solid ${TOKENS.border}`, padding: 24, textAlign: 'center', fontSize: 12, color: TOKENS.textDim }}>
        SolSentry — Operator intelligence for Solana. Data is for informational purposes only.
      </footer>
    </div>
  );
}
