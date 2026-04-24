/* Shared nav for all SolSentry pages — expects React + hash routing */
/* global React */
const { useState, useEffect } = React;

function SSShieldMark({ size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <path d="M20 3L6 9v11c0 8.5 5.8 16.3 14 18 8.2-1.7 14-9.5 14-18V9L20 3z"
        fill="rgba(255,107,0,0.18)" stroke="#FF6B00" strokeWidth="1.6"/>
      <circle cx="20" cy="20" r="4.5" stroke="#FF6B00" strokeWidth="1.4"/>
      <circle cx="20" cy="20" r="1.6" fill="#FF6B00"/>
      <line x1="20" y1="4.5" x2="20" y2="34" stroke="#FF6B00" strokeWidth="1" opacity="0.5"/>
    </svg>
  );
}

const SS_LINKS = [
  { label: 'Home',      href: 'index.html',      key: 'home' },
  { label: 'Dashboard', href: 'dashboard.html',  key: 'dash' },
  { label: 'Explorer',  href: 'explorer.html',   key: 'graph' },
  { label: 'Docs',      href: 'docs.html',       key: 'docs' },
  { label: 'Everything',href: 'everything.html', key: 'all' },
];

function SSNav({ active = 'home' }) {
  const [lang, setLang] = useState('EN');
  return (
    <nav className="ss-nav" aria-label="Primary">
      <a href="index.html" className="ss-pill ss-brand">
        <span className="ss-mark"><SSShieldMark size={12} /></span>
        <span className="ss-name">SolSentry</span>
      </a>
      <div className="ss-pill ss-menu">
        {SS_LINKS.map((l, i) => (
          <React.Fragment key={l.key}>
            {i > 0 && <span className="ss-div" aria-hidden="true"></span>}
            <a href={l.href} className={'ss-item' + (active === l.key ? ' active' : '')}>
              {l.label}
            </a>
          </React.Fragment>
        ))}
      </div>
      <div className="ss-pill ss-util">
        <div className="ss-seg" role="group" aria-label="Language">
          <button className={lang === 'EN' ? 'on' : ''} onClick={() => setLang('EN')}>EN</button>
          <button className={lang === 'PT' ? 'on' : ''} onClick={() => setLang('PT')}>PT</button>
        </div>
        <a href="https://github.com/solsentry" target="_blank" rel="noopener" className="ss-ic" aria-label="GitHub">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22"/>
          </svg>
        </a>
      </div>
    </nav>
  );
}

Object.assign(window, { SSNav, SSShieldMark });
