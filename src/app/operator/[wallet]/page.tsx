"use client";

import React from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Copy, ExternalLink, Clock, Users, TrendingDown } from 'lucide-react';
import { RiskBadge } from '@/components/RiskBadge';

// DESIGN TOKENS - matching v0 spec for this important page
const TOKENS = {
  bg: '#0a0a0a',
  surface: '#1a1a1a',
  border: '#262626',
  amber: '#f59e0b',
  critical: '#ef4444',
  text: '#fafafa',
  muted: '#a3a3a3',
  dim: '#525252',
  mono: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
};

interface OperatorData {
  wallet: string;
  riskScore: number;
  riskLevel: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'SAFE';
  tags: string[];
  firstSeen: string;
  lastActive: string;
  totalTokens: number;
  rugs: number;
  rugRate: number;
  solDrained: number;
  avgLifespanHours: number;
  clusters: number;
  narrative: string;
  confidence: number;
  tokens: Array<{
    mint: string;
    symbol: string;
    created: string;
    outcome: string;
    solDrained: number;
    lifespan: string;
  }>;
  connections: Array<{
    wallet: string;
    relation: string;
  }>;
  activity: Array<{
    time: string;
    action: string;
    target: string;
  }>;
}

const MOCK_OPERATOR: OperatorData = {
  wallet: '4kxscuteRLQdNiTXA33YYsvywAPNA6DQTifswxjL5pH1',
  riskScore: 94,
  riskLevel: 'CRITICAL',
  tags: ['serial_deployer', 'fast_deployer', 'rebrand_artist'],
  firstSeen: '2025-01-12',
  lastActive: '2 minutes ago',
  totalTokens: 3212,
  rugs: 2953,
  rugRate: 91.9,
  solDrained: 1240000,
  avgLifespanHours: 14,
  clusters: 47,
  narrative: "This operator has maintained an extremely consistent pattern of high-volume deployment followed by rapid rug pulls. Over 3,200 tokens launched, with 91.9% resulting in confirmed rugs. The wallet shows clear coordination with multiple bot clusters and rebranding patterns to evade simple detection. Activity remains high as of the last scan.",
  confidence: 94,
  tokens: [
    { mint: 'So1111...11112', symbol: 'RUGX', created: '47m ago', outcome: 'Rug', solDrained: 18400, lifespan: '3h 12m' },
    { mint: '4kxsCu...5pH1', symbol: 'EXIT', created: '2d ago', outcome: 'Rug', solDrained: 67000, lifespan: '9h' },
    { mint: '7vKXtg...gAsU', symbol: 'DUMP', created: '3d ago', outcome: 'Rug', solDrained: 41000, lifespan: '41h' },
  ],
  connections: [
    { wallet: '7vKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU', relation: 'Funded by' },
    { wallet: '9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM', relation: 'Co-deployer' },
    { wallet: '3n4fJ3vKxL9pQ2mR7sT8uV6wX5yZ4aB3cD2eF1gH9iJ', relation: 'Bundle peer' },
  ],
  activity: [
    { time: '2m ago', action: 'Deployed', target: 'RUGX (new mint)' },
    { time: '19m ago', action: 'Transferred', target: '47.2 SOL to CEX deposit' },
    { time: '41m ago', action: 'Deployed', target: 'EXIT token' },
  ],
};

export default function OperatorPage() {
  const params = useParams<{ wallet: string }>();
  const wallet = params.wallet || MOCK_OPERATOR.wallet;
  const data = MOCK_OPERATOR; // High quality mock per spec

  const copy = (text: string) => navigator.clipboard.writeText(text);

  return (
    <div style={{ background: TOKENS.bg, color: TOKENS.text, minHeight: '100vh' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 24px' }}>
        {/* PAGE HEADER */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            <div style={{ fontFamily: TOKENS.mono, fontSize: 15, background: TOKENS.surface, padding: '4px 10px', borderRadius: 6, border: `1px solid ${TOKENS.border}` }}>
              {wallet}
              <span onClick={() => copy(wallet)} style={{ marginLeft: 8, cursor: 'pointer', opacity: 0.6 }}><Copy size={14} /></span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ fontSize: 36, fontWeight: 800, color: data.riskLevel === 'CRITICAL' ? TOKENS.critical : TOKENS.amber }}>
                {data.riskScore}
              </div>
              <RiskBadge level={data.riskLevel} />
            </div>

            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {data.tags.map(tag => (
                <span key={tag} style={{ fontSize: 11, padding: '2px 8px', background: 'rgba(245,158,11,0.1)', color: TOKENS.amber, borderRadius: 999, border: `1px solid ${TOKENS.amber}30` }}>
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div style={{ marginTop: 8, color: TOKENS.muted, fontSize: 13 }}>
            First seen: {data.firstSeen} • Last active: {data.lastActive}
          </div>

          <div style={{ marginTop: 14, display: 'flex', gap: 10 }}>
            <button style={{ background: TOKENS.amber, color: '#111', padding: '8px 16px', borderRadius: 8, fontWeight: 600, border: 'none', cursor: 'pointer' }}>
              + Add to Watchlist
            </button>
            <button onClick={() => copy(window.location.href)} style={{ background: TOKENS.surface, border: `1px solid ${TOKENS.border}`, padding: '8px 16px', borderRadius: 8, cursor: 'pointer' }}>
              Share Report
            </button>
          </div>
        </div>

        {/* TOP STATS BAR */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12, marginBottom: 32 }}>
          {[
            { label: 'Total tokens', value: data.totalTokens.toLocaleString(), icon: <Users size={16} /> },
            { label: 'Rugs / Rate', value: `${data.rugs.toLocaleString()} (${data.rugRate}%)`, icon: <TrendingDown size={16} /> },
            { label: 'SOL Drained', value: `$${(data.solDrained / 1000000).toFixed(1)}M`, icon: <TrendingDown size={16} /> },
            { label: 'Avg Lifespan', value: `${data.avgLifespanHours}h`, icon: <Clock size={16} /> },
            { label: 'Associated Clusters', value: data.clusters, icon: <Users size={16} /> },
          ].map((s, i) => (
            <div key={i} style={{ background: TOKENS.surface, border: `1px solid ${TOKENS.border}`, borderRadius: 10, padding: 14 }}>
              <div style={{ fontSize: 11, color: TOKENS.dim }}>{s.label}</div>
              <div style={{ fontSize: 20, fontWeight: 700, marginTop: 4 }}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* AI NARRATIVE PANEL */}
        <div style={{ background: TOKENS.surface, border: `1px solid ${TOKENS.border}`, borderLeft: `5px solid ${TOKENS.amber}`, borderRadius: 10, padding: 20, marginBottom: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <span style={{ color: TOKENS.amber }}>✦</span>
            <span style={{ fontWeight: 700 }}>Sentinel’s Assessment</span>
            <span style={{ marginLeft: 'auto', fontSize: 12, color: TOKENS.dim }}>Confidence {data.confidence}%</span>
          </div>
          <p style={{ lineHeight: 1.6, color: TOKENS.text }}>{data.narrative}</p>
        </div>

        {/* TOKENS DEPLOYED TABLE */}
        <div style={{ marginBottom: 32 }}>
          <h3 style={{ marginBottom: 12, fontSize: 15 }}>Recent Tokens Deployed</h3>
          <div style={{ background: TOKENS.surface, border: `1px solid ${TOKENS.border}`, borderRadius: 10, overflow: 'hidden' }}>
            <table style={{ width: '100%', fontSize: 13 }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${TOKENS.border}` }}>
                  <th style={{ textAlign: 'left', padding: 12 }}>Mint / Symbol</th>
                  <th style={{ textAlign: 'left', padding: 12 }}>Created</th>
                  <th style={{ textAlign: 'left', padding: 12 }}>Outcome</th>
                  <th style={{ textAlign: 'right', padding: 12 }}>SOL Drained</th>
                  <th style={{ textAlign: 'right', padding: 12 }}>Lifespan</th>
                </tr>
              </thead>
              <tbody>
                {data.tokens.map((t, i) => (
                  <tr key={i} style={{ borderTop: i > 0 ? `1px solid ${TOKENS.border}` : 'none' }}>
                    <td style={{ padding: 12, fontFamily: TOKENS.mono }}>{t.symbol}</td>
                    <td style={{ padding: 12, color: TOKENS.muted }}>{t.created}</td>
                    <td style={{ padding: 12 }}>
                      <span style={{ color: TOKENS.critical }}>{t.outcome}</span>
                    </td>
                    <td style={{ padding: 12, textAlign: 'right' }}>${t.solDrained.toLocaleString()}</td>
                    <td style={{ padding: 12, textAlign: 'right', color: TOKENS.muted }}>{t.lifespan}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{ marginTop: 8, fontSize: 12, color: TOKENS.amber }}>Show all 3,212 tokens →</div>
        </div>

        {/* NETWORK CONNECTIONS + ACTIVITY */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          <div>
            <h3 style={{ marginBottom: 12, fontSize: 15 }}>Network Connections</h3>
            <div style={{ background: TOKENS.surface, border: `1px solid ${TOKENS.border}`, borderRadius: 10, padding: 14 }}>
              {data.connections.map((c, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: i < data.connections.length - 1 ? `1px solid ${TOKENS.border}` : 'none' }}>
                  <span style={{ fontFamily: TOKENS.mono }}>{c.wallet.slice(0, 6)}…{c.wallet.slice(-4)}</span>
                  <span style={{ color: TOKENS.muted }}>{c.relation}</span>
                </div>
              ))}
              <div style={{ marginTop: 10 }}>
                <Link href={`/network/${data.wallet}`} style={{ color: TOKENS.amber, fontSize: 13 }}>Open full network →</Link>
              </div>
            </div>
          </div>

          <div>
            <h3 style={{ marginBottom: 12, fontSize: 15 }}>Recent Activity</h3>
            <div style={{ background: TOKENS.surface, border: `1px solid ${TOKENS.border}`, borderRadius: 10, padding: 14 }}>
              {data.activity.map((a, i) => (
                <div key={i} style={{ padding: '6px 0', borderBottom: i < data.activity.length - 1 ? `1px solid ${TOKENS.border}` : 'none', fontSize: 13 }}>
                  <span style={{ color: TOKENS.muted }}>{a.time}</span> — <strong>{a.action}</strong> {a.target}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
