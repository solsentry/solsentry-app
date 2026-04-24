const MarketingNav = () => (
  <nav style={{
    display: 'flex', alignItems: 'center', padding: '18px 48px',
    borderBottom: '1px solid var(--border)', background: 'rgba(10,10,10,0.7)',
    backdropFilter: 'blur(8px)', position: 'sticky', top: 0, zIndex: 10,
  }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <img src="../../assets/logo-shield.svg" width="22" height="22" alt="" />
      <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18, letterSpacing: '-0.01em', textTransform: 'uppercase' }}>SOLSENTRY</span>
    </div>
    <div style={{ display: 'flex', gap: 28, marginLeft: 64, fontFamily: 'var(--font-body)', fontWeight: 500, fontSize: 12, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--fg-3)' }}>
      <a href="#product" style={{ color: 'inherit', textDecoration: 'none' }}>Product</a>
      <a href="#alife" style={{ color: 'inherit', textDecoration: 'none' }}>ALife</a>
      <a href="#casestudy" style={{ color: 'inherit', textDecoration: 'none' }}>Case Study</a>
      <a href="#api" style={{ color: 'inherit', textDecoration: 'none' }}>API</a>
      <a href="#docs" style={{ color: 'inherit', textDecoration: 'none' }}>Docs</a>
    </div>
    <div style={{ marginLeft: 'auto', display: 'flex', gap: 10 }}>
      <a href="#" style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 12, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--fg-2)', textDecoration: 'none', padding: '9px 14px' }}>Telegram</a>
      <a href="https://t.me/solsentryai" style={{
        fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 12, letterSpacing: '0.15em', textTransform: 'uppercase',
        color: '#0A0A0A', background: 'var(--brand-orange)', textDecoration: 'none',
        padding: '9px 16px', borderRadius: 4,
      }}>Open Telegram →</a>
    </div>
  </nav>
);

window.MarketingNav = MarketingNav;
