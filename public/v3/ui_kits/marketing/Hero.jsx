const Hero = () => (
  <section style={{
    padding: '80px 48px 72px', position: 'relative', overflow: 'hidden',
    backgroundColor: 'var(--bg)',
    backgroundImage: 'linear-gradient(rgba(255,107,0,.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,107,0,.04) 1px, transparent 1px)',
    backgroundSize: '64px 64px',
    borderBottom: '1px solid var(--border)',
  }}>
    <div style={{ maxWidth: 1280, margin: '0 auto', display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: 48, alignItems: 'center' }}>
      <div>
        <div style={{ fontFamily: 'var(--font-body)', fontWeight: 500, fontSize: 12, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--brand-orange)', marginBottom: 20, paddingLeft: 14, borderLeft: '2px solid var(--brand-orange)' }}>
          Solana Security Intelligence
        </div>
        <h1 style={{
          fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 120, lineHeight: 0.92,
          letterSpacing: '-0.035em', color: 'var(--brand-orange)', textTransform: 'uppercase', margin: 0,
        }}>SOLSENTRY</h1>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 22, lineHeight: 1.4, color: 'var(--fg-2)', maxWidth: 620, marginTop: 28 }}>
          RugCheck tells you a fire is burning. <span style={{ color: 'var(--fg-1)' }}>SolSentry tells you who lit it</span> — and where they're going next.
        </p>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 15, color: 'var(--fg-3)', marginTop: 10, fontStyle: 'italic' }}>
          Analyzes. Tracks. Explains. Evolves. · <span style={{ fontFamily: 'var(--font-mono)', fontStyle: 'normal' }}>Analisa. Rastreia. Explica. Evolui.</span>
        </p>
        <div style={{ display: 'flex', gap: 10, marginTop: 32 }}>
          <a href="https://t.me/solsentryai" style={{
            fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 13, letterSpacing: '0.18em', textTransform: 'uppercase',
            color: '#0A0A0A', background: 'var(--brand-orange)', textDecoration: 'none',
            padding: '13px 22px', borderRadius: 4, display: 'inline-block',
          }}>Open Telegram Bot →</a>
          <a href="#casestudy" style={{
            fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 13, letterSpacing: '0.18em', textTransform: 'uppercase',
            color: 'var(--fg-1)', background: 'transparent', border: '1px solid var(--border-strong)', textDecoration: 'none',
            padding: '12px 22px', borderRadius: 4, display: 'inline-block',
          }}>Read Case Study</a>
        </div>
      </div>
      <div style={{ position: 'relative', aspectRatio: '1', maxWidth: 460, marginLeft: 'auto' }}>
        <img src="../../assets/logo-shield-reticle.svg" alt="" style={{ width: '100%', height: '100%' }} />
      </div>
    </div>

    <div style={{
      maxWidth: 1280, margin: '72px auto 0', display: 'grid',
      gridTemplateColumns: 'repeat(5, 1fr)', gap: 0,
      borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)',
    }}>
      {[
        { v: '20,105+', l: 'Scans' },
        { v: '83.8%',   l: 'Accuracy' },
        { v: '30',      l: 'Hunters Active' },
        { v: '240h+',   l: 'Runtime' },
        { v: '778',     l: 'Operators Mapped' },
      ].map((m, i) => (
        <div key={i} style={{ padding: '22px 20px', borderLeft: i === 0 ? 'none' : '1px solid var(--border)' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 32, letterSpacing: '-0.02em', color: 'var(--fg-1)', fontVariantNumeric: 'tabular-nums' }}>
            {m.v}
          </div>
          <div style={{ fontFamily: 'var(--font-body)', fontWeight: 500, fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--fg-3)', marginTop: 6 }}>{m.l}</div>
        </div>
      ))}
    </div>
  </section>
);

window.Hero = Hero;
