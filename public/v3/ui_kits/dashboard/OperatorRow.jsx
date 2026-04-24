// Operator row for serial-deployer table
const OperatorRow = ({ handle, wallets, deploys, avgRisk, lastSeen, status = 'tracking' }) => {
  const statusColor = status === 'flagged' ? 'var(--status-critical)' : status === 'tracking' ? 'var(--brand-teal)' : 'var(--fg-3)';
  return (
    <div style={{
      display: 'grid', gridTemplateColumns: '1.6fr 0.8fr 0.8fr 0.8fr 1fr 0.9fr',
      gap: 16, padding: '14px 18px', borderBottom: '1px solid var(--border)',
      alignItems: 'center', fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--fg-2)',
    }}>
      <span style={{ color: 'var(--brand-orange)', fontWeight: 500 }}>{handle}</span>
      <span>{wallets}</span>
      <span>{deploys}</span>
      <span style={{ color: avgRisk >= 75 ? 'var(--status-critical)' : avgRisk >= 50 ? 'var(--status-warning)' : 'var(--fg-2)' }}>
        {avgRisk}/100
      </span>
      <span style={{ color: 'var(--fg-3)', fontSize: 12 }}>{lastSeen}</span>
      <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'var(--font-body)', fontWeight: 500, fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: statusColor }}>
        <span style={{ width: 6, height: 6, borderRadius: 999, background: statusColor }} />
        {status}
      </span>
    </div>
  );
};

window.OperatorRow = OperatorRow;
