// Left side nav — real product destinations (pillars are marketing taxonomy, not nav)
const SideNav = ({ active = 'dashboard', onNav = () => {} }) => {
  const primary = [
    { key: 'dashboard', label: 'Dashboard', icon: 'M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z' },
    { key: 'operators', label: 'Operators', icon: 'M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5zm0 2c-4 0-8 2-8 6v2h16v-2c0-4-4-6-8-6z' },
    { key: 'clusters',  label: 'Clusters',  icon: 'M6 3v6m0 6v6m12-18v6m0 6v6M3 6h6m6 0h6M3 18h6m6 0h6M9 9l6 6m0-6l-6 6' },
    { key: 'scan',      label: 'Scan',      icon: 'M21 21l-4.3-4.3M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0z' },
    { key: 'settings',  label: 'Settings',  icon: 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm7.4-3a7.4 7.4 0 0 0-.1-1.4l2-1.5-2-3.4-2.3.9a7 7 0 0 0-2.4-1.4L14 3h-4l-.6 2.2a7 7 0 0 0-2.4 1.4l-2.3-.9-2 3.4 2 1.5a7.4 7.4 0 0 0 0 2.8l-2 1.5 2 3.4 2.3-.9a7 7 0 0 0 2.4 1.4L10 21h4l.6-2.2a7 7 0 0 0 2.4-1.4l2.3.9 2-3.4-2-1.5a7.4 7.4 0 0 0 .1-1.4z' },
  ];
  return (
    <aside style={{
      width: 220, background: 'var(--surface)', borderRight: '1px solid var(--border)',
      padding: '20px 12px', display: 'flex', flexDirection: 'column', gap: 20,
    }}>
      <div>
        <div style={{ fontFamily: 'var(--font-body)', fontWeight: 500, fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--fg-4)', padding: '0 8px 8px' }}>Navigate</div>
        {primary.map(it => {
          const on = it.key === active;
          return (
            <button key={it.key} onClick={() => onNav(it.key)} style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: 10,
              padding: '9px 10px', borderRadius: 4, border: 'none',
              background: on ? 'var(--surface-3)' : 'transparent',
              borderLeft: on ? `2px solid var(--brand-orange)` : '2px solid transparent',
              color: on ? 'var(--fg-1)' : 'var(--fg-2)',
              fontFamily: 'var(--font-body)', fontWeight: 500, fontSize: 13,
              cursor: 'pointer', textAlign: 'left', marginBottom: 2,
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={on ? 'var(--brand-orange)' : 'currentColor'} strokeWidth="2"><path d={it.icon}/></svg>
              {it.label}
            </button>
          );
        })}
      </div>
      <div style={{ marginTop: 'auto', padding: 12, border: '1px solid var(--border)', borderRadius: 4, background: 'var(--bg)' }}>
        <div style={{ fontFamily: 'var(--font-body)', fontWeight: 500, fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--fg-3)', marginBottom: 6 }}>RPC Health</div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-2)', display: 'flex', justifyContent: 'space-between' }}>
          <span>Helius</span><span style={{ color: 'var(--brand-teal)' }}>5/5</span>
        </div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-2)', display: 'flex', justifyContent: 'space-between' }}>
          <span>Alchemy</span><span style={{ color: 'var(--brand-teal)' }}>3/3</span>
        </div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-2)', display: 'flex', justifyContent: 'space-between' }}>
          <span>Triton</span><span style={{ color: 'var(--brand-teal)' }}>1/1</span>
        </div>
      </div>
    </aside>
  );
};

window.SideNav = SideNav;
