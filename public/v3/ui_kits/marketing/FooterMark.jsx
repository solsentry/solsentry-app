const FooterMark = () => (
  <footer style={{ borderTop: '1px solid var(--border)', padding: '56px 48px 32px', backgroundColor: 'var(--bg)' }}>
    <div style={{ maxWidth: 1280, margin: '0 auto' }}>
      <div style={{
        fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 140, lineHeight: 0.9,
        letterSpacing: '-0.035em', color: 'var(--brand-orange)', textTransform: 'uppercase',
        borderBottom: '1px solid var(--border)', paddingBottom: 32,
      }}>SOLSENTRY</div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginTop: 28, flexWrap: 'wrap', gap: 24 }}>
        <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--fg-3)', maxWidth: 360, lineHeight: 1.6 }}>
          Built for the Colosseum Frontier Hackathon · April–May 2026. Powered by Helius, Alchemy, Triton &amp; Claude.
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-4)', marginTop: 10, fontStyle: 'italic' }}>
            Nunca estagnar. Sempre evoluir.
          </div>
        </div>
        <div style={{ display: 'flex', gap: 40, fontFamily: 'var(--font-body)', fontWeight: 500, fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <span style={{ color: 'var(--fg-4)' }}>Product</span>
            <a href="#" style={{ color: 'var(--fg-2)', textDecoration: 'none' }}>Scanner</a>
            <a href="#" style={{ color: 'var(--fg-2)', textDecoration: 'none' }}>API</a>
            <a href="#" style={{ color: 'var(--fg-2)', textDecoration: 'none' }}>Dashboard</a>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <span style={{ color: 'var(--fg-4)' }}>Connect</span>
            <a href="#" style={{ color: 'var(--fg-2)', textDecoration: 'none' }}>Telegram</a>
            <a href="#" style={{ color: 'var(--fg-2)', textDecoration: 'none' }}>X / Twitter</a>
            <a href="#" style={{ color: 'var(--fg-2)', textDecoration: 'none' }}>Docs</a>
          </div>
        </div>
      </div>
    </div>
  </footer>
);

window.FooterMark = FooterMark;
