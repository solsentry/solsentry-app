// Single scan result card — mirrors Telegram alert structure
const ScanResult = ({ token, contract, risk, holders, topHolder, flags, timestamp, critical = false }) => (
  <article style={{
    background: 'var(--surface)',
    border: `1px solid ${critical ? 'var(--status-critical)' : 'var(--border)'}`,
    boxShadow: critical ? '0 0 24px rgba(255,68,68,.12)' : 'none',
    borderRadius: 6, padding: 20, display: 'flex', flexDirection: 'column', gap: 14,
  }}>
    <header style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <span style={{ fontFamily: 'var(--font-body)', fontWeight: 500, fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--fg-3)' }}>Auto-scan Result</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--fg-4)' }}>{timestamp}</span>
        </div>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 22, letterSpacing: '-0.01em', color: 'var(--fg-1)' }}>
          {token}
        </div>
        <WalletAddress address={contract} />
      </div>
      <div style={{
        fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 40, lineHeight: 1,
        color: critical ? 'var(--status-critical)' : 'var(--brand-orange)',
        fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.02em', textAlign: 'right',
      }}>
        {risk}<span style={{ fontSize: 18, color: 'var(--fg-3)' }}>/100</span>
        <div style={{ fontFamily: 'var(--font-body)', fontWeight: 500, fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: critical ? 'var(--status-critical)' : 'var(--fg-3)', marginTop: 4 }}>
          {critical ? 'Critical' : 'Risk'}
        </div>
      </div>
    </header>
    <div style={{ display: 'flex', gap: 24, padding: '10px 0', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
      <div>
        <div style={{ fontFamily: 'var(--font-body)', fontWeight: 500, fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--fg-3)' }}>Holders</div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 16, color: 'var(--fg-1)', marginTop: 2 }}>{holders}</div>
      </div>
      <div>
        <div style={{ fontFamily: 'var(--font-body)', fontWeight: 500, fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--fg-3)' }}>Top 1</div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 16, color: 'var(--status-critical)', marginTop: 2 }}>{topHolder}%</div>
      </div>
    </div>
    <div>
      <div style={{ fontFamily: 'var(--font-body)', fontWeight: 500, fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--fg-3)', marginBottom: 8 }}>Flags</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        {flags.map(f => <FlagPill key={f.label} label={f.label} tone={f.tone} />)}
      </div>
    </div>
  </article>
);

window.ScanResult = ScanResult;
