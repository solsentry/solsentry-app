// Small pillar-labeled status indicator with pulsing dot
const HunterStatus = ({ count = 30, active = true }) => {
  const c = active ? 'var(--brand-teal)' : 'var(--fg-3)';
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'var(--font-body)', fontSize: 12 }}>
      <span style={{
        width: 8, height: 8, borderRadius: 999, background: c,
        boxShadow: active ? `0 0 0 4px ${c}22` : 'none',
        animation: active ? 'sol-pulse 1.6s ease-in-out infinite' : 'none',
      }} />
      <span style={{ fontWeight: 500, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--fg-3)', fontSize: 11 }}>
        Hunters
      </span>
      <span style={{ fontFamily: 'var(--font-mono)', color: c, fontWeight: 500 }}>{count} active</span>
    </div>
  );
};

window.HunterStatus = HunterStatus;
