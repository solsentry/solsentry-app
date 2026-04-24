const PillarGrid = () => {
  const pillars = [
    { l: 'PREVENT', c: 'var(--brand-orange)', t: 'Fast Scanner', d: 'Risk score on every new Solana deploy in under 2 seconds. Holders, authorities, concentration, serial-deployer match.', icon: 'M21 21l-4.3-4.3M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0z' },
    { l: 'TRACK',   c: 'var(--brand-teal)',   t: 'Drain Flow',   d: 'Ten-hop fund-flow tracking through bridges and DEXes. Operator-to-wallet social graph cross-referenced on every scan.', icon: 'M3 7h13M3 7l4-4M3 7l4 4M21 17H8M21 17l-4-4M21 17l-4 4' },
    { l: 'EXPLAIN', c: 'var(--brand-white)',  t: 'Explain by AI', d: 'AI-powered risk explanations in PT-BR and English. Human-readable output of why an operator was flagged and what they did last time. Provider-agnostic.', icon: 'M4 17l6-6-6-6M12 19h8' },
    { l: 'EVOLVE',  c: 'var(--brand-purple)', t: 'ALife Agents', d: '30 agents with 7-gene DNA. They mutate, reproduce, and get culled based on prediction accuracy. Inspired by Tierra and Avida.', icon: 'M13 2L3 14h9l-1 8 10-12h-9l1-8z' },
  ];
  return (
    <section style={{ padding: '96px 48px', maxWidth: 1280, margin: '0 auto' }} id="product">
      <div style={{ fontFamily: 'var(--font-body)', fontWeight: 500, fontSize: 12, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--fg-3)', marginBottom: 14 }}>Four pillars</div>
      <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 60, letterSpacing: '-0.02em', lineHeight: 1.05, color: 'var(--fg-1)', maxWidth: 900, margin: 0 }}>
        Operator-level intelligence, not token-by-token detection.
      </h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 20, marginTop: 48 }}>
        {pillars.map(p => (
          <div key={p.l} style={{
            background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 6,
            padding: 32, display: 'flex', flexDirection: 'column', gap: 18,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={p.c} strokeWidth="2"><path d={p.icon}/></svg>
              <span style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 12, letterSpacing: '0.2em', textTransform: 'uppercase', color: p.c }}>{p.l}</span>
            </div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 30, letterSpacing: '-0.02em', margin: 0, color: 'var(--fg-1)' }}>{p.t}</h3>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 15, color: 'var(--fg-2)', lineHeight: 1.65, margin: 0 }}>{p.d}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

window.PillarGrid = PillarGrid;
