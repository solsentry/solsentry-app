// Snake_case flag pill with tone-driven colors
const FLAG_TONES = {
  critical: { c: '#FF4444', b: 'rgba(255,68,68,.4)', bg: 'rgba(255,68,68,.06)' },
  warning:  { c: '#FFB020', b: 'rgba(255,176,32,.4)', bg: 'rgba(255,176,32,.06)' },
  info:     { c: '#3AA9FF', b: 'rgba(58,169,255,.4)', bg: 'rgba(58,169,255,.06)' },
  safe:     { c: '#00C9A7', b: 'rgba(0,201,167,.4)', bg: 'rgba(0,201,167,.06)' },
};

const FlagPill = ({ label, tone = 'critical' }) => {
  const t = FLAG_TONES[tone];
  return (
    <span style={{
      fontFamily: 'var(--font-mono)', fontSize: 11,
      padding: '3px 7px', borderRadius: 2,
      border: `1px solid ${t.b}`, color: t.c, background: t.bg,
      letterSpacing: 0, textTransform: 'none',
      display: 'inline-block',
    }}>{label}</span>
  );
};

window.FlagPill = FlagPill;
