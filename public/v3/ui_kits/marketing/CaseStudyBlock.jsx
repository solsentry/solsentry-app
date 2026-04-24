const CaseStudyBlock = () => (
  <section id="casestudy" style={{ padding: '96px 48px', borderTop: '1px solid var(--border)', backgroundColor: 'var(--bg-elev-1)' }}>
    <div style={{ maxWidth: 1280, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1.1fr', gap: 56 }}>
      <div>
        <div style={{ fontFamily: 'var(--font-body)', fontWeight: 500, fontSize: 12, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--status-critical)', marginBottom: 14 }}>Case study · Operator 4kxscute</div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 52, letterSpacing: '-0.02em', lineHeight: 1.05, color: 'var(--fg-1)', margin: 0 }}>
          No other tool connected this deploy to the operator.
        </h2>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 17, color: 'var(--fg-2)', lineHeight: 1.6, marginTop: 24 }}>
          SolSentry had been tracking wallet <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--brand-orange)' }}>4kxscute</span> as part of a coordinated bot cluster — wallets sharing SOL funding sources and executing same-block buy patterns.
          When the operator deployed a new token, hunter_1570 fired instantly.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0, marginTop: 32, border: '1px solid var(--border)', borderRadius: 6, overflow: 'hidden' }}>
          {[
            { k: 'Risk Score', v: '100/100', c: 'var(--status-critical)' },
            { k: 'Holders',    v: '1',        c: 'var(--fg-1)' },
            { k: 'Top 1 Ownership', v: '100%', c: 'var(--status-critical)' },
            { k: 'Time to Alert', v: '< 2s',   c: 'var(--brand-teal)' },
          ].map((x, i) => (
            <div key={i} style={{ padding: 20, background: 'var(--surface)', borderRight: i % 2 === 0 ? '1px solid var(--border)' : 'none', borderBottom: i < 2 ? '1px solid var(--border)' : 'none' }}>
              <div style={{ fontFamily: 'var(--font-body)', fontWeight: 500, fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--fg-3)' }}>{x.k}</div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 30, letterSpacing: '-0.02em', color: x.c, marginTop: 6, fontVariantNumeric: 'tabular-nums' }}>{x.v}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 6, padding: 6, alignSelf: 'start' }}>
        <img src="../../assets/alert-telegram-4kxscute.png" alt="4kxscute Telegram alert" style={{ width: '100%', display: 'block', borderRadius: 3 }} />
      </div>
    </div>
  </section>
);

window.CaseStudyBlock = CaseStudyBlock;
