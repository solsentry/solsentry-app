const CompetitiveTable = () => {
  const cols = ['RugCheck', 'SolScanner', 'ChainAware', 'Blockaid', 'SolSentry'];
  const rows = [
    ['Token-level analysis',        [1, 0, 0, 1, 1]],
    ['Wallet graph visualization',  [0, 1, 0, 0, 1]],
    ['Per-wallet fraud scoring',    [0, 0, 1, 0, 1]],
    ['Operator tracking',           [0, 0, 0, 0, 1]],
    ['Serial deployer detection',   [0, 0, 0, 0, 1]],
    ['Social graph mapping',        [0, 0, 0, 0, 1]],
    ['Bot cluster fingerprinting',  [0, 1, 0, 0, 1]],
    ['KOL-operator correlation',    [0, 0, 0, 0, 1]],
    ['Autonomous 24/7 detection',   [0, 0, 0, 1, 1]],
    ['ALife agent evolution',       [0, 0, 0, 0, 1]],
  ];
  const cell = (v, isSelf) => {
    if (v === 1) return <span style={{ color: isSelf ? 'var(--brand-orange)' : 'var(--brand-teal)', fontFamily: 'var(--font-mono)' }}>✓</span>;
    if (v === 2) return <span style={{ color: 'var(--fg-3)', fontFamily: 'var(--font-mono)' }}>soon</span>;
    return <span style={{ color: 'var(--fg-4)', fontFamily: 'var(--font-mono)' }}>—</span>;
  };
  return (
    <section style={{ padding: '96px 48px', maxWidth: 1280, margin: '0 auto' }}>
      <div style={{ fontFamily: 'var(--font-body)', fontWeight: 500, fontSize: 12, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--fg-3)', marginBottom: 14 }}>Competitive landscape</div>
      <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 52, letterSpacing: '-0.02em', lineHeight: 1.05, margin: 0, color: 'var(--fg-1)', maxWidth: 880 }}>
        SolScanner shows you the graph when you ask. SolSentry builds it while you sleep.
      </h2>
      <div style={{ marginTop: 48, border: '1px solid var(--border)', borderRadius: 6, overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr repeat(5, 1fr)', background: 'var(--surface)' }}>
          <div style={{ padding: '14px 20px', fontFamily: 'var(--font-body)', fontWeight: 500, fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--fg-3)' }}>Capability</div>
          {cols.map(c => (
            <div key={c} style={{
              padding: '14px 16px', textAlign: 'center',
              fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase',
              color: c === 'SolSentry' ? 'var(--brand-orange)' : 'var(--fg-2)',
              background: c === 'SolSentry' ? 'rgba(255,107,0,0.06)' : 'transparent',
            }}>{c}</div>
          ))}
        </div>
        {rows.map((r, i) => (
          <div key={i} style={{ display: 'grid', gridTemplateColumns: '2fr repeat(5, 1fr)', borderTop: '1px solid var(--border)' }}>
            <div style={{ padding: '14px 20px', fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--fg-1)' }}>{r[0]}</div>
            {r[1].map((v, j) => (
              <div key={j} style={{
                padding: '14px 16px', textAlign: 'center', fontSize: 15,
                background: j === 4 ? 'rgba(255,107,0,0.04)' : 'transparent',
              }}>{cell(v, j === 4)}</div>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
};

window.CompetitiveTable = CompetitiveTable;
