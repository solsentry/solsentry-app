// Top bar with logo, search, live runtime
const TopBar = ({ runtimeHours = 240, scans = '20,105+' }) => (
  <header style={{
    height: 56, background: 'var(--surface)', borderBottom: '1px solid var(--border)',
    display: 'flex', alignItems: 'center', padding: '0 20px', gap: 20, position: 'sticky', top: 0, zIndex: 10,
  }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <img src="../../assets/logo-shield.svg" width="22" height="22" alt="" />
      <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18, letterSpacing: '-0.01em', textTransform: 'uppercase' }}>SOLSENTRY</span>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--fg-3)', marginLeft: 6, padding: '2px 6px', border: '1px solid var(--border)', borderRadius: 2 }}>v2.3.20</span>
    </div>
    <div style={{
      flex: 1, display: 'flex', alignItems: 'center', gap: 10, maxWidth: 560,
      background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 4, padding: '6px 12px',
    }}>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: 'var(--fg-3)' }}>
        <circle cx="11" cy="11" r="7" /><path d="M20 20l-4-4" />
      </svg>
      <input placeholder="Scan wallet, token, or operator…" style={{
        flex: 1, background: 'transparent', border: 'none', outline: 'none',
        color: 'var(--fg-1)', fontFamily: 'var(--font-mono)', fontSize: 13,
      }} />
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--fg-4)', padding: '1px 5px', border: '1px solid var(--border)', borderRadius: 2 }}>⌘K</span>
    </div>
    <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginLeft: 'auto', fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-3)' }}>
      <span><span style={{ color: 'var(--brand-teal)' }}>●</span> Mainnet</span>
      <span>{runtimeHours}h runtime</span>
      <span>{scans} scans</span>
    </div>
  </header>
);

window.TopBar = TopBar;
