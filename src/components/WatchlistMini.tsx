"use client";

import React, { useState } from 'react';
import { Plus, X, Copy } from 'lucide-react';

interface WatchedWallet {
  address: string;
  lastEvent: string;
  risk: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'SAFE';
  time: string;
}

const DESIGN = {
  surface: '#1a1a1a',
  border: '#262626',
  amber: '#f59e0b',
  text: '#fafafa',
  muted: '#a3a3a3',
};

const MOCK_WATCHLIST: WatchedWallet[] = [
  {
    address: '4kxscuteRLQdNiTXA33YYsvywAPNA6DQTifswxjL5pH1',
    lastEvent: '🔴 Deployed token 2m ago',
    risk: 'CRITICAL',
    time: '2m',
  },
  {
    address: '7vKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU',
    lastEvent: '⚠️ Connected to flagged op',
    risk: 'HIGH',
    time: '19m',
  },
  {
    address: '9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM',
    lastEvent: '🟢 No activity 4d',
    risk: 'MEDIUM',
    time: '4d',
  },
];

export function WatchlistMini() {
  const [wallets, setWallets] = useState(MOCK_WATCHLIST);
  const [showAdd, setShowAdd] = useState(false);
  const [newAddress, setNewAddress] = useState('');

  const handleRemove = (addr: string) => {
    setWallets(wallets.filter(w => w.address !== addr));
  };

  const handleAdd = () => {
    if (!newAddress.trim()) return;

    const fakeRisks: WatchedWallet['risk'][] = ['CRITICAL', 'HIGH', 'MEDIUM'];
    setWallets([
      ...wallets,
      {
        address: newAddress.trim(),
        lastEvent: '🟢 Added just now',
        risk: fakeRisks[Math.floor(Math.random() * fakeRisks.length)],
        time: 'now',
      },
    ]);
    setNewAddress('');
    setShowAdd(false);
  };

  const copy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div
      style={{
        background: DESIGN.surface,
        border: `1px solid ${DESIGN.border}`,
        borderRadius: 12,
        padding: 16,
        width: '100%',
        maxWidth: 320,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontWeight: 600, fontSize: 14 }}>Your Watchlist</span>
          <span style={{
            fontSize: 11,
            background: 'rgba(255,255,255,0.08)',
            padding: '1px 7px',
            borderRadius: 999,
            color: DESIGN.muted
          }}>
            {wallets.length}/10
          </span>
        </div>
        <button
          onClick={() => setShowAdd(!showAdd)}
          style={{
            background: 'transparent',
            border: 'none',
            color: DESIGN.amber,
            cursor: 'pointer',
            padding: 4,
          }}
          title="Add to watchlist"
        >
          <Plus size={16} />
        </button>
      </div>

      {showAdd && (
        <div style={{ marginBottom: 12, display: 'flex', gap: 6 }}>
          <input
            type="text"
            value={newAddress}
            onChange={(e) => setNewAddress(e.target.value)}
            placeholder="Wallet address..."
            style={{
              flex: 1,
              background: '#111',
              border: `1px solid ${DESIGN.border}`,
              borderRadius: 6,
              padding: '6px 10px',
              fontSize: 12,
              color: DESIGN.text,
              fontFamily: 'monospace',
            }}
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          />
          <button
            onClick={handleAdd}
            style={{
              background: DESIGN.amber,
              color: '#111',
              border: 'none',
              borderRadius: 6,
              padding: '0 12px',
              fontSize: 12,
              fontWeight: 600,
            }}
          >
            Add
          </button>
        </div>
      )}

      {wallets.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '20px 10px', color: DESIGN.muted, fontSize: 13 }}>
          Start watching wallets to get alerts here
          <button
            onClick={() => setShowAdd(true)}
            style={{ display: 'block', margin: '8px auto 0', color: DESIGN.amber, background: 'none', border: 'none', cursor: 'pointer' }}
          >
            + Add wallet
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {wallets.map((w, index) => (
            <a
              key={index}
              href={`/operator/${w.address}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '8px 6px',
                borderRadius: 8,
                textDecoration: 'none',
                color: 'inherit',
                fontSize: 13,
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
                <span
                  onClick={(e) => { e.preventDefault(); copy(w.address); }}
                  style={{ cursor: 'pointer', opacity: 0.6 }}
                  title="Copy address"
                >
                  <Copy size={13} />
                </span>
                <span style={{ fontFamily: 'monospace', fontSize: 12 }}>
                  {w.address.slice(0, 6)}…{w.address.slice(-4)}
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12 }}>
                <span style={{ color: DESIGN.muted }}>{w.lastEvent}</span>
                <span style={{
                  fontSize: 10,
                  padding: '1px 5px',
                  borderRadius: 4,
                  background: w.risk === 'CRITICAL' ? '#ef444420' : '#f59e0b20',
                  color: w.risk === 'CRITICAL' ? '#ef4444' : '#f59e0b',
                }}>
                  {w.risk}
                </span>

                <span
                  onClick={(e) => { e.preventDefault(); handleRemove(w.address); }}
                  style={{ cursor: 'pointer', opacity: 0.5, marginLeft: 4 }}
                  title="Remove from watchlist"
                >
                  <X size={14} />
                </span>
              </div>
            </a>
          ))}
        </div>
      )}

      <div style={{ marginTop: 12, paddingTop: 10, borderTop: `1px solid ${DESIGN.border}` }}>
        <a
          href="/pro/watchlist"
          style={{ fontSize: 12, color: DESIGN.amber, textDecoration: 'none' }}
        >
          Manage watchlist →
        </a>
      </div>
    </div>
  );
}
