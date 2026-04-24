// Horizontal strip of hero metrics
const MetricStrip = () => {
  const metrics = [
    { label: 'Tokens Scanned',    value: '20,105', suffix: '+', tone: 'default' },
    { label: 'Prediction Accuracy', value: '83.8', suffix: '%', tone: 'teal' },
    { label: 'Operators Mapped',  value: '778',    suffix: '',  tone: 'default' },
    { label: 'Serial Deployers',  value: '69',     suffix: '',  tone: 'critical' },
    { label: 'Continuous Runtime', value: '240',   suffix: 'h+', tone: 'default' },
  ];
  const toneColor = { default: 'var(--fg-1)', teal: 'var(--brand-teal)', critical: 'var(--status-critical)' };
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12 }}>
      {metrics.map(m => (
        <div key={m.label} style={{
          background: 'var(--surface)', border: '1px solid var(--border)',
          borderRadius: 6, padding: 18,
        }}>
          <div style={{ fontFamily: 'var(--font-body)', fontWeight: 500, fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--fg-3)' }}>
            {m.label}
          </div>
          <div style={{
            fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 36, lineHeight: 1,
            letterSpacing: '-0.02em', color: toneColor[m.tone],
            fontVariantNumeric: 'tabular-nums', marginTop: 8,
          }}>
            {m.value}<span style={{ color: 'var(--brand-orange)' }}>{m.suffix}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

window.MetricStrip = MetricStrip;
